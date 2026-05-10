import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — Concertigo' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'venue') redirect('/profile/me')

  const name = profile.act_name || profile.first_name || 'Your venue'

  return (
    <div>
      <div className="dash-top">
        <h1>{name}</h1>
        <p>{profile.county || 'Ireland'}</p>
      </div>
      <div className="dash-body">
        <div className="dcard full">
          <h3>At a glance</h3>
          <div className="kpis">
            <div className="kpi"><div className="kv">0</div><div className="kl">Confirmed</div></div>
            <div className="kpi"><div className="kv">0</div><div className="kl">Pending</div></div>
            <div className="kpi"><div className="kv">€0</div><div className="kl">Committed</div></div>
          </div>
        </div>
        <div className="dcard full" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:'1.4rem',marginBottom:'0.5rem'}}>🎵</div>
          <div style={{fontSize:'0.92rem',fontWeight:600,marginBottom:'0.35rem'}}>Need to book an act?</div>
          <p style={{fontSize:'0.83rem',color:'var(--muted)',marginBottom:'1.2rem',fontWeight:300}}>Browse verified musicians and send an enquiry in minutes.</p>
          <Link href="/musicians" className="btn-p">Browse musicians →</Link>
        </div>
      </div>
    </div>
  )
}
