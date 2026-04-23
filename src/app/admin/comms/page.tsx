import { createClient } from '@/lib/supabase/server'
import { CommsClient, type CommsRow } from '@/components/admin/CommsClient'

export const dynamic = 'force-dynamic'

export default async function AdminCommsPage() {
  const supabase = await createClient()
  const res = await supabase
    .from('comms_log')
    .select('id, channel, template, to_address, subject, status, sent_at, customers(full_name, email)')
    .order('sent_at', { ascending: false, nullsFirst: false })
    .limit(2000)

  if (res.error) throw res.error

  const rows: CommsRow[] = (res.data ?? []).map((row: any) => ({
    ...row,
    customers: Array.isArray(row.customers) ? (row.customers[0] ?? null) : (row.customers ?? null),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Comms log</h1>
      <CommsClient rows={rows} />
    </div>
  )
}
