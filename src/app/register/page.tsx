'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [contactPref, setContactPref] = useState('both')
  const [marketingOptIn, setMarketingOptIn] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister() {
    setLoading(true)
    setError('')

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('customers').insert({
        auth_user_id: data.user.id,
        full_name: fullName,
        email,
        phone: phone || null,
        preferred_contact: contactPref,
        marketing_opt_in: marketingOptIn,
        order_source: 'web',
      })
    }

    router.push('/?registered=1')
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: 'var(--red)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 900, color: 'var(--gold)', margin: '0 auto 16px' }}>CP</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, color: '#fff', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Join Chef Papi&apos;s and order Foodie Friday</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(196,30,30,0.2)', border: '1px solid rgba(196,30,30,0.4)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#ff8888' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="First & Last Name"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Phone <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(for SMS updates)</span></label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (240) 555-0100"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, display: 'block' }}>Preferred Contact</label>
            <select
              value={contactPref}
              onChange={e => setContactPref(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(30,20,10,0.95)', color: '#fff', fontSize: 15, fontFamily: 'var(--font-dm-sans)', outline: 'none' }}
            >
              <option value="both">SMS + Email</option>
              <option value="sms">SMS Only</option>
              <option value="email">Email Only</option>
            </select>
          </div>

          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <input
              type="checkbox"
              id="marketing"
              checked={marketingOptIn}
              onChange={e => setMarketingOptIn(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--red)', width: 16, height: 16, flexShrink: 0 }}
            />
            <label htmlFor="marketing" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, cursor: 'pointer' }}>
              📱 Text/email me the Foodie Friday menu drop every week so I never miss out
            </label>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 10, background: loading ? 'rgba(196,30,30,0.5)' : 'var(--red)', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans)', marginBottom: 16 }}
          >
            {loading ? 'Creating Account...' : 'Create Account & Start Ordering'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--gold-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
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