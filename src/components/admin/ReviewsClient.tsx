'use client'

import { useMemo, useState } from 'react'
import { formatDateTime, nullish } from '@/lib/admin/format'
import { StarRating } from '@/components/admin/StarRating'

export interface ReviewRow {
  id: string
  rating: number | null
  title: string | null
  body: string | null
  service_type: string | null
  is_verified: boolean | null
  is_approved: boolean | null
  is_featured: boolean | null
  created_at: string
  customers: { full_name: string | null; email: string | null } | null
}

const PAGE_SIZE = 25

export function ReviewsClient({ reviews }: { reviews: ReviewRow[] }) {
  const [items, setItems] = useState(reviews)
  const [page, setPage] = useState(1)
  const [savingId, setSavingId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = useMemo(() => items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), [items, current])

  async function toggle(reviewId: string, field: 'is_approved' | 'is_featured', next: boolean) {
    setSavingId(reviewId)
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        alert(`Failed to update: ${body.error ?? res.statusText}`)
        return
      }
      setItems((prev) => prev.map((r) => r.id === reviewId ? { ...r, [field]: next } : r))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Rating</th>
              <th className="text-left px-4 py-3 font-medium">Title / body</th>
              <th className="text-left px-4 py-3 font-medium">Service</th>
              <th className="text-center px-4 py-3 font-medium">Verified</th>
              <th className="text-center px-4 py-3 font-medium">Approved</th>
              <th className="text-center px-4 py-3 font-medium">Featured</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3">
                  <div>{nullish(r.customers?.full_name)}</div>
                  <div className="text-xs text-neutral-500">{nullish(r.customers?.email)}</div>
                </td>
                <td className="px-4 py-3"><StarRating rating={r.rating} /></td>
                <td className="px-4 py-3 max-w-md">
                  <div className="font-medium">{nullish(r.title)}</div>
                  <div className="text-xs text-neutral-600 line-clamp-2">{nullish(r.body)}</div>
                </td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.service_type)}</td>
                <td className="px-4 py-3 text-center">{r.is_verified ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      disabled={savingId === r.id}
                      checked={!!r.is_approved}
                      onChange={(e) => toggle(r.id, 'is_approved', e.target.checked)}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      disabled={savingId === r.id}
                      checked={!!r.is_featured}
                      onChange={(e) => toggle(r.id, 'is_featured', e.target.checked)}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No reviews yet</td></tr>
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
