import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Find Musicians — Concertigo',
  description: 'Browse verified musicians across Ireland.',
}

export default async function MusiciansPage({ searchParams }: { searchParams: { q?: string, county?: string, genre?: string } }) {
  const supabase = createClient()
  let query = supabase.from('profiles').select('*').eq('role', 'musician').order('created_at', { ascending: false })
  if (searchParams.county) query = query.eq('county', searchParams.county)
  const { data: all } = await query
  let musicians = all ?? []

  if (searchParams.q) {
    const kw = searchParams.q.toLowerCase()
    musicians = musicians.filter((m: any) =>
      (m.act_name || `${m.first_name} ${m.last_name}`).toLowerCase().includes(kw) ||
      (m.bio || '').toLowerCase().includes(kw) ||
      (m.genre || []).join(' ').toLowerCase().includes(kw)
    )
  }
  if (searchParams.genre && searchParams.genre !== 'All genres') {
    musicians = musicians.filter((m: any) =>
      (m.genre || []).some((g: string) => g.toLowerCase().includes(searchParams.genre!.toLowerCase()))
    )
  }

  const GENRES = ['Trad / Folk','Jazz','Rock / Indie','Wedding Band','Acoustic Solo','Classical','Blues','Irish Ballads','Country','Soul / R&B','Under €300']
  const COUNTIES = ['Dublin','Cork','Galway','Limerick','Kilkenny','Clare','Kerry','Tipperary','Waterford','Wexford','Wicklow','Meath','Kildare','Louth','Westmeath','Offaly','Laois','Longford','Carlow','Mayo','Sligo','Roscommon','Leitrim','Donegal','Cavan','Monaghan','Antrim','Armagh','Derry','Down','Fermanagh','Tyrone']

  return (
    <div>
      <div className="browse-top">
        <h1>Find musicians</h1>
        <p>Musicians available across Ireland</p>
        <form method="GET" action="/musicians">
          <div className="search-row">
            <input name="q" className="s-input" type="text" placeholder="Search by name, genre or keyword…" defaultValue={searchParams.q || ''} />
            <select name="county" className="s-sel" defaultValue={searchParams.county || ''}>
              <option value="">All Ireland</option>
              {COUNTIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button type="submit" className="s-btn">Search</button>
          </div>
          <div className="filter-row">
            <Link href="/musicians" className={`fc ${!searchParams.genre ? 'on' : ''}`}>All genres</Link>
            {GENRES.map(g => (
              <Link key={g} href={`/musicians?${new URLSearchParams({...searchParams, genre: g})}`} className={`fc ${searchParams.genre === g ? 'on' : ''}`}>{g}</Link>
            ))}
          </div>
        </form>
      </div>
      <div className="browse-body">
        <p className="results-meta">Showing {musicians.length} musician{musicians.length !== 1 ? 's' : ''}</p>
        <div className="mgrid">
          {musicians.length === 0 && (
            <div style={{gridColumn:'1/-1',padding:'3rem',textAlign:'center',color:'var(--muted)'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>🎵</div>
              <div style={{fontWeight:500,marginBottom:'0.4rem'}}>No musicians found</div>
              <div style={{fontSize:'0.83rem',fontWeight:300}}>Try adjusting your search or filters.</div>
            </div>
          )}
          {musicians.map((m: any) => (
            <Link key={m.id} href={`/musicians/${m.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div className="mcard">
                <div className="mcard-img">
                  {m.avatar_url ? <img src={m.avatar_url} alt={m.act_name || m.first_name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span>🎵</span>}
                  {m.county && <div className="mbadge">{m.county}</div>}
                </div>
                <div className="mcard-body">
                  <h3>{m.act_name || `${m.first_name} ${m.last_name || ''}`}</h3>
                  <div className="mcard-meta">{m.county || 'Ireland'}</div>
                  <div className="mcard-tags">{(m.genre || []).map((g: string) => <span key={g} className="tag">{g}</span>)}</div>
                  <div><span className="mrate">{m.rate || 'Contact for rates'}</span></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
