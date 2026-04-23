'use client'

import { useMemo, useState } from 'react'
import { formatDateTime, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export interface CommsRow {
  id: string
  channel: string | null
  template: string | null
  to_address: string | null
  subject: string | null
  status: string | null
  sent_at: string | null
  customers: { full_name: string | null; email: string | null } | null
}

const PAGE_SIZE = 25

export function CommsClient({ rows }: { rows: CommsRow[] }) {
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const channels = useMemo(() => Array.from(new Set(rows.map((r) => r.channel).filter(Boolean))) as string[], [rows])
  const statuses = useMemo(() => Array.from(new Set(rows.map((r) => r.status).filter(Boolean))) as string[], [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    if (channel !== 'all' && r.channel !== channel) return false
    if (status !== 'all' && r.status !== status) return false
    return true
  }), [rows, channel, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Channel</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={channel}
            onChange={(e) => { setChannel(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {channels.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
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
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} entries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Channel</th>
              <th className="text-left px-4 py-3 font-medium">Template</th>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">
                  <div>{nullish(r.customers?.full_name)}</div>
                  <div className="text-xs text-neutral-500">{nullish(r.customers?.email ?? r.to_address)}</div>
                </td>
                <td className="px-4 py-3">{nullish(r.channel)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.template)}</td>
                <td className="px-4 py-3">{nullish(r.subject)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.sent_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No comms logged</td></tr>
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
