'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Nav() {
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        setRole(data?.role ?? 'musician')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        setRole(data?.role ?? 'musician')
      } else {
        setRole(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setRole(null)
    window.location.href = '/'
  }

  return (
    <nav>
      <Link href="/" className="logo">concert<span>igo</span></Link>
      <div className="nav-links">
        <Link href="/musicians">Find Musicians</Link>
        <Link href="/venues">For Venues</Link>
        {role ? (
          <>
            <Link href="/messages">Messages</Link>
            <Link href={role === 'venue' ? '/dashboard' : '/profile/me'}>
              {role === 'venue' ? 'Dashboard' : 'My Profile'}
            </Link>
            <button onClick={signOut} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'0.82rem',padding:'6px 12px',borderRadius:'8px',cursor:'pointer'}}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/login">Sign In</Link>
            <Link href="/signup" className="nav-cta">Join Free</Link>
          </>
        )}
      </div>
    </nav>
  )
}
