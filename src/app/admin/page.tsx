'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'thechefmdllc@gmail.com'

const MCPS_SCHOOLS = ['Arcola ES','Ashburton ES','Bannockburn ES','Lucy V. Barnsley ES','Beall ES','Bel Pre ES','Bells Mill ES','Belmont ES','Bethesda ES','Beverly Farms ES','Bradley Hills ES','Brooke Grove ES','Brookhaven ES','Brown Station ES','Burning Tree ES','Burnt Mills ES','Burtonsville ES','Cabin Branch ES','Candlewood ES','Cannon Road ES','Carderock Springs ES','Rachel Carson ES','Cashell ES','Cedar Grove ES','Chevy Chase ES','Clarksburg ES','Clearspring ES','Clopper Mill ES','Cloverly ES','Cold Spring ES','College Gardens ES','Cresthaven ES','Capt. James E. Daly ES','Damascus ES','Darnestown ES','Diamond ES','Dr. Charles R. Drew ES','DuFief ES','East Silver Spring ES','Fairland ES','Fallsmead ES','Farmland ES','Fields Road ES','Flower Hill ES','Flower Valley ES','Forest Knolls ES','Fox Chapel ES','Gaithersburg ES','Galway ES','Garrett Park ES','Georgian Forest ES','Germantown ES','William B. Gibbs Jr. ES','Glen Haven ES','Glenallan ES','Goshen ES','Great Seneca Creek ES','Greencastle ES','Greenwood ES','Harmony Hills ES','Highland ES','Highland View ES','Jackson Road ES','Jones Lane ES','Kemp Mill ES','Kensington Parkwood ES','Lake Seneca ES','Lakewood ES','Laytonsville ES','JoAnn Leleck ES','Little Bennett ES','Luxmanor ES','Thurgood Marshall ES','Maryvale ES','McNair ES','Mill Creek Towne ES','Mills Farm ES','Minnehaha ES','Monocacy ES','Montgomery Knolls ES','New Hampshire Estates ES','Roscoe R. Nix ES','North Chevy Chase ES','Oak View ES','Olney ES','Pinecrest ES','Piney Branch ES','Potomac ES','Redland ES','Ridgeview ES','Rolling Terrace ES','Rosemont ES','Rosemary Hills ES','S. Christa McAuliffe ES','Seven Locks ES','Shady Grove ES','Sligo Creek ES','Somerset ES','South Lake ES','Stedwick ES','Stone Mill ES','Stonegate ES','Strathmore ES','Strawberry Knoll ES','Summit Hall ES','Takoma Park ES','Twinbrook ES','Whetstone ES','White Oak ES','Winding Brook ES','Wood Acres ES','Woodfield ES','Woodlin ES','Wyngate ES','A. Mario Loiederman MS','Argyle MS','Benjamin Banneker MS','Briggs Chaney MS','Cabin John MS','Damascus MS','Forest Oak MS','Francis Scott Key MS','Herbert Hoover MS','Julius West MS','Kingsview MS','Lakelands Park MS','Martin Luther King Jr. MS','Montgomery Village MS','Neelsville MS','Newport Mill MS','North Bethesda MS','Parkland MS','Pyle MS','Roberto Clemente MS','Rocky Hill MS','Shady Grove MS','Silver Spring International MS','Sligo MS','Thomas W. Pyle MS','Tilden MS','Westland MS','White Oak MS','Albert Einstein HS','Bethesda-Chevy Chase HS','Blake HS','Clarksburg HS','Col. Zadok Magruder HS','Damascus HS','Eleanor Roosevelt HS','Gaithersburg HS','Germantown HS','John F. Kennedy HS','Montgomery Blair HS','Northwest HS','Paint Branch HS','Poolesville HS','Quince Orchard HS','Richard Montgomery HS','Rockville HS','Seneca Valley HS','Sherwood HS','Springbrook HS','Thomas S. Wootton HS','Walter Johnson HS','Watkins Mill HS','Wheaton HS','Winston Churchill HS']
const FCPS_SCHOOLS = ['Ballenger Creek ES','Blue Heron ES','Brunswick ES','Butterfly Ridge ES','Carroll Manor ES','Centerville ES','Deer Crossing ES','Emmitsburg ES','Glade ES','Green Valley ES','Hillcrest ES','Kemptown ES','Lewistown ES','Liberty ES','Lincoln ES','Middletown ES','Middletown Primary School','Monocacy ES','Myersville ES','New Market ES','New Midway/Woodsboro ES','North Frederick ES','Oakdale ES','Orchard Grove ES','Parkway ES','Spring Ridge ES','Sugarloaf ES','Thurmont ES','Thurmont Primary School','Tuscarora ES','Twin Ridge ES','Urbana ES','Valley ES','Walkersville ES','Waverley ES','Whittier ES','Wolfsville ES','Yellow Springs ES','Ballenger Creek MS','Brunswick MS','Crestwood MS','Governor Thomas Johnson MS','Middletown MS','Monocacy MS','New Market MS','Oakdale MS','Thurmont MS','Urbana MS','Walkersville MS','West Frederick MS','Windsor Knolls MS','Brunswick HS','Catoctin HS','Frederick HS','Governor Thomas Johnson HS','Linganore HS','Middletown HS','Oakdale HS','Tuscarora HS','Urbana HS','Walkersville HS']

function getDistrict(school: string) {
  if (MCPS_SCHOOLS.includes(school)) return 'MCPS'
  if (FCPS_SCHOOLS.includes(school)) return 'FCPS'
  return null
}

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedCycle, setSelectedCycle] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [manifestMode, setManifestMode] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) { router.push('/'); return }
      setUser(user)
      const [{ data: ordersData }, { data: cyclesData }, { data: customersData }] = await Promise.all([
        supabase.from('orders').select('*, order_items(*), customers(full_name, email, phone), menu_cycles(title, delivery_date)').order('created_at', { ascending: false }).limit(500),
        supabase.from('menu_cycles').select('*').order('delivery_date', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
      ])
      setOrders(ordersData || [])
      setCycles(cyclesData || [])
      setCustomers(customersData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  async function markAllDelivered() {
    const toDeliver = filteredOrders.filter(o => o.status === 'paid')
    await Promise.all(toDeliver.map(o => supabase.from('orders').update({ status: 'delivered' }).eq('id', o.id)))
    setOrders(prev => prev.map(o => toDeliver.find(d => d.id === o.id) ? { ...o, status: 'delivered' } : o))
  }

  // Get unique schools from orders
  const schoolsInOrders = [...new Set(orders.map(o => o.staff_name).filter(Boolean))].sort()

  let filteredOrders = orders
  if (selectedCycle !== 'all') filteredOrders = filteredOrders.filter(o => o.cycle_id === selectedCycle)
  if (selectedStatus !== 'all') filteredOrders = filteredOrders.filter(o => o.status === selectedStatus)
  if (selectedSchool !== 'all') filteredOrders = filteredOrders.filter(o => o.staff_name === selectedSchool)

  const paidOrders = filteredOrders.filter(o => o.status === 'paid')
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered')
  const totalRevenue = [...paidOrders, ...deliveredOrders].reduce((s, o) => s + Number(o.total), 0)

  // Manifest: group by school
  const manifest = filteredOrders.reduce((acc: any, o) => {
    const school = o.staff_name || 'Unknown'
    if (!acc[school]) acc[school] = []
    acc[school].push(o)
    return acc
  }, {})

  // This week revenue
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weekRevenue = orders.filter(o => new Date(o.created_at) > oneWeekAgo && ['paid','delivered'].includes(o.status)).reduce((s, o) => s + Number(o.total), 0)

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading admin...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#0f0f0f' }}>

      {/* HEADER */}
      <header style={{ background: '#1a1a1a', borderBottom: '2px solid var(--gold)', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 36, height: 36, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 13, fontWeight: 900, color: 'var(--gold)' }}>CP</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
            <div style={{ background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 100, letterSpacing: 1 }}>ADMIN</div>
          </div>
          <Link href="/foodie-friday" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Live Site</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#22c55e' },
            { label: 'This Week', value: `$${weekRevenue.toFixed(2)}`, color: '#34d399' },
            { label: 'Paid Orders', value: paidOrders.length, color: 'var(--gold)' },
            { label: 'Delivered', value: deliveredOrders.length, color: '#60a5fa' },
            { label: 'Customers', value: customers.length, color: '#c084fc' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* TABS + FILTERS */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['orders', 'manifest', 'customers', 'cycles'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 600, background: activeTab === tab ? 'var(--red)' : 'rgba(255,255,255,0.08)', color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                {tab === 'manifest' ? '📋 Manifest' : tab}
              </button>
            ))}
          </div>

          {(activeTab === 'orders' || activeTab === 'manifest') && (
            <>
              <select value={selectedCycle} onChange={e => setSelectedCycle(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a', color: '#fff', fontSize: 14, cursor: 'pointer' }}>
                <option value="all">All Cycles</option>
                {cycles.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a', color: '#fff', fontSize: 14, cursor: 'pointer' }}>
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
              </select>
              <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a', color: '#fff', fontSize: 14, cursor: 'pointer' }}>
                <option value="all">All Schools</option>
                {schoolsInOrders.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </>
          )}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Orders ({filteredOrders.length})</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {paidOrders.length > 0 && (
                  <button onClick={markAllDelivered} style={{ padding: '8px 16px', background: '#60a5fa', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    ✓ Mark All Delivered ({paidOrders.length})
                  </button>
                )}
                <button onClick={() => window.print()} style={{ padding: '8px 16px', background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  🖨️ Print
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Customer', 'Items', 'School', 'District', 'Cycle', 'Total', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No orders found</td></tr>
                  )}
                  {filteredOrders.map((order, i) => {
                    const district = getDistrict(order.staff_name || '')
                    const customerName = order.customers?.full_name || `${order.customers?.first_name || ''} ${order.customers?.last_name || ''}`.trim() || '—'
                    return (
                      <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{customerName}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{order.customers?.email}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.quantity}x {item.item_name}</div>
                          ))}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{order.staff_name || '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {district && (
                            <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: district === 'MCPS' ? 'rgba(96,165,250,0.15)' : 'rgba(34,197,94,0.15)', color: district === 'MCPS' ? '#60a5fa' : '#22c55e' }}>
                              {district}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{order.menu_cycles?.title}</td>
                        <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 700, color: '#22c55e' }}>${Number(order.total).toFixed(2)}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : order.status === 'delivered' ? 'rgba(96,165,250,0.15)' : 'rgba(234,179,8,0.15)', color: order.status === 'paid' ? '#22c55e' : order.status === 'delivered' ? '#60a5fa' : '#eab308' }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {order.status === 'paid' && (
                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ padding: '6px 12px', background: '#60a5fa', color: '#000', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              ✓ Delivered
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <span style={{ fontSize: 12, color: '#60a5fa' }}>✓ Done</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MANIFEST TAB */}
        {activeTab === 'manifest' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                Delivery Manifest — {filteredOrders.length} orders across {Object.keys(manifest).length} schools
              </div>
              <button onClick={() => window.print()} style={{ padding: '10px 20px', background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                🖨️ Print Manifest
              </button>
            </div>
            {Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)).map(([school, schoolOrders]: [string, any]) => {
              const district = getDistrict(school)
              const schoolTotal = schoolOrders.reduce((s: number, o: any) => s + Number(o.total), 0)
              // Count items
              const itemCounts: any = {}
              schoolOrders.forEach((o: any) => {
                o.order_items?.forEach((item: any) => {
                  const key = item.item_name
                  itemCounts[key] = (itemCounts[key] || 0) + item.quantity
                })
              })
              return (
                <div key={school} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{school}</div>
                      {district && (
                        <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: district === 'MCPS' ? 'rgba(96,165,250,0.15)' : 'rgba(34,197,94,0.15)', color: district === 'MCPS' ? '#60a5fa' : '#22c55e' }}>
                          {district}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{schoolOrders.length} orders</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>${schoolTotal.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Item summary */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                    {Object.entries(itemCounts).map(([name, qty]: [string, any]) => (
                      <div key={name} style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                        {qty}x {name}
                      </div>
                    ))}
                  </div>

                  {/* Individual orders */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Staff Name', 'Items', 'Total', 'Status'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schoolOrders.map((order: any) => (
                        <tr key={order.id}>
                          <td style={{ padding: '10px 12px', fontSize: 14, color: '#fff', fontWeight: 600 }}>{order.staff_name}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                            {order.order_items?.map((item: any) => `${item.quantity}x ${item.item_name}`).join(', ')}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>${Number(order.total).toFixed(2)}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : order.status === 'delivered' ? 'rgba(96,165,250,0.15)' : 'rgba(234,179,8,0.15)', color: order.status === 'paid' ? '#22c55e' : order.status === 'delivered' ? '#60a5fa' : '#eab308' }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
            {Object.keys(manifest).length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>No orders to display</div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Customers ({customers.length})</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Name', 'Email', 'Phone', 'SMS Opt-In', 'Lifetime Spend', 'Orders', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => {
                    const customerOrders = orders.filter(o => o.customers?.email === c.email)
                    const customerName = c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—'
                    return (
                      <tr key={c.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{customerName}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.email}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.phone || '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: 13 }}>{c.sms_opt_in ? '✅ Yes' : '—'}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>${Number(c.lifetime_spend || 0).toFixed(2)}</td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{customerOrders.length}</td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                          {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cycles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cycles.map(cycle => {
              const cycleOrders = orders.filter(o => o.cycle_id === cycle.id)
              const cycleRevenue = cycleOrders.filter(o => ['paid','delivered'].includes(o.status)).reduce((s, o) => s + Number(o.total), 0)
              return (
                <div key={cycle.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{cycle.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                        Delivery: {new Date(cycle.delivery_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        &nbsp;·&nbsp;
                        Cutoff: {new Date(cycle.cutoff_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', background: cycle.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)', color: cycle.status === 'published' ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>
                        {cycle.status}
                      </span>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{cycleOrders.length} orders</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>${cycleRevenue.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
