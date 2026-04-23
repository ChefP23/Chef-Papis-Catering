import { createClient } from '@/lib/supabase/server'
import { OrdersClient, type Order } from '@/components/admin/OrdersClient'

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

  if (ordersRes.error) throw ordersRes.error
  if (schoolsRes.error) throw schoolsRes.error

  // Supabase may type relational joins as arrays; normalize each join to a single object or null.
  const raw = ordersRes.data ?? []
  const orders: Order[] = raw.map((row: any) => ({
    ...row,
    customers: Array.isArray(row.customers) ? (row.customers[0] ?? null) : (row.customers ?? null),
    schools: Array.isArray(row.schools) ? (row.schools[0] ?? null) : (row.schools ?? null),
    order_items: Array.isArray(row.order_items) ? row.order_items : [],
  }))
  const schools = schoolsRes.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <OrdersClient orders={orders} schools={schools} />
    </div>
  )
}
