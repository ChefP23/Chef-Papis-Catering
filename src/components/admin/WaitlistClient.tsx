'use client'

import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, nullish } from '@/lib/admin/format'

export interface WaitlistRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  position: number | null
  notified_spot_open: boolean | null
  notified_next_cycle: boolean | null
  created_at: string
  schools: { name: string } | null
  menu_cycles: { title: string | null; delivery_date: string | null } | null
}

const PAGE_SIZE = 25

export function WaitlistClient({ rows }: { rows: WaitlistRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const hay = [r.name, r.email, r.phone, r.schools?.name, r.menu_cycles?.title].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [rows, search])

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
            placeholder="Name, email, school, cycle"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} entries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">School</th>
              <th className="text-left px-4 py-3 font-medium">Cycle</th>
              <th className="text-right px-4 py-3 font-medium">Position</th>
              <th className="text-center px-4 py-3 font-medium">Spot open</th>
              <th className="text-center px-4 py-3 font-medium">Next cycle</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{nullish(r.name)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.email)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.phone)}</td>
                <td className="px-4 py-3">{nullish(r.schools?.name)}</td>
                <td className="px-4 py-3">
                  <div>{nullish(r.menu_cycles?.title)}</div>
                  <div className="text-xs text-neutral-500">{formatDate(r.menu_cycles?.delivery_date)}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{r.position ?? '—'}</td>
                <td className="px-4 py-3 text-center">{r.notified_spot_open ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">{r.notified_next_cycle ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-neutral-500">No waitlist entries</td></tr>
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
