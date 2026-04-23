import { createClient } from '@/lib/supabase/server'
import { CateringClient, type CateringRow } from '@/components/admin/CateringClient'

export const dynamic = 'force-dynamic'

export default async function AdminCateringPage() {
  const supabase = await createClient()

  const [inquiriesRes, requestsRes] = await Promise.all([
    supabase
      .from('catering_inquiries')
      .select('id, contact_name, contact_email, contact_phone, event_type, event_date, guest_count, budget_range, status, quote_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase
      .from('catering_requests')
      .select('id, full_name, email, phone, event_type, event_date, guest_count, budget, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
  ])

  if (inquiriesRes.error) throw inquiriesRes.error
  if (requestsRes.error) throw requestsRes.error

  const rows: CateringRow[] = [
    ...(inquiriesRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_inquiries' as const,
      name: r.contact_name,
      email: r.contact_email,
      phone: r.contact_phone,
      event_type: r.event_type,
      event_date: r.event_date,
      guest_count: r.guest_count,
      budget: r.budget_range,
      status: r.status ?? 'new',
      quote_amount: r.quote_amount,
      created_at: r.created_at,
    })),
    ...(requestsRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_requests' as const,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      event_type: r.event_type,
      event_date: r.event_date,
      guest_count: r.guest_count,
      budget: r.budget,
      status: r.status ?? 'new',
      quote_amount: null,
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Catering inquiries</h1>
      <CateringClient rows={rows} />
    </div>
  )
}
