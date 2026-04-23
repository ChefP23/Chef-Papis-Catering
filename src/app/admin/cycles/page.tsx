import { createClient } from '@/lib/supabase/server'
import { CyclesClient } from '@/components/admin/CyclesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCyclesPage() {
  const supabase = await createClient()

  const [cyclesRes, ordersRes] = await Promise.all([
    supabase
      .from('menu_cycles')
      .select('id, title, delivery_date, cutoff_datetime, status, order_cap, school_cap, is_mcps_only, notes, created_at')
      .order('delivery_date', { ascending: false }),
    supabase.from('orders').select('cycle_id, total, status'),
  ])

  if (cyclesRes.error) throw cyclesRes.error
  if (ordersRes.error) throw ordersRes.error

  const stats = new Map<string, { count: number; revenue: number }>()
  for (const o of ordersRes.data ?? []) {
    if (!o.cycle_id) continue
    const cur = stats.get(o.cycle_id) ?? { count: 0, revenue: 0 }
    const nextRevenue = (o.status === 'paid' || o.status === 'delivered')
      ? cur.revenue + Number(o.total ?? 0)
      : cur.revenue
    stats.set(o.cycle_id, { count: cur.count + 1, revenue: nextRevenue })
  }

  const enriched = (cyclesRes.data ?? []).map((c) => ({
    ...c,
    total_orders: stats.get(c.id)?.count ?? 0,
    total_revenue: stats.get(c.id)?.revenue ?? 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Menu cycles</h1>
      <CyclesClient cycles={enriched} />
    </div>
  )
}
