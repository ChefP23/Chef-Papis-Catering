const COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  delivered: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-neutral-200 text-neutral-700',
  new: 'bg-indigo-100 text-indigo-800',
  quoted: 'bg-amber-100 text-amber-800',
  booked: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-blue-100 text-blue-800',
  draft: 'bg-neutral-100 text-neutral-700',
  active: 'bg-green-100 text-green-800',
  closed: 'bg-neutral-200 text-neutral-700',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const normalized = (status ?? 'unknown').toLowerCase()
  const cls = COLORS[normalized] ?? 'bg-neutral-100 text-neutral-700'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status ?? '—'}
    </span>
  )
}
