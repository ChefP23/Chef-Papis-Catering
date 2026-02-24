'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// MCPS Schools
const MCPS_ELEMENTARY = [
  'Arcola ES','Ashburton ES','Bannockburn ES','Lucy V. Barnsley ES','Beall ES','Bel Pre ES','Bells Mill ES','Belmont ES','Bethesda ES','Beverly Farms ES','Bradley Hills ES','Brooke Grove ES','Brookhaven ES','Brown Station ES','Burning Tree ES','Burnt Mills ES','Burtonsville ES','Cabin Branch ES','Candlewood ES','Cannon Road ES','Carderock Springs ES','Rachel Carson ES','Cashell ES','Cedar Grove ES','Chevy Chase ES','Clarksburg ES','Clearspring ES','Clopper Mill ES','Cloverly ES','Cold Spring ES','College Gardens ES','Cresthaven ES','Capt. James E. Daly ES','Damascus ES','Darnestown ES','Diamond ES','Dr. Charles R. Drew ES','DuFief ES','East Silver Spring ES','Fairland ES','Fallsmead ES','Farmland ES','Fields Road ES','Flower Hill ES','Flower Valley ES','Forest Knolls ES','Fox Chapel ES','Gaithersburg ES','Galway ES','Garrett Park ES','Georgian Forest ES','Germantown ES','William B. Gibbs Jr. ES','Glen Haven ES','Glenallan ES','Goshen ES','Great Seneca Creek ES','Greencastle ES','Greenwood ES','Harmony Hills ES','Highland ES','Highland View ES','Jackson Road ES','Jones Lane ES','Kemp Mill ES','Kensington Parkwood ES','Lake Seneca ES','Lakewood ES','Laytonsville ES','JoAnn Leleck ES','Little Bennett ES','Luxmanor ES','Thurgood Marshall ES','Maryvale ES','McNair ES','Mill Creek Towne ES','Mills Farm ES','Minnehaha ES','Monocacy ES','Montgomery Knolls ES','New Hampshire Estates ES','Roscoe R. Nix ES','North Chevy Chase ES','Oak View ES','Olney ES','Quince Orchard ES','Parkland MS Feeder ES','Pinecrest ES','Piney Branch ES','Potomac ES','Redland ES','Ridgeview ES','Rolling Terrace ES','Ronald McNair ES','Rosemont ES','Rosemary Hills ES','S. Christa McAuliffe ES','Seven Locks ES','Shady Grove ES','Sherwood ES','Sligo Creek ES','Somerset ES','South Lake ES','Stedwick ES','Stone Mill ES','Stonegate ES','Strathmore ES','Strawberry Knoll ES','Summit Hall ES','Takoma Park ES','Twinbrook ES','Whetstone ES','White Oak ES','Winding Brook ES','Wood Acres ES','Woodfield ES','Woodlin ES','Wyngate ES'
]

const MCPS_MIDDLE = [
  'A. Mario Loiederman MS','Argyle MS','Barnesville School','Benjamin Banneker MS','Briggs Chaney MS','Cabin John MS','Col. Zadok Magruder MS feeder','Damascus MS','Forest Oak MS','Francis Scott Key MS','Herbert Hoover MS','Hoover MS','Julius West MS','Kingsview MS','Lakelands Park MS','Longview MS','Martin Luther King Jr. MS','Montgomery Village MS','Neelsville MS','Newport Mill MS','North Bethesda MS','Parkland MS','Pyle MS','Roberto Clemente MS','Rock Terrace School','Rocky Hill MS','Shady Grove MS','Silver Spring International MS','Sligo MS','Spartan MS','Thomas W. Pyle MS','Tilden MS','Westland MS','White Oak MS'
]

const MCPS_HIGH = [
  'Albert Einstein HS','Bethesda-Chevy Chase HS','Blake HS','Bullis School','Clarksburg HS','Col. Zadok Magruder HS','Damascus HS','Eleanor Roosevelt HS','Gaithersburg HS','Germantown HS','James Hubert Blake HS','John F. Kennedy HS','Judith A. Resnik ES','Kingsview MS','Lakewood HS','Largo HS','Montgomery Blair HS','Montgomery College','Northwest HS','Paint Branch HS','Poolesville HS','Quince Orchard HS','Richard Montgomery HS','Rockville HS','Seneca Valley HS','Sherwood HS','Springbrook HS','Thomas S. Wootton HS','Walter Johnson HS','Watkins Mill HS','Wheaton HS','Winston Churchill HS'
]

// FCPS Schools (Frederick County MD)
const FCPS_ELEMENTARY = [
  'Ballenger Creek ES','Blue Heron ES','Brunswick ES','Butterfly Ridge ES','Carroll Manor ES','Centerville ES','Deer Crossing ES','Emmitsburg ES','Glade ES','Green Valley ES','Hillcrest ES','Kemptown ES','Lewistown ES','Liberty ES','Lincoln ES','Middletown ES','Middletown Primary School','Monocacy ES','Myersville ES','New Market ES','New Midway/Woodsboro ES','North Frederick ES','Oakdale ES','Orchard Grove ES','Parkway ES','Spring Ridge ES','Sugarloaf ES','Thurmont ES','Thurmont Primary School','Tuscarora ES','Twin Ridge ES','Urbana ES','Valley ES','Walkersville ES','Waverley ES','Whittier ES','Wolfsville ES','Yellow Springs ES'
]

const FCPS_MIDDLE = [
  'Ballenger Creek MS','Brunswick MS','Crestwood MS','Governor Thomas Johnson MS','Middletown MS','Monocacy MS','New Market MS','Oakdale MS','Thurmont MS','Urbana MS','Walkersville MS','West Frederick MS','Windsor Knolls MS'
]

const FCPS_HIGH = [
  'Brunswick HS','Catoctin HS','Frederick HS','Governor Thomas Johnson HS','Linganore HS','Middletown HS','Oakdale HS','Tuscarora HS','Urbana HS','Walkersville HS'
]

export default function FoodieFriday() {
  const [user, setUser] = useState<any>(null)
  const [cycle, setCycle] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [school, setSchool] = useState('')
  const [district, setDistrict] = useState('')
  const [staffName, setStaffName] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [proteinChoice, setProteinChoice] = useState<{ [itemId: string]: string }>({})
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

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

  const addToCart = (item: any) => {
    if (item.name.toLowerCase().includes('alfredo') && !proteinChoice[item.id]) {
      alert('Please select a protein option (Chicken, Shrimp, or Both) before adding to cart.')
      return
    }
    const protein = proteinChoice[item.id]
    const cartItem = {
      ...item,
      cartId: item.id + (protein || ''),
      displayName: protein ? `${item.name} (${protein})` : item.name,
      protein,
      quantity: 1,
    }
    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartItem.cartId)
      if (existing) return prev.map(i => i.cartId === cartItem.cartId ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, cartItem]
    })
  }

  const updateQty = (cartId: string, delta: number) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))
  }

  const total = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0)

  const filteredItems = district
    ? menuItems.filter(item => item.school_district === 'all' || item.school_district === district || !item.school_district)
    : menuItems

  const schoolOptions = district === 'MCPS'
    ? [...MCPS_ELEMENTARY.map(s => ({ label: s, group: 'MCPS Elementary' })), ...MCPS_MIDDLE.map(s => ({ label: s, group: 'MCPS Middle' })), ...MCPS_HIGH.map(s => ({ label: s, group: 'MCPS High' }))]
    : district === 'FCPS'
    ? [...FCPS_ELEMENTARY.map(s => ({ label: s, group: 'FCPS Elementary' })), ...FCPS_MIDDLE.map(s => ({ label: s, group: 'FCPS Middle' })), ...FCPS_HIGH.map(s => ({ label: s, group: 'FCPS High' }))]
    : []

  async function handleCheckout() {
    if (!user) { router.push('/login'); return }
    if (!school) { alert('Please select your school.'); return }
    if (!staffName) { alert('Please enter your name.'); return }
    if (cart.length === 0) { alert('Your cart is empty.'); return }
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout/foodie-friday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, school, staffName, cycleId: cycle.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error. Please try again.')
    } catch {
      alert('Something went wrong. Please try again.')
    }
    setCheckoutLoading(false)
  }

  const deliveryDate = cycle?.delivery_date
    ? new Date(cycle.delivery_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Friday, March 6, 2026'

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-dm-sans)', outline: 'none' }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading menu...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f' }}>

      {/* HEADER */}
      <header style={{ background: '#1a1a1a', borderBottom: '2px solid var(--gold)', padding: '0 clamp(16px, 5vw, 48px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 900, color: 'var(--gold)' }}>CP</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
            </a>
            <div style={{ background: 'rgba(212,160,23,0.2)', color: 'var(--gold)', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 100, letterSpacing: 1 }}>FOODIE FRIDAY</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {user ? (
              <a href="/account" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>My Orders →</a>
            ) : (
              <a href="/login" style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--red)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In to Order</a>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(16px, 5vw, 48px)', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

        {/* LEFT — MENU */}
        <div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Foodie Friday</div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: '#fff', marginBottom: 8 }}>{cycle?.title || 'This Week\'s Menu'}</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>📅 Delivery: {deliveryDate} · 10AM–1PM · Main Office Drop-off</p>
          </div>

          {/* DISTRICT SELECTOR */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Select Your School District to See Your Menu:</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['MCPS', 'FCPS'].map(d => (
                <button key={d} onClick={() => { setDistrict(d); setSchool('') }} style={{ padding: '10px 28px', borderRadius: 10, border: `2px solid ${district === d ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`, background: district === d ? 'rgba(212,160,23,0.15)' : 'transparent', color: district === d ? 'var(--gold)' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', transition: 'all 0.2s' }}>
                  {d === 'MCPS' ? '🏫 MCPS' : '🏫 FCPS'}
                </button>
              ))}
            </div>
          </div>

          {/* MENU ITEMS */}
          {!district && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏫</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Select your school district above to see this week&apos;s menu</div>
            </div>
          )}

          {district && filteredItems.length === 0 && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>No menu items available for {district} this week. Check back soon!</div>
            </div>
          )}

          <div style={{ display: 'grid', gap: 16 }}>
            {filteredItems.map(item => {
              const isAlfredo = item.name.toLowerCase().includes('alfredo')
              const districtTag = item.school_district === 'MCPS' ? 'MCPS Only' : item.school_district === 'FCPS' ? 'FCPS Only' : null
              return (
                <div key={item.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #2d1f0a, #3d2200)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
                    {isAlfredo ? '🍝' : '🍗'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: '#fff' }}>{item.name}</div>
                      {districtTag && (
                        <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: districtTag === 'MCPS Only' ? 'rgba(96,165,250,0.15)' : 'rgba(34,197,94,0.15)', color: districtTag === 'MCPS Only' ? '#60a5fa' : '#22c55e' }}>
                          {districtTag}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 12, lineHeight: 1.5 }}>{item.description}</div>

                    {/* PROTEIN CHOICE FOR ALFREDO */}
                    {isAlfredo && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 600 }}>SELECT PROTEIN: <span style={{ color: 'var(--gold)' }}>*Required</span></div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['Chicken', 'Shrimp', 'Chicken & Shrimp'].map(p => (
                            <button key={p} onClick={() => setProteinChoice(prev => ({ ...prev, [item.id]: p }))} style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${proteinChoice[item.id] === p ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`, background: proteinChoice[item.id] === p ? 'rgba(212,160,23,0.15)' : 'transparent', color: proteinChoice[item.id] === p ? 'var(--gold)' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', transition: 'all 0.2s' }}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>${Number(item.price).toFixed(2)}</div>
                      <button onClick={() => addToCart(item)} style={{ padding: '10px 24px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT — CART */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <span>Your Order</span>
              {cart.length > 0 && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{cart.reduce((s, i) => s + i.quantity, 0)} item(s)</span>}
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Your cart is empty</div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', flex: 1 }}>{item.displayName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.cartId, -1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ color: '#fff', fontSize: 14, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.cartId, 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', minWidth: 52, textAlign: 'right' }}>${(Number(item.price) * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 18 }}>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* SCHOOL + NAME */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>School District</label>
                <select value={district} onChange={e => { setDistrict(e.target.value); setSchool('') }} style={inputStyle}>
                  <option value="">Select district...</option>
                  <option value="MCPS">MCPS – Montgomery County</option>
                  <option value="FCPS">FCPS – Frederick County</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Your School</label>
                <select value={school} onChange={e => setSchool(e.target.value)} style={inputStyle} disabled={!district}>
                  <option value="">{district ? 'Select your school...' : 'Select district first'}</option>
                  {schoolOptions.reduce((acc: any[], item, idx, arr) => {
                    if (idx === 0 || item.group !== arr[idx - 1].group) {
                      acc.push(<optgroup key={item.group} label={item.group} />)
                    }
                    acc.push(<option key={item.label} value={item.label}>{item.label}</option>)
                    return acc
                  }, [])}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Your Name</label>
                <input value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="First & Last Name" style={inputStyle} />
              </div>
            </div>

            <button onClick={handleCheckout} disabled={checkoutLoading || cart.length === 0} style={{ width: '100%', padding: 16, background: cart.length === 0 ? 'rgba(255,255,255,0.1)' : 'var(--gold)', color: cart.length === 0 ? 'rgba(255,255,255,0.3)' : 'var(--black)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)', transition: 'all 0.2s' }}>
              {checkoutLoading ? 'Processing...' : `Checkout · $${total.toFixed(2)}`}
            </button>

            {!user && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 12 }}>
                You&apos;ll be asked to sign in before payment
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
