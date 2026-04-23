import { formatMoney } from '@/lib/admin/format'

export interface WeekBucket {
  label: string
  total: number
}

export function WeekRevenueBars({ weeks }: { weeks: WeekBucket[] }) {
  const max = Math.max(1, ...weeks.map((w) => w.total))

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-900">Revenue by week (last 8 weeks)</div>
      <div className="mt-4 space-y-2">
        {weeks.map((w) => (
          <div key={w.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs text-neutral-500">{w.label}</div>
            <div className="flex-1 bg-neutral-100 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-neutral-900"
                style={{ width: `${(w.total / max) * 100}%` }}
              />
            </div>
            <div className="w-24 shrink-0 text-right text-xs tabular-nums text-neutral-700">
              {formatMoney(w.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
