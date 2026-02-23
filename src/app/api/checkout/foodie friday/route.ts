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
    const { cycle_id, school_id, staff_name, items } = body

    if (!cycle_id || !school_id || !staff_name || !items?.length) {
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

    // Get school
    const { data: school } = await supabase
      .from('schools')
      .select('*')
      .eq('name', school_id)
      .single()

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, i: any) => sum + i.item_price * i.quantity, 0)

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
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      items.map((item: any) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        item_name: item.item_name,
        item_price: item.item_price,
        quantity: item.quantity,
        for_staff_name: staff_name,
      }))
    )

    // Build Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.item_name,
          description: `Foodie Friday · ${school_id}`,
        },
        unit_amount: Math.round(item.item_price * 100),
      },
      quantity: item.quantity,
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

    return NextResponse.json({ session_url: session.url, order_id: order.id })

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}