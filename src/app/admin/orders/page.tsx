import { createClient } from '@/lib/supabase/server'
import { OrdersClient } from '@/components/admin/OrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const [ordersRes, schoolsRes] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, order_number, total, subtotal, status, paid_at, delivered_at, created_at, stripe_payment_intent_id, notes, staff_name, school_id, cycle_id, customer_phone, customers(id, full_name, email, phone), schools(id, name), order_items(id, item_name, item_price, quantity, for_staff_name)'
      )
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase.from('schools').select('id, name').order('name'),
  ])

  // Supabase types relational joins as arrays; cast to the normalized shape OrdersClient expects.
  const orders = (ordersRes.data ?? []) as unknown as Parameters<typeof OrdersClient>[0]['orders']
  const schools = schoolsRes.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <OrdersClient orders={orders} schools={schools} />
    </div>
  )
}
