import { createClient } from '@/lib/supabase/server'
import { CustomersClient } from '@/components/admin/CustomersClient'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const [customersRes, ordersRes] = await Promise.all([
    supabase
      .from('customers')
      .select('id, full_name, email, phone, lifetime_spend, marketing_opt_in, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(2000),
    supabase.from('orders').select('customer_id, created_at'),
  ])

  if (customersRes.error) throw customersRes.error
  if (ordersRes.error) throw ordersRes.error

  const stats = new Map<string, { count: number; lastOrderAt: string | null }>()
  for (const o of ordersRes.data ?? []) {
    if (!o.customer_id) continue
    const cur = stats.get(o.customer_id) ?? { count: 0, lastOrderAt: null }
    cur.count += 1
    if (!cur.lastOrderAt || new Date(o.created_at).getTime() > new Date(cur.lastOrderAt).getTime()) {
      cur.lastOrderAt = o.created_at
    }
    stats.set(o.customer_id, cur)
  }

  const enriched = (customersRes.data ?? []).map((c) => ({
    ...c,
    total_orders: stats.get(c.id)?.count ?? 0,
    last_order_at: stats.get(c.id)?.lastOrderAt ?? null,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <CustomersClient customers={enriched} />
    </div>
  )
}
