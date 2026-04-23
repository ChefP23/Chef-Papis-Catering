import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [customerRes, ordersRes, commsRes] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('comms_log')
      .select('id, channel, template, subject, status, sent_at')
      .eq('customer_id', id)
      .order('sent_at', { ascending: false }),
  ])

  if (customerRes.error) throw customerRes.error
  if (ordersRes.error) throw ordersRes.error
  if (commsRes.error) throw commsRes.error

  const customer = customerRes.data
  const orders = ordersRes.data ?? []
  const comms = commsRes.data ?? []

  if (!customer) {
    return (
      <div>
        <Link href="/admin/customers" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to customers</Link>
        <p className="mt-4 text-neutral-500">Customer not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to customers</Link>
        <h1 className="mt-2 text-2xl font-semibold">{customer.full_name ?? customer.email}</h1>
        <div className="text-sm text-neutral-600 mt-1 space-x-3">
          <span>{nullish(customer.email)}</span>
          <span>{nullish(customer.phone)}</span>
          <span>Lifetime: {formatMoney(customer.lifetime_spend)}</span>
        </div>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Orders ({orders.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Order #</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
              <th className="text-right px-4 py-2 font-medium">Total</th>
              <th className="text-right px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{formatDateTime(o.created_at)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                <td className="px-4 py-2 text-right"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">No orders yet</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Communications ({comms.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Channel</th>
              <th className="text-left px-4 py-2 font-medium">Template</th>
              <th className="text-left px-4 py-2 font-medium">Subject</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {comms.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{nullish(c.channel)}</td>
                <td className="px-4 py-2 text-neutral-600">{nullish(c.template)}</td>
                <td className="px-4 py-2">{nullish(c.subject)}</td>
                <td className="px-4 py-2"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-2 text-xs">{formatDateTime(c.sent_at)}</td>
              </tr>
            ))}
            {comms.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">No comms logged</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
