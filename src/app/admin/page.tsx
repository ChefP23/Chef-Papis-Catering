'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'thechefmdllc@gmail.com'

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedCycle, setSelectedCycle] = useState('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      setUser(user)

      const [{ data: ordersData }, { data: cyclesData }, { data: customersData }] = await Promise.all([
        supabase.from('orders').select('*, order_items(*), customers(full_name, email, phone), menu_cycles(title, delivery_date)').order('created_at', { ascending: false }).limit(200),
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

  const filteredOrders = selectedCycle === 'all' ? orders : orders.filter(o => o.cycle_id === selectedCycle)
  const paidOrders = filteredOrders.filter(o => o.status === 'paid')
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total), 0)
  const totalCustomers = customers.length

  const ordersBySchool = filteredOrders.reduce((acc: any, o) => {
    const school = o.staff_name ? `${o.staff_name}` : 'Unknown'
    if (!acc[school]) acc[school] = []
    acc[school].push(o)
    return acc
  }, {})

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
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/foodie-friday" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Live Site</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#22c55e' },
            { label: 'Paid Orders', value: paidOrders.length, color: 'var(--gold)' },
            { label: 'Total Orders', value: filteredOrders.length, color: '#60a5fa' },
            { label: 'Customers', value: totalCustomers, color: '#c084fc' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['orders', 'customers', 'cycles'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 600, background: activeTab === tab ? 'var(--red)' : 'rgba(255,255,255,0.08)', color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'orders' && (
            <select value={selectedCycle} onChange={e => setSelectedCycle(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a', color: '#fff', fontSize: 14, fontFamily: 'var(--font-dm-sans)', cursor: 'pointer' }}>
              <option value="all">All Cycles</option>
              {cycles.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          )}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Orders ({filteredOrders.length})</div>
              <button onClick={() => window.print()} style={{ padding: '8px 16px', background: 'var(--gold)', color: 'var(--black)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                🖨️ Print Labels
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Customer', 'Items', 'School/Staff', 'Cycle', 'Total', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{order.customers?.full_name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{order.customers?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.quantity}x {item.item_name}</div>
                        ))}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{order.staff_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{order.menu_cycles?.title}</td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 700, color: '#22c55e' }}>${Number(order.total).toFixed(2)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                          background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : order.status === 'delivered' ? 'rgba(96,165,250,0.15)' : 'rgba(234,179,8,0.15)',
                          color: order.status === 'paid' ? '#22c55e' : order.status === 'delivered' ? '#60a5fa' : '#eab308',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {order.status === 'paid' && (
                          <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ padding: '6px 12px', background: '#60a5fa', color: '#000', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
                            ✓ Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    {['Name', 'Email', 'Phone', 'Contact Pref', 'Lifetime Spend', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.full_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.email}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.phone || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(212,160,23,0.15)', color: 'var(--gold)' }}>
                          {c.preferred_contact}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>${Number(c.lifetime_spend || 0).toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cycles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cycles.map(cycle => (
              <div key={cycle.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{cycle.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      Delivery: {new Date(cycle.delivery_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      &nbsp;·&nbsp;
                      Cutoff: {new Date(cycle.cutoff_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                      background: cycle.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                      color: cycle.status === 'published' ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    }}>
                      {cycle.status}
                    </span>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                      {orders.filter(o => o.cycle_id === cycle.id).length} orders · ${orders.filter(o => o.cycle_id === cycle.id && o.status === 'paid').reduce((s, o) => s + Number(o.total), 0).toFixed(2)} revenue
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}