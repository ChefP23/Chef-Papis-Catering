'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'

export default function CorporateCatering() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '',
    event_type: '', event_date: '', guest_count: '', location: '',
    budget: '', menu_ideas: '', notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.phone || !form.company || !form.event_type || !form.guest_count) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('catering_requests').insert([{
        full_name: form.full_name, email: form.email, phone: form.phone,
        event_type: `Corporate: ${form.event_type}`,
        event_date: form.event_date || null,
        guest_count: parseInt(form.guest_count) || 0,
        location: form.location, budget: form.budget,
        menu_ideas: form.menu_ideas,
        notes: `Company: ${form.company}${form.notes ? ` | ${form.notes}` : ''}`,
        status: 'new',
      }])
      if (dbError) throw dbError
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or call us at (301) 448-3475.')
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

  const eventTypes = ['Team Lunch / Dinner', 'Client Entertainment', 'Company Party', 'Holiday Event', 'Board Meeting', 'Training / Conference', 'Employee Appreciation', 'Other']
  const budgetRanges = ['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Need guidance']

  return (
    <main style={{ background: '#FAF7F2', fontFamily: 'var(--font-dm-sans)' }}>
      <Header
        links={[
          { label: "Event Catering", href: "/catering" },
          { label: "Meal Prep", href: "/meal-prep" },
        ]}
      />

      <section style={{ background: '#2D4A3E', padding: '80px clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 100, background: 'rgba(196,154,43,0.2)', border: '1px solid rgba(196,154,43,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#E8B84B', marginBottom: 20 }}>Corporate Catering</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(36px, 6vw, 68px)', color: '#fff', lineHeight: 1, marginBottom: 20 }}>
            Impress Your<br /><span style={{ color: '#E8B84B' }}>Team and Clients.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Restaurant-quality catering for Maryland businesses. From team lunches to client events, Chef Papi delivers bold flavor and seamless service your office will talk about.
          </p>
        </div>
      </section>

      <section style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>What&apos;s Included</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E' }}>Full-Service Corporate Catering</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { title: 'Custom Menus', desc: 'Menus built around your team size, dietary needs, and budget. Caribbean-inspired, soul food, classic American, or mixed.' },
              { title: 'Delivery and Setup', desc: 'We deliver to your office, set everything up, and leave it ready to serve. Serving staff available for larger events.' },
              { title: 'Professional Packaging', desc: 'Individual boxed meals for working lunches or family-style trays for team gatherings. Your call.' },
              { title: 'Recurring Programs', desc: 'Weekly or monthly team lunch programs with rotating menus. Discounted rates for ongoing commitments.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid rgba(45,74,62,0.1)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#2D4A3E', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F5F0E8', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E', marginBottom: 16 }}>Transparent, Fair Pricing</h2>
            <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.7 }}>Every event is custom-quoted based on your needs. Here&apos;s a general guide.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { tier: 'Team Lunch', range: '$15 - $25 / person', min: 'Min 15 people', desc: 'Boxed or tray-style lunch for your team. Includes entree, sides, and drink.' },
              { tier: 'Client Event', range: '$25 - $45 / person', min: 'Min 20 people', desc: 'Elevated menu with appetizers, entree selection, sides, and dessert option.' },
              { tier: 'Full Service', range: '$45+ / person', min: 'Min 30 people', desc: 'Complete catering with serving staff, premium menu, setup, and breakdown.' },
            ].map(({ tier, range, min, desc }) => (
              <div key={tier} style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', border: '1px solid rgba(45,74,62,0.12)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 8 }}>{tier}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 700, color: '#2D4A3E', marginBottom: 4 }}>{range}</div>
                <div style={{ fontSize: 12, color: '#7A7A7A', marginBottom: 12, fontWeight: 600 }}>{min}</div>
                <div style={{ fontSize: 14, color: '#7A7A7A', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#7A7A7A', textAlign: 'center', marginTop: 20 }}>All corporate events require a 25% deposit to secure the date. Final payment due 48 hours before the event.</p>
        </div>
      </section>

      <section id="quote" style={{ background: '#FAF7F2', padding: '80px clamp(16px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C49A2B', marginBottom: 12 }}>Get Started</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#2D4A3E', marginBottom: 12 }}>Request a Corporate Quote</h2>
            <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.7 }}>Tell us about your event and Chef will respond within 24 hours with a custom proposal.</p>
          </div>

          {submitted ? (
            <div style={{ background: '#2D4A3E', borderRadius: 24, padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, color: '#E8B84B', marginBottom: 16 }}>Request Received!</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 12 }}>
                Chef Papi will reach out to <strong style={{ color: '#fff' }}>{form.email}</strong> within 24 hours with a custom corporate quote.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
                Need it faster? Call us directly at (301) 448-3475.
              </p>
              <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#C49A2B', color: '#1C1C1C', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Back to Home</Link>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.12)', borderRadius: 24, padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
              {error && (
                <div style={{ background: 'rgba(155,21,21,0.08)', border: '1px solid rgba(155,21,21,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#9B1515' }}>{error}</div>
              )}

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>Contact Info</div>
              <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company *</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company or organization" style={inputStyle} />
                </div>
              </div>
              <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@company.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="301-555-1234" style={inputStyle} />
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D4A3E', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid rgba(45,74,62,0.1)', fontFamily: 'var(--font-playfair)' }}>Event Details</div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Type of Event *</label>
                <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {eventTypes.map(type => (
                    <button key={type} onClick={() => set('event_type', type)} style={{ padding: '12px 14px', borderRadius: 10, border: `2px solid ${form.event_type === type ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.event_type === type ? 'rgba(45,74,62,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: form.event_type === type ? 700 : 400, color: form.event_type === type ? '#2D4A3E' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Event Date</label>
                  <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Headcount *</label>
                  <input type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} placeholder="e.g. 30" min="1" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Office / Venue Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Address or office name, city" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Budget Range</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {budgetRanges.map(b => (
                    <button key={b} onClick={() => set('budget', b)} style={{ padding: '10px 18px', borderRadius: 100, border: `2px solid ${form.budget === b ? '#2D4A3E' : 'rgba(45,74,62,0.15)'}`, background: form.budget === b ? '#2D4A3E' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.budget === b ? '#fff' : '#4A4A4A', fontFamily: 'var(--font-dm-sans)' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Menu Ideas or Dietary Needs</label>
                <textarea value={form.menu_ideas} onChange={e => set('menu_ideas', e.target.value)} placeholder="e.g. Mix of proteins, vegetarian options needed, nut-free..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Setup requirements, serving style, recurring schedule..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 80 }} />
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 16, background: loading ? 'rgba(45,74,62,0.5)' : '#2D4A3E', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                {loading ? 'Submitting...' : 'Request Corporate Quote'}
              </button>
              <p style={{ fontSize: 12, color: '#7A7A7A', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                25% deposit to hold your date. No payment collected here. Or call us directly: (301) 448-3475
              </p>
            </div>
          )}
        </div>
      </section>

      <footer style={{ background: '#1C1C1C', padding: '40px clamp(16px, 5vw, 64px) 32px', borderTop: '1px solid rgba(196,154,43,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, color: '#E8B84B' }}>Chef Papi&apos;s Catering</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="tel:+13014483475" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>(301) 448-3475</a>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)' }}>|</span>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>2026 Chef Papi&apos;s - Brunswick, MD</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
