'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const GENRES = ['Trad / Folk','Jazz','Rock / Indie','Wedding Band','Acoustic Solo','Classical','Blues','Irish Ballads','Country','Soul / R&B']
const COUNTIES = ['Dublin','Cork','Galway','Limerick','Kilkenny','Clare','Kerry','Tipperary','Waterford','Wexford','Wicklow','Meath','Kildare','Louth','Westmeath','Offaly','Laois','Longford','Carlow','Mayo','Sligo','Roscommon','Leitrim','Donegal','Cavan','Monaghan','Antrim','Armagh','Derry','Down','Fermanagh','Tyrone']

export default function SignupPage() {
  const [role, setRole] = useState<'musician'|'venue'>('musician')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [actName, setActName] = useState('')
  const [county, setCounty] = useState('Dublin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleGenre = (g: string) => setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    const userId = data.user?.id
    if (!userId) { router.push('/check-email'); return }
    await supabase.from('profiles').upsert({ id: userId, role, first_name: firstName, last_name: lastName, act_name: actName, county, genre: role === 'musician' ? genres : null })
    if (data.session) {
      setSuccess('🎉 Account created! Welcome to Concertigo.')
      setTimeout(() => router.push(role === 'venue' ? '/dashboard' : '/profile/me'), 1500)
    } else {
      router.push('/check-email')
    }
    setLoading(false)
  }

  return (
    <div className="su-wrap">
      <h1>Join Concertigo</h1>
      <p className="su-sub">{role === 'musician' ? 'Free to join as a musician.' : '€15 one-time signup for venues.'}</p>
      <div className="toggle-row">
        <button type="button" className={`topt ${role === 'musician' ? 'on' : ''}`} onClick={() => setRole('musician')}>I'm a musician</button>
        <button type="button" className={`topt ${role === 'venue' ? 'on' : ''}`} onClick={() => setRole('venue')}>I'm a venue</button>
      </div>
      <form onSubmit={handleSignup}>
        <div className="frow" style={{marginBottom:'1rem'}}>
          <div><label className="label">First name</label><input className="input" type="text" placeholder="Siobhán" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
          <div><label className="label">Last name</label><input className="input" type="text" placeholder="Murphy" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
        </div>
        <div className="form-group"><label className="label">{role === 'musician' ? 'Act / band name' : 'Venue name'}</label><input className="input" type="text" placeholder={role === 'musician' ? 'e.g. The Reel Sisters' : 'e.g. The Cobblestone'} value={actName} onChange={e => setActName(e.target.value)} /></div>
        <div className="form-group"><label className="label">County</label><select className="input" value={county} onChange={e => setCounty(e.target.value)}>{COUNTIES.map(c => <option key={c}>{c}</option>)}</select></div>
        {role === 'musician' && (
          <div className="form-group">
            <label className="label">Genres</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginTop:'4px'}}>
              {GENRES.map(g => <button key={g} type="button" className={`gpill ${genres.includes(g) ? 'on' : ''}`} onClick={() => toggleGenre(g)}>{g}</button>)}
            </div>
          </div>
        )}
        <div className="form-group"><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><label className="label">Password</label><input className="input" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} /></div>
        {error && <p style={{color:'#c0392b',fontSize:'0.8rem',marginBottom:'0.5rem'}}>{error}</p>}
        {success && <p style={{color:'#27ae60',fontSize:'0.8rem',marginBottom:'0.5rem'}}>{success}</p>}
        <button type="submit" className="sub-btn" disabled={loading}>{loading ? 'Creating account…' : 'Create free account →'}</button>
      </form>
      <p className="su-foot">Already have an account? <Link href="/login">Sign in</Link></p>
    </div>
  )
}
