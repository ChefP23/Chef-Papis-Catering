import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover' as any
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const orderId = session.metadata?.order_id
    const customerId = session.metadata?.customer_id

    if (orderId) {
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (customerId) {
        const { data: customer } = await supabase
          .from('customers')
          .select('lifetime_spend')
          .eq('id', customerId)
          .single()

        await supabase
          .from('customers')
          .update({
            lifetime_spend: Number(customer?.lifetime_spend || 0) + Number(session.amount_total! / 100),
          })
          .eq('id', customerId)
      }
    }
  }

  return NextResponse.json({ received: true })
}
