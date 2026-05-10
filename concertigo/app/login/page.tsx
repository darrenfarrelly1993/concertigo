'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    router.push(profile?.role === 'venue' ? '/dashboard' : '/profile/me')
    router.refresh()
  }

  return (
    <div className="su-wrap">
      <h1>Welcome back</h1>
      <p className="su-sub">Sign in to your Concertigo account.</p>
      <form onSubmit={handleLogin}>
        <div className="form-group"><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><label className="label">Password</label><input className="input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        {error && <p style={{color:'#c0392b',fontSize:'0.8rem',marginBottom:'0.5rem'}}>{error}</p>}
        <button type="submit" className="sub-btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign in →'}</button>
      </form>
      <p className="su-foot">Don't have an account? <Link href="/signup">Join free</Link></p>
    </div>
  )
}
