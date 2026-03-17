'use client'

import Link from 'next/link'
import MobileNav from './MobileNav'

interface NavLink {
  label: string
  href: string
  isAnchor?: boolean
}

interface HeaderProps {
  links: NavLink[]
  ctaLabel?: string
  ctaHref?: string
  badge?: string
}

export default function Header({ links, ctaLabel = 'Order Now', ctaHref = '/foodie-friday', badge }: HeaderProps) {
  return (
    <header style={{ background: 'rgba(250,247,242,0.95)', borderBottom: '1px solid rgba(196,154,43,0.2)', padding: '0 clamp(16px, 5vw, 64px)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: '#2D4A3E', border: '2px solid #C49A2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 900, color: '#E8B84B', letterSpacing: 1 }}>CP</div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#2D4A3E', lineHeight: 1 }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: '#C49A2B', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }}>Catering - Maryland</div>
            </div>
          </Link>
          {badge && (
            <div style={{ background: 'rgba(196,154,43,0.15)', color: '#C49A2B', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 100, letterSpacing: 1, border: '1px solid rgba(196,154,43,0.3)' }}>{badge}</div>
          )}
        </div>
        <nav className="nav-desktop">
          {links.map((link) =>
            link.isAnchor ? (
              <a key={link.href} href={link.href} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>{link.label}</a>
            ) : (
              <Link key={link.href} href={link.href} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#4A4A4A', textDecoration: 'none' }}>{link.label}</Link>
            )
          )}
          <Link href={ctaHref} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#2D4A3E', marginLeft: 8 }}>{ctaLabel}</Link>
        </nav>
        <MobileNav links={links} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </div>
    </header>
  )
}
