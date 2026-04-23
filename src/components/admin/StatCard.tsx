interface StatCardProps {
  label: string
  value: string
  sublabel?: string
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-neutral-900">{value}</div>
      {sublabel ? <div className="mt-1 text-xs text-neutral-500">{sublabel}</div> : null}
    </div>
  )
}
