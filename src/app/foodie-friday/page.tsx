'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SCHOOLS = [
  'Clarksburg High School','Damascus High School','Gaithersburg High School',
  'Magruder High School','Northwest High School','Quince Orchard High School',
  'Seneca Valley High School','Watkins Mill High School','Montgomery Blair High School',
  'Richard Montgomery High School','Wheaton High School','Col. Zadok Magruder High School',
  'Poolesville High School','Wootton High School','Churchill High School',
  'Sherwood High School','Paint Branch High School','Springbrook High School',
  'Einstein High School','Walter Johnson High School'
]

interface CartItem {
  menu_item_id: string
  item_name: string
  item_price: number
  quantity: number
  for_staff_name: string
}

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
    <div style={{ display: 'flex', gap: 8 }}>
      {[{ val: time.days, label: 'Days' }, { val: time.hours, label: 'Hrs' }, { val: time.mins, label: 'Min' }, { val: time.secs, label: 'Sec' }].map(({ val, label }) => (
        <div key={label} style={{ background: 'rgba(196,30,30,0.15)', border: '1px solid rgba(196,30,30,0.3)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 52 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#fff', fontWeight: 500 }}>{String(val).padStart(2, '0')}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function FoodieFriday() {
  const [user, setUser] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [cycle, setCycle] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [school, setSchool] = useState('')
  const [staffName, setStaffName] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: cust } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()
        setCustomer(cust)
        if (cust?.full_name) setStaffName(cust.full_name)
      }

      const { data: cycleData } = await supabase
        .from('menu_cycles')
        .select('*')
        .eq('status', 'published')
        .order('delivery_date', { ascending: true })
        .limit(1)
        .single()

      if (cycleData) {
        setCycle(cycleData)
        const { data: items } = await supabase
          .from('menu_items')
          .select('*')
          .eq('cycle_id', cycleData.id)
          .eq('is_available', true)
          .order('sort_order')
        setMenuItems(items || [])
      }

      setLoading(false)
    }
    load()
  }, [])

  function addToCart(item: any) {
    setCart(prev => {
      const existing = prev.find(c => c.menu_item_id === item.id)
      if (existing) {
        return prev.map(c => c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { menu_item_id: item.id, item_name: item.name, item_price: item.price, quantity: 1, for_staff_name: staffName }]
    })
    setShowCart(true)
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(c => c.menu_item_id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(c => c.menu_item_id === id ? { ...c, quantity: qty } : c))
  }

  const cartTotal = cart.reduce((s, i) => s + i.item_price * i.quantity, 0)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  async function checkout() {
    if (!user) { router.push('/login'); return }
    if (!school) { alert('Please select your school.'); return }
    if (!staffName) { alert('Please enter your name.'); return }
    if (cart.length === 0) { alert('Your cart is empty.'); return }

    setCheckingOut(true)

    const res = await fetch('/api/checkout/foodie-friday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cycle_id: cycle.id,
        school_id: school,
        staff_name: staffName,
        items: cart,
      }),
    })

    const data = await res.json()

    if (data.session_url) {
      window.location.href = data.session_url
    } else {
      alert(data.error || 'Something went wrong. Please try again.')
      setCheckingOut(false)
    }
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Loading menu...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>

      {/* HEADER */}
      <header style={{ background: 'var(--black)', borderBottom: '2px solid var(--gold)', padding: '0 clamp(16px, 5vw, 48px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 900, color: 'var(--gold)' }}>CP</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>👋 {customer?.full_name?.split(' ')[0]}</span>
            ) : (
              <Link href="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Sign In</Link>
            )}
            {cartCount > 0 && (
              <button onClick={() => setShowCart(!showCart)} style={{ background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                🛒 {cartCount} · ${cartTotal.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ALLERGEN */}
      <div style={{ background: '#FFF8E7', borderBottom: '1px solid rgba(212,160,23,0.3)', padding: '10px 24px', textAlign: 'center', fontSize: 13, color: 'var(--text-mid)' }}>
        ⚠️ <strong style={{ color: '#9B1515' }}>Allergen Notice:</strong> Prepared in a kitchen that handles shellfish, dairy, nuts, wheat, and soy.
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(16px, 5vw, 48px)' }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>Foodie Friday</div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 8 }}>
              {cycle ? cycle.title : 'No Active Menu'}
            </h1>
            {cycle && (
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
                📦 Delivery: Friday 10AM–1PM · Main Office Only · No delivery fee
              </p>
            )}
          </div>
          {cycle && (
            <div style={{ background: 'var(--black)', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(212,160,23,0.2)' }}>
              <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>⏰ Order Cutoff</div>
              <Countdown />
            </div>
          )}
        </div>

        {!cycle ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🍽️</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, marginBottom: 12 }}>No Active Menu Right Now</h2>
            <p style={{ color: 'var(--text-light)', fontSize: 16, marginBottom: 32 }}>Check back soon — new menus drop every week!</p>
            <Link href="/" style={{ padding: '14px 28px', background: 'var(--red)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Back to Homepage</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: showCart ? '1fr 380px' : '1fr', gap: 32, alignItems: 'start' }}>

            {/* MENU */}
            <div>
              {/* ORDER DETAILS */}
              {!user && (
                <div style={{ background: 'linear-gradient(135deg, var(--red-dark), var(--red))', borderRadius: 16, padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Sign in to place your order</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>You need an account to checkout</div>
                  </div>
                  <Link href="/login" style={{ padding: '12px 24px', background: 'var(--gold)', color: 'var(--black)', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Sign In / Register</Link>
                </div>
              )}

              {user && (
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Your Order Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, display: 'block' }}>Your School *</label>
                      <select value={school} onChange={e => setSchool(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 14, fontFamily: 'var(--font-dm-sans)', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Select School...</option>
                        {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, display: 'block' }}>Your Name (Staff) *</label>
                      <input type="text" value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="First & Last Name" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 14, fontFamily: 'var(--font-dm-sans)', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* MENU GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {menuItems.map(item => (
                  <div key={item.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s' }}>
                    <div style={{ height: 140, background: 'linear-gradient(135deg, var(--charcoal), #3d2200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                      🍽️
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 14, lineHeight: 1.5 }}>{item.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: 'var(--red)' }}>${Number(item.price).toFixed(2)}</div>
                        <button onClick={() => addToCart(item)} style={{ padding: '8px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CART */}
            {showCart && cart.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 24, position: 'sticky', top: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 20 }}>Your Cart</h3>
                  <button onClick={() => setShowCart(false)} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>

                {cart.map(item => (
                  <div key={item.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.item_name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-light)' }}>${item.item_price.toFixed(2)} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.menu_item_id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.menu_item_id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--red)', marginLeft: 12, minWidth: 52, textAlign: 'right' }}>
                      ${(item.item_price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '2px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 900, color: 'var(--red)' }}>${cartTotal.toFixed(2)}</span>
                  </div>

                  {school && staffName ? (
                    <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--text-mid)' }}>
                      📍 {school}<br />
                      👤 {staffName}
                    </div>
                  ) : (
                    <div style={{ background: '#FFF3CD', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#856404' }}>
                      ⚠️ Please fill in your school and name above
                    </div>
                  )}

                  <button
                    onClick={checkout}
                    disabled={checkingOut || !school || !staffName}
                    style={{ width: '100%', padding: 14, borderRadius: 10, background: (!school || !staffName || checkingOut) ? 'rgba(196,30,30,0.4)' : 'var(--red)', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: (!school || !staffName || checkingOut) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {checkingOut ? 'Redirecting to Stripe...' : '🔒 Checkout Securely'}
                  </button>
                  <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 10 }}>
                    No delivery fee · No tipping · Secure via Stripe
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE STICKY CHECKOUT */}
      {cartCount > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--black)', borderTop: '2px solid var(--gold)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 90 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, color: 'var(--gold-light)' }}>${cartTotal.toFixed(2)}</div>
          </div>
          <button onClick={checkout} disabled={checkingOut} style={{ padding: '12px 28px', borderRadius: 10, background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
            {checkingOut ? 'Loading...' : 'Checkout →'}
          </button>
        </div>
      )}

    </main>
  )
}