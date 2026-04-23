import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function CycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [cycleRes, itemsRes, ordersRes] = await Promise.all([
    supabase.from('menu_cycles').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('menu_items')
      .select('id, name, description, price, cost, is_available, sort_order, allergens')
      .eq('cycle_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, customers(full_name, email), schools(name), staff_name')
      .eq('cycle_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (cycleRes.error) throw cycleRes.error
  if (itemsRes.error) throw itemsRes.error
  if (ordersRes.error) throw ordersRes.error

  const cycle = cycleRes.data
  const items = itemsRes.data ?? []
  const ordersRaw = ordersRes.data ?? []

  // Normalize Supabase join shape (Array | Object → Object | null) — matches Task 3 boundary pattern
  const orders = ordersRaw.map((row: any) => ({
    ...row,
    customers: Array.isArray(row.customers) ? (row.customers[0] ?? null) : (row.customers ?? null),
    schools: Array.isArray(row.schools) ? (row.schools[0] ?? null) : (row.schools ?? null),
  }))

  if (!cycle) {
    return (
      <div>
        <Link href="/admin/cycles" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to cycles</Link>
        <p className="mt-4 text-neutral-500">Cycle not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/cycles" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to cycles</Link>
        <h1 className="mt-2 text-2xl font-semibold">{cycle.title}</h1>
        <div className="text-sm text-neutral-600 mt-1 space-x-3">
          <span>Delivery: {formatDate(cycle.delivery_date)}</span>
          <span>Cutoff: {formatDateTime(cycle.cutoff_datetime)}</span>
          <StatusBadge status={cycle.status} />
        </div>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Menu items ({items.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-right px-4 py-2 font-medium">Price</th>
              <th className="text-right px-4 py-2 font-medium">Cost</th>
              <th className="text-center px-4 py-2 font-medium">Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{i.name}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(i.price)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(i.cost)}</td>
                <td className="px-4 py-2 text-center">{i.is_available ? '✓' : '—'}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">No items</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Orders ({orders.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Order #</th>
              <th className="text-left px-4 py-2 font-medium">Customer</th>
              <th className="text-left px-4 py-2 font-medium">School</th>
              <th className="text-right px-4 py-2 font-medium">Total</th>
              <th className="text-right px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{nullish(o.customers?.full_name ?? o.customers?.email)}</td>
                <td className="px-4 py-2">{nullish(o.schools?.name ?? o.staff_name)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                <td className="px-4 py-2 text-right"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-2 text-xs">{formatDateTime(o.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-500">No orders</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
