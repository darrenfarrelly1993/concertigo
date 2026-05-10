'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileTabs({ profile, gigs, reviews, musicianId, currentUserId }: any) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [rating, setRating] = useState(0)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewVenue, setReviewVenue] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')
  const supabase = createClient()

  const tabs = ['Overview', 'Media', 'Upcoming Gigs', 'Reviews']

  const submitReview = async () => {
    if (!rating || !reviewBody) { setReviewMsg('Please select a rating and write a review.'); return }
    const { data: prof } = await supabase.from('profiles').select('first_name,last_name').eq('id', currentUserId!).single()
    const reviewerName = prof ? `${prof.first_name} ${prof.last_name || ''}`.trim() : 'Anonymous'
    await supabase.from('reviews').insert({ musician_id: musicianId, reviewer_name: reviewerName, venue_name: reviewVenue, rating, body: reviewBody })
    setReviewMsg('✅ Review submitted!')
    setReviewBody(''); setReviewVenue(''); setRating(0)
  }

  function formatDate(d: string) {
    const date = new Date(d)
    return { day: date.getDate(), month: date.toLocaleString('en-IE', { month: 'short' }) }
  }

  return (
    <div>
      {/* Tab nav */}
      <div className="prof-tabs" style={{marginTop:0,borderTop:'none',marginBottom:'1.5rem'}}>
        {tabs.map(tab => (
          <div key={tab} className={`ptab ${activeTab === tab ? 'on' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div>
          <div className="prof-section">
            <h3>About</h3>
            <p>{profile.bio || 'No bio yet.'}</p>
          </div>
          {profile.travel_counties?.length > 0 && (
            <div className="prof-section">
              <h3>Available to play in</h3>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {profile.travel_counties.map((c: string) => <span key={c} className="date-pill">{c}</span>)}
              </div>
            </div>
          )}
          {currentUserId && (profile.instagram || profile.facebook || profile.youtube || profile.spotify) && (
            <div className="prof-section">
              <h3>Find me online</h3>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {profile.instagram && <a href={profile.instagram} target="_blank" className="social-link">📸 Instagram</a>}
                {profile.facebook && <a href={profile.facebook} target="_blank" className="social-link">📘 Facebook</a>}
                {profile.youtube && <a href={profile.youtube} target="_blank" className="social-link">▶️ YouTube</a>}
                {profile.spotify && <a href={profile.spotify} target="_blank" className="social-link">🎵 Spotify</a>}
              </div>
            </div>
          )}
          {profile.available_dates?.length > 0 && (
            <div className="prof-section">
              <h3>Available dates</h3>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {profile.available_dates.map((d: string) => <span key={d} className="date-pill">{d}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media */}
      {activeTab === 'Media' && (
        <div className="prof-section">
          <h3>Media</h3>
          {profile.media_links?.length > 0 ? profile.media_links.map((url: string, i: number) => {
            const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
            if (ytMatch) return (
              <div key={i} style={{marginBottom:'1rem',borderRadius:'10px',overflow:'hidden',aspectRatio:'16/9'}}>
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytMatch[1]}`} frameBorder="0" allowFullScreen />
              </div>
            )
            return <a key={i} href={url} target="_blank" className="social-link">🎵 View media</a>
          }) : <p>No media added yet.</p>}
        </div>
      )}

      {/* Gigs */}
      {activeTab === 'Upcoming Gigs' && (
        <div className="prof-section">
          <h3>Upcoming Gigs</h3>
          {gigs.length > 0 ? gigs.map((g: any) => {
            const { day, month } = formatDate(g.gig_date)
            return (
              <div key={g.id} className="gig-card">
                <div className="gig-date-box"><div className="day">{day}</div><div className="month">{month}</div></div>
                <div className="gig-info">
                  <h4>{g.venue_name}{g.location ? ` · ${g.location}` : ''}</h4>
                  <div className="gig-meta">{g.start_time || ''}{g.description ? ` · ${g.description}` : ''}</div>
                  {g.ticket_url && <a href={g.ticket_url} target="_blank" className="gig-ticket">🎟 Get tickets →</a>}
                </div>
              </div>
            )
          }) : <p>No upcoming gigs listed.</p>}
        </div>
      )}

      {/* Reviews */}
      {activeTab === 'Reviews' && (
        <div className="prof-section">
          <h3>Reviews</h3>
          {reviews.length > 0 ? reviews.map((r: any) => (
            <div key={r.id} className="rev">
              <div className="rname">{r.reviewer_name} {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              {r.venue_name && <div className="rvenue">{r.venue_name}</div>}
              <p>{r.body}</p>
            </div>
          )) : <p style={{marginBottom:'1.5rem'}}>No reviews yet.</p>}

          {currentUserId && currentUserId !== musicianId && (
            <div style={{marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid var(--border)'}}>
              <div style={{fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem'}}>Leave a review</div>
              <div style={{display:'flex',gap:'0.4rem',marginBottom:'0.75rem'}}>
                {[1,2,3,4,5].map(n => (
                  <span key={n} onClick={() => setRating(n)} style={{fontSize:'1.4rem',cursor:'pointer',opacity: n <= rating ? 1 : 0.3}}>★</span>
                ))}
              </div>
              <input className="input" style={{marginBottom:'0.5rem'}} type="text" placeholder="Your venue name" value={reviewVenue} onChange={e => setReviewVenue(e.target.value)} />
              <textarea className="input" style={{height:'80px',resize:'none',marginBottom:'0.75rem'}} placeholder="Share your experience…" value={reviewBody} onChange={e => setReviewBody(e.target.value)} />
              <button className="btn-p" style={{fontSize:'0.85rem',padding:'10px 20px'}} onClick={submitReview}>Submit review</button>
              {reviewMsg && <div style={{fontSize:'0.8rem',marginTop:'0.5rem',color:'var(--lime-text)'}}>{reviewMsg}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
