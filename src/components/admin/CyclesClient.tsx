'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, formatMoney } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export interface CycleRow {
  id: string
  title: string | null
  delivery_date: string | null
  cutoff_datetime: string | null
  status: string | null
  order_cap: number | null
  school_cap: number | null
  is_mcps_only: boolean | null
  notes: string | null
  total_orders: number
  total_revenue: number
}

const PAGE_SIZE = 25

export function CyclesClient({ cycles }: { cycles: CycleRow[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(cycles.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = useMemo(() => cycles.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), [cycles, current])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Delivery</th>
              <th className="text-left px-4 py-3 font-medium">Cutoff</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Order cap</th>
              <th className="text-right px-4 py-3 font-medium">School cap</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-right px-4 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/cycles/${c.id}`} className="hover:underline">{c.title ?? '—'}</Link>
                </td>
                <td className="px-4 py-3">{formatDate(c.delivery_date)}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(c.cutoff_datetime)}</td>
                <td className="px-4 py-3 text-right"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-right tabular-nums">{c.order_cap ?? '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.school_cap ?? '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.total_orders}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.total_revenue)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No cycles</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
