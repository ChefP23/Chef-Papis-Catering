import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF7F2',
      fontFamily: 'var(--font-dm-sans)',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 100,
          fontWeight: 700,
          color: 'rgba(196,154,43,0.2)',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 32,
          color: '#2D4A3E',
          marginBottom: 12,
        }}>
          Page Not Found
        </h1>
        <p style={{
          fontSize: 15,
          color: '#7A7A7A',
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          This page doesn&apos;t exist — but the food does. Head back to the homepage or check out this week&apos;s menu.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '14px 32px',
              background: '#2D4A3E',
              color: '#fff',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/foodie-friday"
            style={{
              padding: '14px 32px',
              background: '#C49A2B',
              color: '#1C1C1C',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Order Foodie Friday
          </Link>
        </div>
      </div>
    </div>
  )
}
