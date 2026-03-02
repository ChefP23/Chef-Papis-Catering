'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ServiceType = 'catering' | 'meal-prep' | ''

export default function Inquiry() {
  const [service, setService] = useState<ServiceType>('')
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    event_type: '', event_date: '', guest_count: '', location: '', budget: '', menu_ideas: '',
    plan: 'weekly', dietary: '', allergies: '', start_date: '',
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
    if (service === 'catering' && (!form.event_type || !form.event_date || !form.guest_count)) {
      setError('Please fill in your event type, date, and guest count.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      if (service === 'catering') {
        const { error: dbError } = await supabase.from('catering_requests').insert([{
          full_name: form.full_name, email: form.email, phone: form.phone,
          event_type: form.event_type, event_date: form.event_date,
          guest_count: parseInt(form.guest_count) || 0,
          location: form.location, budget: form.budget,
          menu_ideas: form.menu_ideas, notes: form.notes, status: 'new',
        }])
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('meal_prep_requests').insert([{
          full_name: form.full_name, email: form.email, phone: form.phone,
          plan: form.plan, dietary_preferences: form.dietary,
          allergies: form.allergies,
          requested_start_date: form.start_date || null,
          notes: form.notes, status: 'new',
        }])
        if (dbError) throw dbError
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or text us directly.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid rgba(45,74,62,0.2)', background: '#FAF7F2',
    color: '#1C1C1C', fontSize: 15, fontFamily: 'var(--font-dm-sans)',
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    fontSize: 12, fontWeight: 600 as const, color: '#4A4A4A',
    marginBottom: 6, display: 'block' as const,
    textTransform: 'uppercase' as const, letterSpacing: 1,
  }

  const eventTypes = ['School Event','Corporate Lunch','Birthday Party','Wedding / Reception','Baby / Bridal Shower','Holiday Party','Church / Community Event','Other']
  const budgetRanges = ['$400 - $750','$750 - $1,500','$1,500 - $3,000','$3,000+','Not sure yet']

  return (
    <main style={{ background: '#FAF7F2', fontFamily: 'var(--font-dm-sans)', minHeight: '100vh' }}>

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
            <Link href="/" style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>Home</Link>
            <Link href="/foodie-friday" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#2D4A3E', marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>

      <section style={{ background: '#2D4A3E', padding: '72px clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>Get in Touch</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(36px, 6vw, 64px)', color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
            Let&apos;s Make<br /><span style={{ color: '#E8B84B' }}>Something Great.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            Whether you need weekly meals or full event catering, Chef Papi has you covered. Pick what you need below and fill out the details.
          </p>
        </div>
      </section>

      <section style={{ padding: '64px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {submitted ? (
            <div style={{ background: '#2D4A3E', borderRadius: 24, padding: '56px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, color: '#E8B84B', marginBottom: 16 }}>
                {service === 'catering' ? 'Quote Request Received!' : 'You Are On the List!'}
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 12 }}>
                Chef Papi will reach out to <strong style={{ color: '#fff' }}>{form.email}</strong> within 24 hours.
              </p>
              {service === 'catering' && (
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>A 25% deposit is required to secure your date once the quote is accepted.</p>
              )}
              <Link href="/" style={{ display: 'inline-block', padding: '14px 36px', background: '#C49A2B', color: '#1C1C1C', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15, marginTop: 16 }}>Back to Home</Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 20, textAlign: 'center', fontFamily: 'var(--font-playfair)', fontSize: 22 }}>What are you interested in?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { val: 'catering' as ServiceType, label: 'Event Catering', sub: 'School events, corporate, birthdays, celebrations', icon: '🍽️', detail: 'Minimum $400 - 25% deposit to hold date' },
                    { val: 'meal-prep' as ServiceType, label: 'Weekly Meal Prep', sub: '5 fresh meals per week, Sunday pickup', icon: '🥡', detail: '$100/week or $300 for 4 weeks' },
                  ].map(({ val, label, sub, icon, detail }) => (
                    <button key={val} onClick={() => setService(val)} style={{ padding: '28px 20px', borderRadius: 16, border: `2px solid ${service === val ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: service === val ? 'rgba(45,74,62,0.06)' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-dm-sans)', boxShadow: service === val ? '0 4px 20px rgba(45,74,62,0.12)' : 'none', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#2D4A3E', marginBottom: 6, fontFamily: 'var(--font-playfair)' }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#7A7A7A', marginBottom: 10, lineHeight: 1.5 }}>{sub}</div>
                      <div style={{ fontSize: 12, color: '#C49A2B', fontWeight: 600 }}>{detail}</div>
                    </button>
                  ))}
                </div>
              </div>

              {service && (
                <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.12)', borderRadius: 24, padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>

                  {error && (
                    <div style={{ background: 'rgba(155,21,21,0.08)', border: '1px solid rgba(155,21,21,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#9B1515' }}>{error}</div>
                  )}

                  <div style={{ fontSize: 18, fontWeight: 700, color: '#2D4A3E', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>
                    {service === 'catering' ? 'Catering Request' : 'Meal Prep Sign Up'}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 14, fontFamily: 'var(--font-playfair)' }}>Your Info</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="301-555-1234" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  </div>

                  {service === 'catering' && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 14, paddingTop: 4, borderTop: '1px solid rgba(45,74,62,0.08)', paddingTop: 20, fontFamily: 'var(--font-playfair)' }}>Event Details</div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Type of Event *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          {eventTypes.map(type => (
                            <button key={type} onClick={() => set('event_type', type)} style={{ padding: '11px 14px', borderRadius: 10, border: `2px solid ${form.event_type === type ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.event_type === type ? 'rgba(45,74,62,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: form.event_type === type ? 700 : 400, color: form.event_type === type ? '#2D4A3E' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={labelStyle}>Event Date *</label>
                          <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Guest Count *</label>
                          <input type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} placeholder="e.g. 50" min="1" style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Event Location / Venue</label>
                        <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Address or venue name, city" style={inputStyle} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Estimated Budget</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {budgetRanges.map(b => (
                            <button key={b} onClick={() => set('budget', b)} style={{ padding: '9px 16px', borderRadius: 100, border: `2px solid ${form.budget === b ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.budget === b ? '#2D4A3E' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.budget === b ? '#fff' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Menu Ideas or Preferences</label>
                        <textarea value={form.menu_ideas} onChange={e => set('menu_ideas', e.target.value)} placeholder="e.g. Jerk chicken, rice and beans, appetizers, dietary restrictions..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
                      </div>
                    </>
                  )}

                  {service === 'meal-prep' && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 14, borderTop: '1px solid rgba(45,74,62,0.08)', paddingTop: 20, fontFamily: 'var(--font-playfair)' }}>Meal Prep Details</div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Choose Your Plan *</label>
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
                      <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Allergies or Restrictions</label>
                        <input value={form.allergies} onChange={e => set('allergies', e.target.value)} placeholder="e.g. peanuts, dairy, gluten" style={inputStyle} />
                      </div>
                    </>
                  )}

                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Additional Notes</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything else Chef should know?" rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
                  </div>

                  <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 16, background: loading ? 'rgba(45,74,62,0.4)' : '#2D4A3E', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                    {loading ? 'Submitting...' : service === 'catering' ? 'Request My Quote' : 'Sign Me Up'}
                  </button>
                  <p style={{ fontSize: 12, color: '#7A7A7A', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                    {service === 'catering'
                      ? 'Minimum $400 - 25% deposit to hold your date - No payment collected here'
                      : 'No payment collected here. Chef will contact you within 24 hours to confirm.'}
                  </p>
                </div>
              )}
            </>
          )}
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
