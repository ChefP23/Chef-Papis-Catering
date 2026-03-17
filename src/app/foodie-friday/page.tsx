import { createClient } from '@/lib/supabase/server'
import FoodieFridayClient from './FoodieFridayClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Foodie Friday Menu | Chef Papi's Catering - MCPS & FCPS School Lunch Delivery",
  description: "Order this week's Foodie Friday lunch. Weekly delivery to MCPS and FCPS school staff every Friday 10AM-1PM. Jerk chicken, alfredo, and more. Order by Wednesday.",
}

export default async function FoodieFridayPage() {
  const supabase = await createClient()

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch published menu cycles and their items
  let menuItems: any[] = []
  const { data: cycles } = await supabase
    .from('menu_cycles')
    .select('*')
    .eq('status', 'published')
    .order('delivery_date', { ascending: true })

  if (cycles && cycles.length > 0) {
    for (const cycle of cycles) {
      const { data: items } = await supabase
        .from('menu_items')
        .select('*')
        .eq('cycle_id', cycle.id)
        .eq('is_available', true)
        .order('sort_order')

      if (items) {
        menuItems.push(
          ...items.map((item: any) => ({
            ...item,
            cutoff_datetime: cycle.cutoff_datetime,
            delivery_date: cycle.delivery_date,
          }))
        )
      }
    }
  }

  return <FoodieFridayClient initialMenuItems={menuItems} initialUser={user} />
}
