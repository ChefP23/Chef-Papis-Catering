'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
          width: 64,
          height: 64,
          background: 'rgba(155,21,21,0.1)',
          border: '1px solid rgba(155,21,21,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          margin: '0 auto 20px',
        }}>
          !
        </div>
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 28,
          color: '#2D4A3E',
          marginBottom: 12,
        }}>
          Something Went Wrong
        </h2>
        <p style={{
          fontSize: 15,
          color: '#7A7A7A',
          lineHeight: 1.7,
          marginBottom: 28,
        }}>
          We hit a snag loading this page. This is usually temporary — try refreshing, or head back to the homepage.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '14px 32px',
              background: '#2D4A3E',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: '#2D4A3E',
              border: '2px solid rgba(45,74,62,0.2)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Back to Home
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#7A7A7A', marginTop: 24 }}>
          Still having trouble? Call us at{' '}
          <a href="tel:+13014483475" style={{ color: '#C49A2B', textDecoration: 'none', fontWeight: 600 }}>
            (301) 448-3475
          </a>
        </p>
      </div>
    </div>
  )
}
