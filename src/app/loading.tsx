export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF7F2',
      fontFamily: 'var(--font-dm-sans)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56,
          height: 56,
          background: '#2D4A3E',
          border: '2px solid #C49A2B',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-playfair)',
          fontSize: 16,
          fontWeight: 900,
          color: '#E8B84B',
          margin: '0 auto 16px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          CP
        </div>
        <div style={{ fontSize: 14, color: '#7A7A7A', fontWeight: 500 }}>Loading...</div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  )
}
