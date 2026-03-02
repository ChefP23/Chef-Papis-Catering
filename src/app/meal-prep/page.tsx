'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function MealPrep() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    plan: 'weekly',
    dietary: '',
    allergies: '',
    start_date: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.phone) {
      setError('Please fill in your name, email, and phone number.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('meal_prep_requests').insert([{
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        dietary_preferences: form.dietary,
        allergies: form.allergies,
        requested_start_date: form.start_date || null,
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
            <Link href="/catering" style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>Catering</Link>
            <Link href="/foodie-friday" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#2D4A3E', marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>

      <section style={{ background: '#2D4A3E', padding: '80px clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>Weekly Meal Prep</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(40px, 7vw, 72px)', color: '#fff', lineHeight: 1, marginBottom: 20 }}>
            I Cook.<br /><span style={{ color: '#E8B84B' }}>You Eat.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
            5 fresh, restaurant-quality meals every week. Pick up Sunday at 6PM in Brunswick, MD and eat well all week long.
          </p>
          <a href="#signup" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 10, background: '#C49A2B', color: '#1C1C1C', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Sign Up Below</a>
        </div>
      </section>

      <section style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>The Process</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#2D4A3E' }}>Simple as It Gets</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Sign Up Below', desc: 'Fill out the form. Chef will confirm your start date within 24 hours.' },
              { step: '02', title: 'Chef Cooks', desc: 'Every week Chef Papi preps 5 fresh, balanced meals from quality ingredients.' },
              { step: '03', title: 'Sunday Pickup', desc: 'Pick up your meals every Sunday at 6PM in Brunswick, MD.' },
              { step: '04', title: 'Eat Good', desc: 'Reheat and enjoy all week. No cooking, no stress, no compromise.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ textAlign: 'center', padding: '32px 20px', background: '#fff', borderRadius: 20, border: '1px solid rgba(45,74,62,0.1)' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 44, fontWeight: 700, color: 'rgba(196,154,43,0.25)', lineHeight: 1, marginBottom: 12 }}>{step}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#2D4A3E', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F5F0E8', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#2D4A3E', marginBottom: 48 }}>Simple, Honest Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.15)', borderRadius: 24, padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7A7A7A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Weekly</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 56, fontWeight: 700, color: '#2D4A3E', lineHeight: 1 }}>$100</div>
              <div style={{ fontSize: 14, color: '#7A7A7A', marginBottom: 24 }}>per week - 5 meals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 28 }}>
                {['5 freshly prepared meals', 'Sunday pickup at 6PM', 'Rotating weekly menu', 'Cancel anytime'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4A4A4A' }}>
                    <span style={{ color: '#C49A2B', fontWeight: 700 }}>checkmark</span> {f}
                  </div>
                ))}
              </div>
              <a href="#signup" style={{ display: 'block', padding: '13px', background: '#2D4A3E', color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Get Started</a>
            </div>
            <div style={{ background: '#2D4A3E', border: '2px solid #C49A2B', borderRadius: 24, padding: 36, textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#C49A2B', color: '#1C1C1C', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>BEST VALUE - SAVE 25%</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>4 Weeks</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 56, fontWeight: 700, color: '#E8B84B', lineHeight: 1 }}>$300</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>4 weeks - 20 meals total</div>
              <div style={{ fontSize: 13, color: '#C49A2B', fontWeight: 600, marginBottom: 24 }}>Save $100 vs weekly</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 28 }}>
                {['20 freshly prepared meals', 'Sunday pickup at 6PM', 'Rotating weekly menu', 'Priority scheduling'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#C49A2B', fontWeight: 700 }}>checkmark</span> {f}
                  </div>
                ))}
              </div>
              <a href="#signup" style={{ display: 'block', padding: '13px', background: '#C49A2B', color: '#1C1C1C', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Get 4 Weeks</a>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Sign Up</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E', marginBottom: 12 }}>Ready to Start?</h2>
            <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.7 }}>Fill out the form below. Chef will reach out within 24 hours to confirm your start date and collect payment.</p>
          </div>

          {submitted ? (
            <div style={{ background: '#2D4A3E', borderRadius: 24, padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>congrats</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, color: '#E8B84B', marginBottom: 16 }}>You are on the list!</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 32 }}>
                Chef Papi will reach out to {form.email} within 24 hours to confirm your start date and collect payment.
              </p>
              <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#C49A2B', color: '#1C1C1C', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Back to Home</Link>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.12)', borderRadius: 24, padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
              {error && (
                <div style={{ background: 'rgba(155,21,21,0.08)', border: '1px solid rgba(155,21,21,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#9B1515' }}>{error}</div>
              )}
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
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Choose Your Plan</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { val: 'weekly', label: 'Weekly', sub: '$100/week - 5 meals' },
                    { val: '4week', label: '4 Weeks', sub: '$300 total - Save 25%' },
                  ].map(({ val, label, sub }) => (
                    <button key={val} onClick={() => set('plan', val)} style={{ padding: '16px', borderRadius: 12, border: `2px solid ${form.plan === val ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.plan === val ? 'rgba(45,74,62,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-dm-sans)' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#2D4A3E', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#7A7A7A' }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Preferred Start Date</label>
                <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Dietary Preferences</label>
                <select value={form.dietary} onChange={e => set('dietary', e.target.value)} style={inputStyle}>
                  <option value="">No preference</option>
                  <option value="halal">Halal</option>
                  <option value="no_pork">No pork</option>
                  <option value="no_shellfish">No shellfish</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="low_carb">Low carb</option>
                  <option value="high_protein">High protein</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Allergies or Restrictions</label>
                <input value={form.allergies} onChange={e => set('allergies', e.target.value)} placeholder="e.g. peanuts, dairy, gluten" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything else Chef should know?" rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 16, background: loading ? 'rgba(45,74,62,0.5)' : '#2D4A3E', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                {loading ? 'Submitting...' : 'Request My Meal Prep'}
              </button>
              <p style={{ fontSize: 12, color: '#7A7A7A', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                No payment collected here. Chef will contact you within 24 hours to confirm.
              </p>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: '#F5F0E8', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E' }}>Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { q: 'Where is pickup?', a: 'Brunswick, MD every Sunday at 6PM. Exact address shared after confirmation.' },
              { q: 'Can I customize my meals?', a: 'Yes. Dietary preferences and allergies are collected and Chef will accommodate where possible.' },
              { q: 'What if I need to skip a week?', a: 'Weekly plans can be paused or cancelled anytime with 48 hours notice.' },
              { q: 'How long do meals stay fresh?', a: 'All meals keep in the refrigerator for 4-5 days. Some can be frozen.' },
              { q: 'How do I pay?', a: 'Chef will send a payment link after confirming your request. All major cards accepted.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.1)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 17, fontWeight: 700, color: '#2D4A3E', marginBottom: 8 }}>{q}</div>
                <div style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.65 }}>{a}</div>
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
