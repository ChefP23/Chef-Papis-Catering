'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Catering() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    guest_count: '',
    location: '',
    budget: '',
    menu_ideas: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.phone || !form.event_type || !form.event_date || !form.guest_count) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('catering_requests').insert([{
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        event_type: form.event_type,
        event_date: form.event_date,
        guest_count: parseInt(form.guest_count) || 0,
        location: form.location,
        budget: form.budget,
        menu_ideas: form.menu_ideas,
        notes: form.notes,
        status: 'new',
      }])
      if (dbError) throw dbError
      setSubmitted(true)
    } catch (e: any) {
      setError('Something went wrong. Please try again or text us directly.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid rgba(45,74,62,0.2)',
    background: '#FAF7F2',
    color: '#1C1C1C',
    fontSize: 15,
    fontFamily: 'var(--font-dm-sans)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600 as const,
    color: '#4A4A4A',
    marginBottom: 6,
    display: 'block' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  }

  const eventTypes = ['School Event','Corporate Lunch','Birthday Party','Wedding / Reception','Baby / Bridal Shower','Holiday Party','Church / Community Event','Other']
  const budgetRanges = ['$400 - $750','$750 - $1,500','$1,500 - $3,000','$3,000+','Not sure yet']

  return (
    <main style={{ background: '#FAF7F2', fontFamily: 'var(--font-dm-sans)' }}>
      <header style={{ background: 'rgba(250,247,242,0.95)', borderBottom: '1px solid rgba(196,154,43,0.2)', padding: '0 clamp(16px, 5vw, 64px)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: '#2D4A3E', border: '2px solid #C49A2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 900, color: '#E8B84B' }}>CP</div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#2D4A3E', lineHeight: 1 }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: '#C49A2B', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }}>Catering - Maryland</div>
            </div>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a href="/#services" style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>What We Offer</a>
            <Link href="/meal-prep" style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>Meal Prep</Link>
            <Link href="/foodie-friday" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#2D4A3E', marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>

      <section style={{ background: '#2D4A3E', padding: '80px clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>Event Catering</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(40px, 7vw, 72px)', color: '#fff', lineHeight: 1, marginBottom: 20 }}>
            We Bring<br /><span style={{ color: '#E8B84B' }}>the Party.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            School events, corporate lunches, birthdays, celebrations. Chef Papi delivers restaurant-quality food right to your venue across Maryland.
          </p>
        </div>
      </section>

      <section style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Why Chef Papi&apos;s</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#2D4A3E' }}>What You Can Expect</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { title: 'Restaurant Quality', desc: 'Every dish is prepared fresh with quality ingredients. Not catering food, real food.' },
              { title: 'Maryland Local', desc: 'Serving Brunswick, Montgomery County, Frederick County, and surrounding areas.' },
              { title: 'Flexible Menus', desc: 'Caribbean-inspired, soul food, and fusion options built around your event needs.' },
              { title: 'Fair Pricing', desc: 'Minimum $400. Transparent pricing with a 25% deposit to secure your date.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid rgba(45,74,62,0.1)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#2D4A3E', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" style={{ background: '#F5F0E8', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Request a Quote</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E', marginBottom: 12 }}>Tell Us About Your Event</h2>
            <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.7 }}>Fill out the details below. Chef will get back to you within 24 hours with a custom quote.</p>
          </div>

          {submitted ? (
            <div style={{ background: '#2D4A3E', borderRadius: 24, padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, color: '#E8B84B', marginBottom: 16 }}>Request Received!</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 12 }}>
                Chef Papi will reach out to {form.email} within 24 hours with a custom quote.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
                A 25% deposit is required to secure your date once the quote is accepted.
              </p>
              <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#C49A2B', color: '#1C1C1C', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Back to Home</Link>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.12)', borderRadius: 24, padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
              {error && (
                <div style={{ background: 'rgba(155,21,21,0.08)', border: '1px solid rgba(155,21,21,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#9B1515' }}>{error}</div>
              )}

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>Your Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="301-555-1234" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>Event Details</div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Type of Event</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {eventTypes.map(type => (
                    <button key={type} onClick={() => set('event_type', type)} style={{ padding: '12px 14px', borderRadius: 10, border: `2px solid ${form.event_type === type ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.event_type === type ? 'rgba(45,74,62,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: form.event_type === type ? 700 : 400, color: form.event_type === type ? '#2D4A3E' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Event Date</label>
                  <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Guest Count</label>
                  <input type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} placeholder="e.g. 50" min="1" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Event Location / Venue</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Address or venue name, city" style={inputStyle} />
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>Budget and Menu</div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Estimated Budget</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {budgetRanges.map(b => (
                    <button key={b} onClick={() => set('budget', b)} style={{ padding: '10px 18px', borderRadius: 100, border: `2px solid ${form.budget === b ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.budget === b ? '#2D4A3E' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.budget === b ? '#fff' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Menu Ideas or Preferences</label>
                <textarea value={form.menu_ideas} onChange={e => set('menu_ideas', e.target.value)} placeholder="e.g. Jerk chicken, rice and beans, appetizers, dietary restrictions..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Setup needs, serving style, anything else Chef should know..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 16, background: loading ? 'rgba(45,74,62,0.5)' : '#2D4A3E', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                {loading ? 'Submitting...' : 'Request My Quote'}
              </button>
              <p style={{ fontSize: 12, color: '#7A7A7A', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                Minimum $400 - 25% deposit to hold your date - No payment collected here
              </p>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>What Happens Next</div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E', marginBottom: 48 }}>Your Event, Handled</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '1', title: 'Submit Request', desc: 'Fill out the form above with your event details.' },
              { step: '2', title: 'Chef Reviews', desc: 'Chef Papi reviews your request and reaches out within 24 hours.' },
              { step: '3', title: 'Get Your Quote', desc: 'Receive a custom quote based on your event size, menu, and date.' },
              { step: '4', title: 'Lock It In', desc: 'Pay a 25% deposit to secure your date. Chef handles the rest.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#2D4A3E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#E8B84B' }}>{step}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: '#2D4A3E', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: '#1C1C1C', padding: '40px clamp(16px, 5vw, 64px) 32px', borderTop: '1px solid rgba(196,154,43,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, color: '#E8B84B' }}>Chef Papi&apos;s Catering</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>2026 Chef Papi&apos;s - Brunswick, MD</p>
        </div>
      </footer>
    </main>
  )
}
