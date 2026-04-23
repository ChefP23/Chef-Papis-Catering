'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'

export interface CustomerRow {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  lifetime_spend: number | string | null
  marketing_opt_in: boolean | null
  is_admin: boolean | null
  created_at: string
  total_orders: number
  last_order_at: string | null
}

const PAGE_SIZE = 25

export function CustomersClient({ customers }: { customers: CustomerRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => {
      const hay = [c.full_name, c.email, c.phone].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [customers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, email, phone"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} customers</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-right px-4 py-3 font-medium">Lifetime spend</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-left px-4 py-3 font-medium">Last order</th>
              <th className="text-center px-4 py-3 font-medium">Opt-in</th>
              <th className="text-center px-4 py-3 font-medium">Admin</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="text-neutral-900 hover:underline">
                    {nullish(c.full_name)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">{nullish(c.email)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(c.phone)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.lifetime_spend)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.total_orders}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(c.last_order_at)}</td>
                <td className="px-4 py-3 text-center">{c.marketing_opt_in ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">{c.is_admin ? '✓' : '—'}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No customers found</td></tr>
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
