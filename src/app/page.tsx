import Link from 'next/link'

export default function Home() {

  const menuItems = [
   { image: '/images/jerk-chicken.jpg', name: 'Jerk Chicken Plate', desc: 'Slow-marinated jerk chicken, seasoned rice & beans, buttered cabbage, and candied yams.', price: 25, tag: 'MCPS Only', tagColor: '#60a5fa' },
{ image: '/images/alfredo.jpg', name: 'Chicken or Shrimp Alfredo', desc: 'Creamy homemade alfredo sauce over fettuccine. Choose chicken, shrimp, or both.', price: 25, tag: 'FCPS Only', tagColor: '#22c55e' },
  ]
  const reviews = [
    { name: 'Ms. Johnson', school: 'Clarksburg HS', rating: 5, text: 'The Jerk Chicken was incredible. Every Friday my whole department gathers around the food. Chef Papi has ruined all other lunches for us!' },
    { name: 'Mr. Williams', school: 'Damascus HS', rating: 5, text: 'Started a group order for our department and it was seamless. Everyone ordered separately, paid separately, food showed up hot and perfectly packed.' },
    { name: 'Principal Davis', school: 'Northwest HS', rating: 5, text: 'Used Chef Papi for our end-of-year staff celebration. Restaurant quality, everything on time, price was beyond fair. Highly recommend.' },
  ]

  return (
    <main style={{ background: 'var(--warm-white)' }}>
      <div style={{ background: '#FFF8E7', borderBottom: '1px solid rgba(212,160,23,0.3)', padding: '10px 24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-mid)' }}>
        ⚠️ <strong style={{ color: '#9B1515' }}>Allergen Notice:</strong> Prepared in a kitchen that handles shellfish, dairy, nuts, wheat, and soy.
        &nbsp;|&nbsp; 🏠 Operating from a home kitchen while commercial licensing is in progress.
      </div>
      <header style={{ background: 'var(--black)', borderBottom: '2px solid var(--gold)', padding: '0 clamp(16px, 5vw, 48px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 900, color: 'var(--gold)' }}>CP</div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>Catering</div>
            </div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[{ label: 'Foodie Friday', href: '#menu' }, { label: 'Catering', href: '#catering' }, { label: 'Meal Prep', href: '#mealprep' }, { label: 'Reviews', href: '#reviews' }].map(({ label, href }) => (
              <a key={label} href={href} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>{label}</a>
            ))}
            <Link href="/foodie-friday" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: 'var(--red)', marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>
      <section style={{ background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--black) 50%, #1a0500 100%)', padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>
              🔥 Foodie Friday – Order Window OPEN
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', color: '#fff', lineHeight: 1.05, marginBottom: 20 }}>
              Real Food.<br />Real <span style={{ color: 'var(--gold-light)' }}>Community.</span><br />Every Friday.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', marginBottom: 36, maxWidth: 480 }}>
              Bringing restaurant-quality meals straight to Montgomery County and Frederick County school staff every Friday — plus event catering and weekly meal prep across Montgomery, Frederick, and surrounding counties in MD.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#menu" style={{ padding: '16px 32px', borderRadius: 12, background: 'var(--red)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>🍽️ See This Week&apos;s Menu</a>
              <a href="#catering" style={{ padding: '16px 32px', borderRadius: 12, background: 'transparent', color: 'var(--gold-light)', fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '2px solid rgba(212,160,23,0.5)' }}>Book Catering</a>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ num: '1,200+', label: 'Meals Served' }, { num: '3 Counties', label: 'MD Served' }, { num: '4.9★', label: 'Avg Rating' }].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 900, color: 'var(--gold-light)' }}>{num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 20, padding: 32, backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', letterSpacing: 1, textTransform: 'uppercase' }}>Order Window Open</span>
            </div>
            {[{ image: '/images/jerk-chicken.jpg',             name: 'Jerk Chicken Plate', tag: 'MCPS Only', tagColor: '#60a5fa', desc: 'Rice & beans, buttered cabbage, candied yams' },
              { image: '/images/alfredo.jpg', name: 'Chicken or Shrimp Alfredo', tag: 'FCPS Only', tagColor: '#22c55e', desc: 'Creamy fettuccine · choice of protein' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${item.tagColor}22`, color: item.tagColor }}>{item.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{item.desc}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>$25</div>
              </div>
            ))}
            <a href="/foodie-friday" style={{ display: 'block', width: '100%', padding: 16, background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
              Order This Week&apos;s Menu →
            </a>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Order cutoff: Wednesday 11:59 PM · Delivered Friday</div>
          </div>
        </div>
      </section>
      <div style={{ background: 'var(--black)', borderTop: '1px solid rgba(212,160,23,0.15)', borderBottom: '1px solid rgba(212,160,23,0.15)', padding: '20px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Serving:</div>
          {['MCPS · Montgomery County', 'FCPS · Frederick County', 'Brunswick City Schools', 'Private & Corporate Events'].map(area => (
            <div key={area} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--gold)' }}>✓</span> {area}
            </div>
          ))}
        </div>
      </div>
      <section id="menu" style={{ background: 'var(--cream)', padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>This Week&apos;s Menu</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 8 }}>Foodie Friday – March 6, 2026</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 40 }}>Delivery: Friday 10AM–1PM EST · Main Office Drop-off Only · MCPS, FCPS & Frederick County Schools</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {menuItems.map((item) => (
              <div key={item.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>
<div style={{ height: 160, overflow: 'hidden' }}>
  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
</div>                <div style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700 }}>{item.name}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${item.tagColor}22`, color: item.tagColor }}>{item.tag}</span>
                  </div>
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
      <section style={{ padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Everything We Do</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>More Ways to Eat Good</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 48 }}>
            {[
              { emoji: '🍱', title: 'Foodie Friday', desc: 'Weekly lunch delivery to Montgomery County and Frederick County schools. Order by Wednesday night, delivered Friday morning.', color: 'linear-gradient(135deg, #9B1515, #C41E1E)', href: '/foodie-friday' },
              { emoji: '🎉', title: 'Event Catering', desc: 'Corporate events, school functions, and private parties across Montgomery and Frederick County. Minimum $400. Secure your date with a 25% deposit.', color: 'linear-gradient(135deg, #1C1209, #2D1F0A)', href: '#catering' },
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
      <section id="catering" style={{ padding: '80px clamp(16px, 5vw, 48px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Catering</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>We Bring the Party</h2>
          <p style={{ fontSize: 17, color: 'var(--text-light)', maxWidth: 560, lineHeight: 1.65, marginBottom: 40 }}>
            Chef Papi&apos;s handles school events, corporate lunches, private celebrations, and more across Brunswick, Montgomery County, Frederick County, and surrounding areas. Minimum $400.
          </p>
          <Link href="/login" style={{ padding: '16px 32px', borderRadius: 12, background: 'var(--red)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>Request a Quote</Link>
        </div>
      </section>
      <section id="mealprep" style={{ background: 'var(--black)', padding: '80px clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Meal Prep</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: 16 }}>I Cook. You Eat.</h2>
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
      <footer style={{ background: 'var(--black)', borderTop: '1px solid rgba(212,160,23,0.2)', padding: '60px clamp(16px, 5vw, 48px) 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, color: 'var(--gold-light)', marginBottom: 12 }}>Chef Papi&apos;s Catering</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Community-focused catering and school lunch delivery serving MCPS, FCPS, Frederick County, and surrounding areas in Maryland.</p>
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