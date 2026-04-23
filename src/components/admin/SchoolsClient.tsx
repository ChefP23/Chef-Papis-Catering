'use client'

import { useMemo, useState } from 'react'
import { formatMoney, nullish } from '@/lib/admin/format'

export interface SchoolRow {
  id: string
  name: string
  district: string | null
  address: string | null
  is_active: boolean | null
  total_orders: number
  total_revenue: number
}

const PAGE_SIZE = 25

export function SchoolsClient({ schools }: { schools: SchoolRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return schools
    return schools.filter((s) => {
      const hay = [s.name, s.district, s.address].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [schools, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, district, address"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} schools</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">District</th>
              <th className="text-left px-4 py-3 font-medium">Address</th>
              <th className="text-center px-4 py-3 font-medium">Active</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-right px-4 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(s.district)}</td>
                <td className="px-4 py-3 text-neutral-700 text-xs">{nullish(s.address)}</td>
                <td className="px-4 py-3 text-center">{s.is_active ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{s.total_orders}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(s.total_revenue)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No schools found</td></tr>
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
