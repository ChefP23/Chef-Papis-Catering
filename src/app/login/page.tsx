'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/foodie-friday')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 900, color: 'var(--gold)', margin: '0 auto 16px' }}>CP</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, color: '#fff', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Sign in to order Foodie Friday</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(196,30,30,0.2)', border: '1px solid rgba(196,30,30,0.4)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#ff8888' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 10, background: loading ? 'rgba(196,30,30,0.5)' : 'var(--red)', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)', marginBottom: 16 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--gold-light)', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}