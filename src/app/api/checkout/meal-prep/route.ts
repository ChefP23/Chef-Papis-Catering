import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    })
    const body = await req.json()
    const { full_name, email, phone, plan, dietary, allergies, start_date, notes } = body

    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 })
    }

    const supabase = await createClient()

    // Save the meal prep request to Supabase
    const { data: request, error: dbError } = await supabase
      .from('meal_prep_requests')
      .insert([{
        full_name,
        email,
        phone,
        plan: plan || 'weekly',
        dietary_preferences: dietary || null,
        allergies: allergies || null,
        requested_start_date: start_date || null,
        notes: notes || null,
        status: 'pending_payment',
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Meal prep insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 })
    }

    // Determine pricing
    const isMonthly = plan === '4week'
    const amount = isMonthly ? 30000 : 10000 // $300 or $100 in cents
    const productName = isMonthly
      ? 'Meal Prep - 4 Week Commitment (20 meals)'
      : 'Meal Prep - Weekly (5 meals)'
    const description = isMonthly
      ? '4 weeks of meal prep, 5 meals/week. Sunday pickup at 6PM, Brunswick MD.'
      : '1 week of meal prep, 5 meals. Sunday pickup at 6PM, Brunswick MD.'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/meal-prep?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/meal-prep?cancelled=1`,
      customer_email: email,
      metadata: {
        type: 'meal_prep',
        meal_prep_request_id: request?.id || '',
        plan,
        full_name,
      },
    })

    // Update the request with Stripe session ID
    if (request?.id) {
      await supabase
        .from('meal_prep_requests')
        .update({ stripe_session_id: session.id })
        .eq('id', request.id)
    }

    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    console.error('Meal prep checkout error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 })
  }
}
