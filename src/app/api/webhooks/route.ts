import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/notifications'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover' as any,
})

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id
    const customerId = session.metadata?.customer_id

    if (orderId) {
      // Update order to paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      // Update customer lifetime spend
      if (customerId) {
        const { data: customer } = await supabase
          .from('customers')
          .select('lifetime_spend, first_name, last_name, email, phone')
          .eq('id', customerId)
          .single()

        await supabase
          .from('customers')
          .update({
            lifetime_spend: Number(customer?.lifetime_spend || 0) + Number(session.amount_total! / 100),
          })
          .eq('id', customerId)

        // Get full order details for confirmation
        const { data: order } = await supabase
          .from('orders')
          .select('*, order_items(*), menu_cycles(delivery_date, title), customer_phone, sms_opt_in')
          .eq('id', orderId)
          .single()

        if (order && customer) {
          const deliveryDate = order.menu_cycles?.delivery_date
            ? new Date(order.menu_cycles.delivery_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            : 'This Friday'

          const orderItems = (order.order_items || []).map((item: any) => ({
            name: item.item_name,
            quantity: item.quantity,
            price: Number(item.item_price),
          }))

          // Get school name
          let schoolName = order.staff_name ? `${order.staff_name}'s school` : 'your school'
          if (order.school_id) {
            const { data: school } = await supabase
              .from('schools')
              .select('name')
              .eq('id', order.school_id)
              .single()
            if (school) schoolName = school.name
          }

          // Send confirmation email + SMS
          await sendOrderConfirmation({
            customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || order.staff_name || 'there',
            customerEmail: customer.email,
            customerPhone: (order.sms_opt_in && order.customer_phone) ? order.customer_phone : undefined,
            orderItems,
            school: schoolName,
            deliveryDate,
            orderId,
            total: Number(session.amount_total!) / 100,
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
