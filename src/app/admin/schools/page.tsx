import { createClient } from '@/lib/supabase/server'
import { SchoolsClient } from '@/components/admin/SchoolsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSchoolsPage() {
  const supabase = await createClient()

  const [schoolsRes, ordersRes] = await Promise.all([
    supabase.from('schools').select('id, name, district, address, is_active, created_at').order('name'),
    supabase.from('orders').select('school_id, total, status'),
  ])

  if (schoolsRes.error) throw schoolsRes.error
  if (ordersRes.error) throw ordersRes.error

  const stats = new Map<string, { count: number; revenue: number }>()
  for (const o of ordersRes.data ?? []) {
    if (!o.school_id) continue
    const cur = stats.get(o.school_id) ?? { count: 0, revenue: 0 }
    const nextRevenue = (o.status === 'paid' || o.status === 'delivered')
      ? cur.revenue + Number(o.total ?? 0)
      : cur.revenue
    stats.set(o.school_id, { count: cur.count + 1, revenue: nextRevenue })
  }

  const enriched = (schoolsRes.data ?? []).map((s) => ({
    ...s,
    total_orders: stats.get(s.id)?.count ?? 0,
    total_revenue: stats.get(s.id)?.revenue ?? 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Schools</h1>
      <SchoolsClient schools={enriched} />
    </div>
  )
}
