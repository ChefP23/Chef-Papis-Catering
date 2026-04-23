'use client'

import { Fragment, useMemo, useState } from 'react'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface OrderItem {
  id: string
  item_name: string
  item_price: number | string
  quantity: number
  for_staff_name: string | null
}

export interface Order {
  id: string
  order_number: string | null
  total: number | string
  subtotal: number | string | null
  status: string
  paid_at: string | null
  delivered_at: string | null
  created_at: string
  stripe_payment_intent_id: string | null
  notes: string | null
  staff_name: string | null
  school_id: string | null
  cycle_id: string | null
  customer_phone: string | null
  customers: { id: string; full_name: string | null; email: string | null; phone: string | null } | null
  schools: { id: string; name: string } | null
  order_items: OrderItem[]
}

interface OrdersClientProps {
  orders: Order[]
  schools: { id: string; name: string }[]
}

const PAGE_SIZE = 25

export function OrdersClient({ orders, schools }: OrdersClientProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [schoolId, setSchoolId] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const statuses = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.status).filter(Boolean))).sort()
  }, [orders])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const from = dateFrom ? new Date(dateFrom).getTime() : null
    const to = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1 : null

    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false
      if (schoolId !== 'all') {
        const ok = o.school_id === schoolId || o.schools?.id === schoolId
        if (!ok) return false
      }
      if (from !== null || to !== null) {
        const t = new Date(o.created_at).getTime()
        if (from !== null && t < from) return false
        if (to !== null && t > to) return false
      }
      if (q) {
        const hay = [
          o.order_number,
          o.customers?.full_name,
          o.customers?.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, search, status, schoolId, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Order #, name, email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Status</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">School</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={schoolId}
            onChange={(e) => { setSchoolId(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">From</label>
          <input type="date" className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">To</label>
          <input type="date" className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} orders</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order #</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">School</th>
              <th className="text-left px-4 py-3 font-medium">Items</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Paid</th>
              <th className="text-left px-4 py-3 font-medium">Stripe</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => {
              const isOpen = expandedId === o.id
              const itemsSummary = (o.order_items ?? [])
                .map((i) => `${i.item_name} × ${i.quantity}`)
                .join(', ')
              return (
                <Fragment key={o.id}>
                  <tr
                    className="border-t border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setExpandedId(isOpen ? null : o.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div>{nullish(o.customers?.full_name)}</div>
                      <div className="text-xs text-neutral-500">{nullish(o.customers?.email)}</div>
                    </td>
                    <td className="px-4 py-3">{nullish(o.schools?.name ?? o.staff_name)}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-neutral-700">{itemsSummary || '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatMoney(o.total)}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{formatDateTime(o.paid_at)}</td>
                    <td className="px-4 py-3 text-xs">
                      {o.stripe_payment_intent_id ? (
                        <a
                          href={`https://dashboard.stripe.com/payments/${o.stripe_payment_intent_id}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr className="border-t border-neutral-100 bg-neutral-50">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Items</div>
                            <ul className="space-y-1">
                              {(o.order_items ?? []).map((i) => (
                                <li key={i.id} className="flex justify-between gap-2">
                                  <span>{i.item_name} × {i.quantity}{i.for_staff_name ? ` (for ${i.for_staff_name})` : ''}</span>
                                  <span className="tabular-nums">{formatMoney(Number(i.item_price) * i.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 pt-2 border-t border-neutral-200 flex justify-between text-xs text-neutral-600">
                              <span>Subtotal</span><span className="tabular-nums">{formatMoney(o.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                              <span>Total</span><span className="tabular-nums">{formatMoney(o.total)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Customer</div>
                            <div>{nullish(o.customers?.full_name)}</div>
                            <div className="text-xs text-neutral-600">{nullish(o.customers?.email)}</div>
                            <div className="text-xs text-neutral-600">{nullish(o.customers?.phone ?? o.customer_phone)}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Delivery & notes</div>
                            <div className="text-xs">Delivered: {formatDateTime(o.delivered_at)}</div>
                            <div className="text-xs">Created: {formatDateTime(o.created_at)}</div>
                            <div className="text-xs mt-2 whitespace-pre-wrap">{o.notes ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No orders match your filters</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPage={setPage} />
    </div>
  )
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (n: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-neutral-600">Page {page} of {totalPages}</span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
