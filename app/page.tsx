import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
  try {
    const supabase = createClient()
    const [{ count: musicians }, { count: venues }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'musician'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'venue'),
    ])
    return { musicians: musicians ?? 0, venues: venues ?? 0 }
  } catch {
    return { musicians: 0, venues: 0 }
  }
}

export default async function HomePage() {
  const { musicians, venues } = await getStats()

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div style={{position:'relative'}}>
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            Great nights start here
          </div>
          <h1>Live music,<br /><em>made simple.</em></h1>
          <p className="hero-sub">Connect with Ireland's best musicians. Book a trad session, a jazz night, a wedding band — directly, no agents.</p>
          <div className="hero-btns">
            <Link href="/musicians" className="btn-p">Browse Musicians</Link>
            <Link href="/signup" className="btn-g">List Your Act</Link>
          </div>
        </div>
      </section>

      <div className="stats-row">
        <div className="stat-item"><div className="n">{musicians}</div><div className="l">Musicians</div></div>
        <div className="stat-item"><div className="n">{venues}</div><div className="l">Venues</div></div>
        <div className="stat-item"><div className="n">32</div><div className="l">Counties</div></div>
      </div>

      <div className="section-wrap">
        <div className="section-label">How it works</div>
        <div className="section-title">From search to soundcheck.</div>
        <p className="section-sub">Book a verified musician in minutes — no phone tag, no agents.</p>
        <div className="steps-grid">
          {[
            { n: '01 — Browse', title: 'Search & filter', desc: 'Filter by genre, county, date and budget.' },
            { n: '02 — Connect', title: 'Send an enquiry', desc: 'Message directly with your date and requirements.' },
            { n: '03 — Book', title: 'Confirm securely', desc: 'Pay a deposit through Concertigo.' },
            { n: '04 — Enjoy', title: 'Enjoy the night', desc: 'Leave a review after the gig.' },
          ].map((s, i) => (
            <div key={i} className="step-box">
              <div className="step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="cta-split">
          <div className="cta-box">
            <div className="cta-icon">🎸</div>
            <h3>For Musicians</h3>
            <p>Create a profile, set your rates and get discovered by hundreds of Irish venues.</p>
            <Link href="/signup" className="btn-g" style={{fontSize:'0.82rem'}}>Create artist profile →</Link>
          </div>
          <div className="cta-box">
            <div className="cta-icon">🏛</div>
            <h3>For Venues</h3>
            <p>Browse verified musicians and manage everything from your dashboard. One-time €15 signup.</p>
            <Link href="/venues" className="btn-g" style={{fontSize:'0.82rem'}}>View venue dashboard →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
