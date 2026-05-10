'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BookingCard({ profile, musicianId, currentUserId }: any) {
  const router = useRouter()
  const supabase = createClient()

  const startConversation = async () => {
    if (!currentUserId) { router.push('/login'); return }
    const userId = currentUserId
    const p1 = userId < musicianId ? userId : musicianId
    const p2 = userId < musicianId ? musicianId : userId
    const { data: existing } = await supabase.from('conversations').select('id').eq('participant_1', p1).eq('participant_2', p2).single()
    if (existing) { router.push('/messages'); return }
    await supabase.from('conversations').insert({ participant_1: p1, participant_2: p2 })
    router.push('/messages')
  }

  const name = profile.act_name || profile.first_name

  return (
    <div className="book-card">
      <div style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontSize:'0.67rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'0.4rem'}}>Rate per set</div>
        <div className="bprice">{profile.rate ? <>{profile.rate} <span>/ set</span></> : 'Contact for rates'}</div>
      </div>
      {currentUserId && currentUserId !== musicianId ? (
        <button className="send-btn" onClick={startConversation}>
          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Message {name}
          </span>
        </button>
      ) : currentUserId === musicianId ? null : (
        <div style={{textAlign:'center',padding:'1rem',background:'var(--bg2)',borderRadius:'10px',border:'1px solid var(--border)'}}>
          <p style={{fontSize:'0.83rem',color:'var(--muted)',marginBottom:'0.75rem'}}>Sign in to message this musician</p>
          <button className="btn-p" style={{width:'100%',fontSize:'0.85rem'}} onClick={() => router.push('/login')}>Sign in</button>
        </div>
      )}
    </div>
  )
}
