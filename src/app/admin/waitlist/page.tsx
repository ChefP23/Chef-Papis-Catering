import { createClient } from '@/lib/supabase/server'
import { WaitlistClient, type WaitlistRow } from '@/components/admin/WaitlistClient'

export const dynamic = 'force-dynamic'

export default async function AdminWaitlistPage() {
  const supabase = await createClient()
  const res = await supabase
    .from('waitlist')
    .select('id, name, email, phone, position, notified_spot_open, notified_next_cycle, created_at, schools(name), menu_cycles(title, delivery_date)')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (res.error) throw res.error

  const rows: WaitlistRow[] = (res.data ?? []).map((row: any) => ({
    ...row,
    schools: Array.isArray(row.schools) ? (row.schools[0] ?? null) : (row.schools ?? null),
    menu_cycles: Array.isArray(row.menu_cycles) ? (row.menu_cycles[0] ?? null) : (row.menu_cycles ?? null),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Waitlist</h1>
      <WaitlistClient rows={rows} />
    </div>
  )
}
