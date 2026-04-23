import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { WeekRevenueBars, type WeekBucket } from '@/components/admin/WeekRevenueBars'

export const dynamic = 'force-dynamic'

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = x.getDay()
  x.setDate(x.getDate() - day)
  return x
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString()

  const [paidAllRes, customersCountRes, recentOrdersRes, paidThisMonthRes, paidLastMonthRes, paidRecentRes, openInquiriesRes, openRequestsRes] = await Promise.all([
    supabase.from('orders').select('total', { count: 'exact' }).eq('status', 'paid'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, staff_name, customers(full_name, email), schools(name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders').select('total').eq('status', 'paid').gte('paid_at', thisMonthStart),
    supabase.from('orders').select('total').eq('status', 'paid').gte('paid_at', lastMonthStart).lt('paid_at', thisMonthStart),
    supabase.from('orders').select('total, paid_at').eq('status', 'paid').gte('paid_at', eightWeeksAgo),
    supabase
      .from('catering_inquiries')
      .select('id, contact_name, contact_email, event_date, event_type, status, created_at')
      .in('status', ['new', 'quoted'])
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('catering_requests')
      .select('id, full_name, email, event_date, event_type, status, created_at')
      .in('status', ['new', 'quoted'])
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const totalRevenue = (paidAllRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const totalOrdersCount = paidAllRes.count ?? 0
  const totalCustomers = customersCountRes.count ?? 0
  const revenueThisMonth = (paidThisMonthRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const revenueLastMonth = (paidLastMonthRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)

  const buckets: WeekBucket[] = []
  const firstWeekStart = startOfWeek(new Date(eightWeeksAgo))
  for (let i = 0; i < 8; i++) {
    const start = new Date(firstWeekStart.getTime() + i * 7 * 24 * 60 * 60 * 1000)
    buckets.push({ label: weekLabel(start), total: 0 })
  }
  for (const row of paidRecentRes.data ?? []) {
    if (!row.paid_at) continue
    const paid = new Date(row.paid_at as string)
    const idx = Math.floor((paid.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
    if (idx >= 0 && idx < buckets.length) {
      buckets[idx].total += Number(row.total ?? 0)
    }
  }

  const openInquiries = [
    ...(openInquiriesRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_inquiries' as const,
      name: r.contact_name,
      email: r.contact_email,
      event_date: r.event_date,
      event_type: r.event_type,
      status: r.status,
      created_at: r.created_at,
    })),
    ...(openRequestsRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_requests' as const,
      name: r.full_name,
      email: r.email,
      event_date: r.event_date,
      event_type: r.event_type,
      status: r.status,
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={formatMoney(totalRevenue)} sublabel={`${totalOrdersCount} paid orders`} />
        <StatCard label="Total orders" value={String(totalOrdersCount)} />
        <StatCard label="Total customers" value={String(totalCustomers)} />
        <StatCard
          label="Revenue this month"
          value={formatMoney(revenueThisMonth)}
          sublabel={`Last month: ${formatMoney(revenueLastMonth)}`}
        />
      </div>

      <WeekRevenueBars weeks={buckets} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-neutral-500 hover:text-neutral-900">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="text-left py-2 font-medium">Order</th>
                <th className="text-left py-2 font-medium">Customer</th>
                <th className="text-left py-2 font-medium">School</th>
                <th className="text-right py-2 font-medium">Amount</th>
                <th className="text-right py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrdersRes.data ?? []).map((o: any) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                  <td className="py-2">{nullish(o.customers?.full_name ?? o.customers?.email)}</td>
                  <td className="py-2">{nullish(o.schools?.name ?? o.staff_name)}</td>
                  <td className="py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                  <td className="py-2 text-right"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {(recentOrdersRes.data ?? []).length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-neutral-500">No orders yet</td></tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Open catering inquiries</h2>
            <Link href="/admin/catering" className="text-xs text-neutral-500 hover:text-neutral-900">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Event</th>
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-right py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {openInquiries.map((i) => (
                <tr key={`${i.source}-${i.id}`} className="border-t border-neutral-100">
                  <td className="py-2">{nullish(i.name)}</td>
                  <td className="py-2">{nullish(i.event_type)}</td>
                  <td className="py-2">{formatDateTime(i.event_date)}</td>
                  <td className="py-2 text-right"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
              {openInquiries.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-neutral-500">No open inquiries</td></tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
