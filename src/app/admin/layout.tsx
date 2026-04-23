import type { ReactNode } from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <AdminSidebar adminName={admin.fullName} />
      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
