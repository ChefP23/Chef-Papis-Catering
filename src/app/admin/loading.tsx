export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-neutral-200" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-neutral-100" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-neutral-100" />
    </div>
  )
}
