'use client'

import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, formatMoney, nullish } from '@/lib/admin/format'

export interface CateringRow {
  id: string
  source: 'catering_inquiries' | 'catering_requests'
  name: string | null
  email: string | null
  phone: string | null
  event_type: string | null
  event_date: string | null
  guest_count: number | null
  budget: string | null
  status: string
  quote_amount: number | string | null
  created_at: string
}

const STATUS_OPTIONS = ['new', 'quoted', 'booked', 'completed', 'cancelled'] as const
const PAGE_SIZE = 25

export function CateringClient({ rows }: { rows: CateringRow[] }) {
  const [items, setItems] = useState(rows)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [savingId, setSavingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (q) {
        const hay = [r.name, r.email, r.phone, r.event_type].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  async function updateStatus(row: CateringRow, next: string) {
    setSavingId(row.id)
    const endpoint = row.source === 'catering_inquiries'
      ? `/api/admin/inquiries/${row.id}`
      : `/api/admin/requests/${row.id}`
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        alert(`Failed to update: ${body.error ?? res.statusText}`)
        return
      }
      setItems((prev) => prev.map((r) => r.id === row.id && r.source === row.source ? { ...r, status: next } : r))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, email, phone, event type"
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
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} inquiries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Contact</th>
              <th className="text-left px-4 py-3 font-medium">Event</th>
              <th className="text-left px-4 py-3 font-medium">Event date</th>
              <th className="text-right px-4 py-3 font-medium">Guests</th>
              <th className="text-left px-4 py-3 font-medium">Budget</th>
              <th className="text-right px-4 py-3 font-medium">Quote</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={`${r.source}-${r.id}`} className="border-t border-neutral-100">
                <td className="px-4 py-3">{nullish(r.name)}</td>
                <td className="px-4 py-3 text-xs">
                  <div>{nullish(r.email)}</div>
                  <div className="text-neutral-500">{nullish(r.phone)}</div>
                </td>
                <td className="px-4 py-3">{nullish(r.event_type)}</td>
                <td className="px-4 py-3">{formatDate(r.event_date)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.guest_count ?? '—'}</td>
                <td className="px-4 py-3">{nullish(r.budget)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {r.quote_amount !== null && r.quote_amount !== undefined ? formatMoney(r.quote_amount) : '—'}
                </td>
                <td className="px-4 py-3">
                  <select
                    disabled={savingId === r.id}
                    value={r.status}
                    onChange={(e) => updateStatus(r, e.target.value)}
                    className="border border-neutral-300 rounded px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-neutral-500">No inquiries found</td></tr>
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
