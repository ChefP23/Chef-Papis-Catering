'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    function getCutoff() {
      const now = new Date()
      const day = now.getDay()
      const wed = new Date(now)
      const daysToWed = (3 - day + 7) % 7 || 7
      wed.setDate(now.getDate() + daysToWed)
      wed.setHours(23, 59, 59, 0)
      return wed
    }

    function update() {
      const diff = getCutoff().getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {[
        { val: time.days, label: 'Days' },
        { val: time.hours, label: 'Hours' },
        { val: time.mins, label: 'Mins' },
        { val: time.secs, label: 'Secs' },
      ].map(({ val, label }) => (
        <div
          key={label}
          className="rounded-xl p-3 text-center"
          style={{ background: 'rgba(196,30,30,0.35)', border: '2px solid rgba(255,255,255,0.25)' }}
        >
          <div
            style={{ fontFamily: 'monospace', fontSize: 42, fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 20px rgba(255,255,255,0.5)', lineHeight: 1 }}
          >
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const menuItems = [
    { emoji: '🍗', name: 'Jerk Chicken Bowl', desc: 'Slow-marinated chicken, rice & peas, fried plantains, house slaw.', price: 14 },
    { emoji: '🥩', name: 'Philly Cheesesteak', desc: 'Shaved ribeye, caramelized onions, white American, hoagie roll.', price: 13 },
    { emoji: '🐟', name: 'Salmon & Grits', desc: 'Blackened Atlantic salmon over stone-ground cheesy grits, sautéed greens.', price: 16 },
    { emoji: '🍟', name: 'BBQ Loaded Fries', desc: 'Crispy fries, pulled pork, jalapeños, cheddar, BBQ drizzle.', price: 11 },
    { emoji: '🍤', name: 'Shrimp Fried Rice', desc: 'Wok-fired rice, jumbo shrimp, scrambled egg, scallions, soy-ginger.', price: 14 },
    { emoji: '🌿', name: 'Vegan Curry Bowl', desc: 'Coconut chickpea curry, basmati rice, roasted vegetables, naan.', price: 12 },
  ]

  const reviews = [
    { name: 'Ms. Johnson', school: 'Clarksburg HS', rating: 5, text: 'The Jerk Chicken Bowl was incredible. Every Friday my whole department gathers around the food. Chef Papi has ruined all other lunches for us!' },
    { name: 'Mr. Williams', school: 'Damascus HS', rating: 5, text: 'Started a group order for our department and it was seamless. Everyone ordered separately, paid separately, food showed up hot and perfectly packed.' },
    { name: 'Principal Davis', school: 'Northwest HS', rating: 5, text: 'Used Chef Papi for our end-of-year staff celebration. Restaurant quality, everything on time, price was beyond fair. Highly recommend.' },
  ]

  return (
    <main style={{ background: 'var(--warm-white)' }}>

      {/* ALLERGEN BAR */}
      <div style={{ background: '#FFF8E7', borderBottom: '1px solid rgba(212,160,23,0.3)', padding: '10px 24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-mid)' }}>
        ⚠️ <strong style={{ color: '#9B1515' }}>Allergen Notice:</strong> Prepared in a kitchen that handles shellfish, dairy, nuts, wheat, and soy.
        &nbsp;|&nbsp; 🏠 Operating from a home kitchen while commercial licensing is in progress.
      </div>

      {/* HEADER */}
      <header style={{ background: 'var(--black)', borderBottom: '2px solid var(--gold)', padding: '0 clamp(16px, 5vw, 48px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 900, color: 'var(--gold)' }}>
              CP
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>Catering</div>
            </div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { label: 'Foodie Friday', href: '#menu' },
              { label: 'Catering', href: '#catering' },
              { label: 'Meal Prep', href: '#mealprep' },
              { label: 'Reviews', href: '#reviews' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: 'var(--red)', marginLeft: 8 }}>
              Order Now
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--black) 50%, #1a0500 100%)', padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>
              🔥 Foodie Friday – Order Window OPEN
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', color: '#fff', lineHeight: 1.05, marginBottom: 20 }}>
              Real Food.<br />
              Real <span style={{ color: 'var(--gold-light)' }}>Community.</span><br />
              Every Friday.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', marginBottom: 36, maxWidth: 480 }}>
              Bringing restaurant-quality meals straight to MCPS school staff every Friday — plus event catering and weekly meal prep across Montgomery County, MD.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#menu" style={{ padding: '16px 32px', borderRadius: 12, background: 'var(--red)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
                🍽️ See This Week&apos;s Menu
              </a>
              <a href="#catering" style={{ padding: '16px 32px', borderRadius: 12, background: 'transparent', color: 'var(--gold-light)', fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '2px solid rgba(212,160,23,0.5)' }}>
                Book Catering
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { num: '1,200+', label: 'Meals Served' },
                { num: '20+', label: 'MCPS Schools' },
                { num: '4.9★', label: 'Avg Rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 900, color: 'var(--gold-light)' }}>{num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* COUNTDOWN CARD */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 20, padding: 32, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Order Cutoff Countdown
            </div>

            <Countdown />

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                <span>Order Capacity</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>38 / 50</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, var(--red), var(--gold))', borderRadius: 100 }}></div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-light)', marginTop: 6 }}>⚡ 12 spots remaining — order fast!</div>
            </div>

            <div style={{ marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              🏫 Schools Booked: <strong style={{ color: 'var(--gold-light)' }}>3 of 5</strong>
            </div>

            <a href="/foodie-friday" style={{ display: 'block', width: '100%', padding: 14, background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
              Order Before Wednesday 11:59 PM →
            </a>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" style={{ background: 'var(--cream)', padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>This Week&apos;s Menu</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 8 }}>Foodie Friday – March 6, 2026</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 40 }}>Delivery: Friday 10AM–1PM EST · Main Office Drop-off Only · MCPS Schools</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {menuItems.map((item) => (
              <div key={item.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg, var(--charcoal), #3d2200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                  {item.emoji}
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 14, lineHeight: 1.5 }}>{item.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>${item.price}.00</div>
                    <Link href="/foodie-friday" style={{ width: 36, height: 36, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 300 }}>+</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Everything We Do</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>More Ways to Eat Good</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 48 }}>
            {[
              { emoji: '🍱', title: 'Foodie Friday', desc: 'Weekly lunch delivery to MCPS schools. Order by Wednesday night, delivered Friday morning.', color: 'linear-gradient(135deg, #9B1515, #C41E1E)', href: '/foodie-friday' },
              { emoji: '🎉', title: 'Event Catering', desc: 'Corporate events, school functions, and private parties. Minimum $400. Secure your date with a 25% deposit.', color: 'linear-gradient(135deg, #1C1209, #2D1F0A)', href: '#catering' },
              { emoji: '🥗', title: 'Weekly Meal Prep', desc: '5 fresh meals per week, $100. Pay 4 weeks upfront and save 25%. Sunday pickup 6PM.', color: 'linear-gradient(135deg, #0a1f0a, #1a3d1a)', href: '#mealprep' },
            ].map((s) => (
              <a key={s.title} href={s.href} style={{ background: s.color, borderRadius: 20, padding: 32, textDecoration: 'none', display: 'block', border: '1px solid rgba(212,160,23,0.2)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, color: '#fff', marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-light)' }}>Learn More →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CATERING */}
      <section id="catering" style={{ padding: '80px clamp(16px, 5vw, 48px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Catering</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>We Bring the Party</h2>
          <p style={{ fontSize: 17, color: 'var(--text-light)', maxWidth: 560, lineHeight: 1.65, marginBottom: 40 }}>
            Chef Papi&apos;s handles school events, corporate lunches, private celebrations, and more across Brunswick and Montgomery County. Minimum $400.
          </p>
          <Link href="/login" style={{ padding: '16px 32px', borderRadius: 12, background: 'var(--red)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Request a Quote
          </Link>
        </div>
      </section>

      {/* MEAL PREP */}
      <section id="mealprep" style={{ background: 'var(--black)', padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Meal Prep</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: 16 }}>Stop Eating Like That</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.65, marginBottom: 48 }}>5 fresh meals every week. Pick up Sunday at 6PM.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 600 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Weekly</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 42, color: 'var(--gold-light)', lineHeight: 1 }}>$100</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>/week · 5 meals</div>
              <Link href="/login" style={{ display: 'block', padding: 12, background: 'var(--gold)', color: 'var(--black)', borderRadius: 10, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>Start Weekly</Link>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #9B1515, #C41E1E)', borderRadius: 20, padding: 28, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gold)', color: 'var(--black)', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 100 }}>SAVE 25%</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>4 Weeks</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 42, color: '#fff', lineHeight: 1 }}>$300</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>save $100</div>
              <Link href="/login" style={{ display: 'block', padding: 12, background: 'var(--gold)', color: 'var(--black)', borderRadius: 10, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>Get 4 Weeks</Link>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ background: 'var(--black)', padding: '80px clamp(16px, 5vw, 48px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Reviews</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: 48 }}>The Community Speaks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {reviews.map((r) => (
              <div key={r.name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 16, padding: 24 }}>
                <div style={{ color: 'var(--gold)', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(r.rating)}</div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}><strong style={{ color: 'rgba(255,255,255,0.7)' }}>{r.name}</strong> · {r.school}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--black)', borderTop: '1px solid rgba(212,160,23,0.2)', padding: '60px clamp(16px, 5vw, 48px) 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, color: 'var(--gold-light)', marginBottom: 12 }}>Chef Papi&apos;s Catering</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Community-focused catering and school lunch delivery serving MCPS and Montgomery County, MD.</p>
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--gold)' }}>📧 hello@chefpapiscatering.com</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Order</div>
              {['Foodie Friday', 'Catering', 'Meal Prep'].map((l) => (
                <div key={l} style={{ marginBottom: 10 }}><a href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Legal</div>
              {['Terms & Conditions', 'Privacy Policy', 'Allergen Info'].map((l) => (
                <div key={l} style={{ marginBottom: 10 }}><a href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 Chef Papi&apos;s Catering · Brunswick, MD</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>🔒 Secure payments via Stripe · PCI Compliant</p>
          </div>
        </div>
      </footer>

    </main>
  )
}