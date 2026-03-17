'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
  isAnchor?: boolean
}

interface MobileNavProps {
  links: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}

export default function MobileNav({ links, ctaLabel = 'Order Now', ctaHref = '/foodie-friday' }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  // Close menu on route change or resize
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        className="nav-mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{ display: 'none' }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
      </button>

      {open && (
        <div className="nav-mobile-menu" style={{ display: 'none' }} onClick={() => setOpen(false)}>
          {links.map((link) =>
            link.isAnchor ? (
              <a key={link.href} href={link.href}>{link.label}</a>
            ) : (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            )
          )}
          <Link href={ctaHref} className="nav-cta">{ctaLabel}</Link>
        </div>
      )}
    </>
  )
}
