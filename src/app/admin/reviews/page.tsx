import { createClient } from '@/lib/supabase/server'
import { ReviewsClient, type ReviewRow } from '@/components/admin/ReviewsClient'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const res = await supabase
    .from('reviews')
    .select('id, rating, title, body, service_type, is_verified, is_approved, is_featured, created_at, customers(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (res.error) throw res.error

  // Normalize Supabase join shape for `customers`
  const reviews: ReviewRow[] = (res.data ?? []).map((row: any) => ({
    ...row,
    customers: Array.isArray(row.customers) ? (row.customers[0] ?? null) : (row.customers ?? null),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <ReviewsClient reviews={reviews} />
    </div>
  )
}
