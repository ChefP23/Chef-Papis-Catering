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
    <main style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--font-dm-sans)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ width: 64, height: 64, background: '#2D4A3E', border: '2px solid #C49A2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 900, color: '#E8B84B', margin: '0 auto 16px' }}>CP</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 14, color: '#2D4A3E', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Chef Papi&apos;s Catering</div>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, color: '#2D4A3E', marginBottom: 8, marginTop: 20 }}>Welcome Back</h1>
          <p style={{ color: '#7A7A7A', fontSize: 15 }}>Sign in to order Foodie Friday</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(45,74,62,0.15)', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {error && (
            <div style={{ background: 'rgba(155,21,21,0.08)', border: '1px solid rgba(155,21,21,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#9B1515' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6, display: 'block' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(45,74,62,0.2)', background: '#FAF7F2', color: '#1C1C1C', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6, display: 'block' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(45,74,62,0.2)', background: '#FAF7F2', color: '#1C1C1C', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 10, background: loading ? 'rgba(45,74,62,0.5)' : '#2D4A3E', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)', marginBottom: 16 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 14, color: '#7A7A7A' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#C49A2B', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: '#7A7A7A', textDecoration: 'none' }}>
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
