export function StarRating({ rating }: { rating: number | null | undefined }) {
  const n = Math.max(0, Math.min(5, rating ?? 0))
  return (
    <span className="text-amber-500" aria-label={`${n} out of 5`}>
      {'★'.repeat(n)}
      <span className="text-neutral-300">{'★'.repeat(5 - n)}</span>
    </span>
  )
}
