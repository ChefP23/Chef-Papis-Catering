import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminContext {
  userId: string
  email: string
  customerId: string
  fullName: string | null
}

/**
 * Server-side guard. Call at the top of admin layout/pages/route handlers.
 * Redirects to `/login` if unauthenticated, `/` if authenticated but not admin.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('id, full_name, is_admin')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!customer?.is_admin) {
    redirect('/')
  }

  return {
    userId: user.id,
    email: user.email ?? '',
    customerId: customer.id,
    fullName: customer.full_name,
  }
}
