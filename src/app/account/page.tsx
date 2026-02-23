'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AccountContent() {
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('order')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: cust } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()
      setCustomer(cust)

      if (cust) {
        const { data: orderData } = await supabase
          .from('orders')
          .select('*, order_items(*), schools(name), menu_cycles(title, delivery_date)')
          .eq('customer_id', cust.id)
          .order('created_at', { ascending: false })
          .limit(20)
        setOrders(orderData || [])
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your account...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>

      {/* HEADER */}
      <header style={{ background: 'var(--black)', borderBottom: '2px solid var(--gold)', padding: '0 clamp(16px, 5vw, 48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 900, color: 'var(--gold)' }}>CP</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--gold-light)' }}>Chef Papi&apos;s</div>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/foodie-friday" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 16px', background: 'var(--red)', borderRadius: 8, fontWeight: 600 }}>
              🍽️ Order Now
            </Link>
            <button onClick={handleSignOut} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(16px, 5vw, 48px)' }}>

        {/* SUCCESS BANNER */}
        {success && (
          <div style={{ background: 'linear-gradient(135deg, #0a3d1a, #1a5c2a)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: '24px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Order Confirmed!</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Your Jerk Chicken Plate is on the way Friday! Check your email for confirmation.</div>
            </div>
          </div>
        )}

        {/* WELCOME */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 8 }}>
            Welcome back, {customer?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: 16 }}>Manage your orders and account details below.</p>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Lifetime Spend', value: `$${Number(customer?.lifetime_spend || 0).toFixed(2)}` },
            { label: 'Member Since', value: new Date(customer?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, color: 'var(--red)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28 }}>Your Orders</h2>
            <Link href="/foodie-friday" style={{ padding: '10px 20px', background: 'var(--red)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              + New Order
            </Link>
          </div>

          {orders.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No orders yet</div>
              <div style={{ color: 'var(--text-light)', marginBottom: 24 }}>Place your first Foodie Friday order!</div>
              <Link href="/foodie-friday" style={{ padding: '12px 24px', background: 'var(--red)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Order Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map(order => (
                <div key={order.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{order.order_number}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
                        {order.menu_cycles?.title} · {order.schools?.name || order.staff_name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                        background: order.status === 'paid' ? 'rgba(34,197,94,0.15)' : order.status === 'pending' ? 'rgba(234,179,8,0.15)' : 'rgba(196,30,30,0.15)',
                        color: order.status === 'paid' ? '#16a34a' : order.status === 'pending' ? '#ca8a04' : 'var(--red)',
                      }}>
                        {order.status}
                      </span>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>
                        ${Number(order.total).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} style={{ background: 'var(--cream)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--text-mid)' }}>
                        {item.quantity}x {item.item_name} · ${Number(item.item_price).toFixed(2)}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-light)' }}>
                    Ordered {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function Account() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  )
}