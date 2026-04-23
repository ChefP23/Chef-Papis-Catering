'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV: { href: string; label: string }[] = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/cycles', label: 'Menu Cycles' },
  { href: '/admin/schools', label: 'Schools' },
  { href: '/admin/catering', label: 'Catering Inquiries' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/waitlist', label: 'Waitlist' },
  { href: '/admin/comms', label: 'Comms Log' },
]

export function AdminSidebar({ adminName }: { adminName: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-neutral-900 text-neutral-100 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-neutral-800">
        <div className="text-sm uppercase tracking-widest text-neutral-400">Chef Papi&apos;s</div>
        <div className="text-lg font-semibold">Admin Dashboard</div>
        {adminName ? <div className="text-xs text-neutral-500 mt-1">{adminName}</div> : null}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'block px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
              ].join(' ')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-neutral-800 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-300">← Back to site</Link>
      </div>
    </aside>
  )
}
