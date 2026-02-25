import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to order.' }, { status: 401 })
    }

    const body = await req.json()
    // Support both naming conventions
    const cycle_id = body.cycleId || body.cycle_id
    const school_name = body.school || body.school_id
    const staff_name = body.staffName || body.staff_name
    const items = body.items

    if (!cycle_id || !school_name || !staff_name || !items?.length) {
      return NextResponse.json({ error: 'Missing required order details.' }, { status: 400 })
    }

    // Get cycle
    const { data: cycle } = await supabase
      .from('menu_cycles')
      .select('*')
      .eq('id', cycle_id)
      .single()

    if (!cycle || cycle.status !== 'published') {
      return NextResponse.json({ error: 'This menu is no longer accepting orders.' }, { status: 400 })
    }

    // Check cutoff
    if (new Date() > new Date(cycle.cutoff_datetime)) {
      return NextResponse.json({ error: 'Order cutoff has passed.' }, { status: 400 })
    }

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
    }

    // Calculate total from cart items
    const subtotal = items.reduce((sum: number, i: any) => {
      const price = Number(i.item_price || i.price || 0)
      const qty = Number(i.quantity || 1)
      return sum + price * qty
    }, 0)

    // Try to find school in DB (optional - don't fail if not found)
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('name', school_name)
      .maybeSingle()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        cycle_id,
        school_id: school?.id || null,
        staff_name,
        status: 'pending',
        subtotal,
        total: subtotal,
        order_source: 'web',
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      items.map((item: any) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id || item.id,
        item_name: item.item_name || item.displayName || item.name,
        item_price: Number(item.item_price || item.price || 0),
        quantity: Number(item.quantity || 1),
        for_staff_name: staff_name,
      }))
    )

    // Build Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.item_name || item.displayName || item.name,
          description: `Foodie Friday · ${school_name}`,
        },
        unit_amount: Math.round(Number(item.item_price || item.price || 0) * 100),
      },
      quantity: Number(item.quantity || 1),
    }))

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/account?order=${order.id}&success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/foodie-friday?cancelled=1`,
      customer_email: customer.email,
      metadata: {
        order_id: order.id,
        customer_id: customer.id,
        cycle_id,
        type: 'foodie_friday',
      },
    })

    // Save session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    // Return both url and session_url for compatibility
    return NextResponse.json({ url: session.url, session_url: session.url, order_id: order.id })

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}
