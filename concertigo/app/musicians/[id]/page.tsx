import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProfileTabs from '@/components/musicians/ProfileTabs'
import BookingCard from '@/components/musicians/BookingCard'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: p } = await supabase.from('profiles').select('act_name,first_name,last_name,bio,county').eq('id', params.id).single()
  if (!p) return { title: 'Musician — Concertigo' }
  const name = p.act_name || `${p.first_name} ${p.last_name}`
  return {
    title: `${name} — Concertigo`,
    description: p.bio || `Book ${name} for your venue in ${p.county}, Ireland.`,
  }
}

export default async function MusicianPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: profile }, { data: gigs }, { data: reviews }, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', params.id).single(),
    supabase.from('gigs').select('*').eq('musician_id', params.id).gte('gig_date', new Date().toISOString().split('T')[0]).order('gig_date', { ascending: true }),
    supabase.from('reviews').select('*').eq('musician_id', params.id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!profile) notFound()

  const name = profile.act_name || `${profile.first_name} ${profile.last_name || ''}`
  const avgRating = reviews?.length ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div>
      <div className="prof-hero">
        <Link href="/musicians" className="prof-back">← Back to results</Link>
        <div className="prof-top">
          <div className="prof-av">
            {profile.avatar_url ? <img src={profile.avatar_url} alt={name} /> : '🎵'}
          </div>
          <div className="prof-info">
            <h1>{name}</h1>
            <div className="psub">{profile.county || 'Ireland'}{profile.genre?.length ? ` · ${profile.genre.join(', ')}` : ''}</div>
            <div className="pbadges">
              {avgRating && <span className="pb pb-lime">★ {avgRating} — {reviews?.length} review{reviews?.length !== 1 ? 's' : ''}</span>}
              <span className="pb pb-dim">✓ Verified</span>
              {profile.available_dates?.length ? <span className="pb pb-dim">Available</span> : null}
            </div>
          </div>
        </div>
        <div className="prof-tabs" id="prof-tabs-nav">
          {['Overview','Media','Upcoming Gigs','Reviews'].map(tab => (
            <div key={tab} className="ptab" onClick={() => {}} data-tab={tab}>{tab}</div>
          ))}
        </div>
      </div>
      <div className="prof-body">
        <ProfileTabs profile={profile} gigs={gigs || []} reviews={reviews || []} musicianId={params.id} currentUserId={user?.id} />
        <BookingCard profile={profile} musicianId={params.id} currentUserId={user?.id} />
      </div>
    </div>
  )
}
