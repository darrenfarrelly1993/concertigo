'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const GENRES = ['Trad / Folk','Jazz','Rock / Indie','Wedding Band','Acoustic Solo','Classical','Blues','Irish Ballads','Country','Soul / R&B']
const COUNTIES = ['Dublin','Cork','Galway','Limerick','Kilkenny','Clare','Kerry','Tipperary','Waterford','Wexford','Wicklow','Meath','Kildare','Louth','Westmeath','Offaly','Laois','Longford','Carlow','Mayo','Sligo','Roscommon','Leitrim','Donegal','Cavan','Monaghan','Antrim','Armagh','Derry','Down','Fermanagh','Tyrone']

export default function ProfileEditForm({ profile, userId }: any) {
  const [firstName, setFirstName] = useState(profile.first_name || '')
  const [lastName, setLastName] = useState(profile.last_name || '')
  const [actName, setActName] = useState(profile.act_name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [rate, setRate] = useState(profile.rate ? profile.rate.replace(/[^0-9]/g,'') : '')
  const [county, setCounty] = useState(profile.county || 'Dublin')
  const [genres, setGenres] = useState<string[]>(profile.genre || [])
  const [instagram, setInstagram] = useState(profile.instagram || '')
  const [facebook, setFacebook] = useState(profile.facebook || '')
  const [youtube, setYoutube] = useState(profile.youtube || '')
  const [spotify, setSpotify] = useState(profile.spotify || '')
  const [saved, setSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const supabase = createClient()

  const toggleGenre = (g: string) => setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const save = async () => {
    await supabase.from('profiles').update({
      first_name: firstName, last_name: lastName, act_name: actName, bio, county,
      rate: rate ? `€${rate}` : null, genre: genres,
      instagram: instagram || null, facebook: facebook || null, youtube: youtube || null, spotify: spotify || null,
    }).eq('id', userId)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const path = `${userId}/avatar.jpg`
    await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: 'image/jpeg' })
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)
    setAvatarUrl(url)
  }

  return (
    <div className="myprof-wrap">
      <div className="myprof-header">
        <div>
          <div className="myprof-avatar" onClick={() => document.getElementById('avatar-upload')?.click()}>
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : '🎵'}
          </div>
          <input id="avatar-upload" type="file" accept="image/*" style={{display:'none'}} onChange={uploadAvatar} />
        </div>
        <div className="myprof-info">
          <h2>{actName || firstName || 'Your Profile'}</h2>
          <div className="msub">{county}</div>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            <span className="pb pb-lime">{profile.role === 'venue' ? 'Venue' : 'Musician'}</span>
            <span className="pb pb-dim">{county}</span>
          </div>
        </div>
      </div>

      <div className="myprof-section">
        <h3>Basic info</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
          <div className="edit-field"><label>First name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
          <div className="edit-field"><label>Last name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
        </div>
        <div className="edit-field"><label>Act / band name</label><input type="text" value={actName} onChange={e => setActName(e.target.value)} /></div>
        <div className="edit-field"><label>County</label><select value={county} onChange={e => setCounty(e.target.value)}>{COUNTIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="edit-field">
          <label>Rate per set</label>
          <div style={{display:'flex',alignItems:'center',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'8px',overflow:'hidden'}}>
            <span style={{padding:'0 12px',fontSize:'0.87rem',color:'var(--muted)',borderRight:'1px solid var(--border)',background:'var(--bg3)'}}>€</span>
            <input type="number" min="0" value={rate} onChange={e => setRate(e.target.value)} placeholder="250" style={{flex:1,border:'none',outline:'none',background:'transparent',padding:'10px 12px',fontFamily:'Instrument Sans,sans-serif',fontSize:'0.87rem'}} />
            <span style={{padding:'0 12px',fontSize:'0.83rem',color:'var(--muted)',borderLeft:'1px solid var(--border)',background:'var(--bg3)'}}>/set</span>
          </div>
        </div>
      </div>

      <div className="myprof-section">
        <h3>About</h3>
        <div className="edit-field"><label>Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell venues about yourself…" /></div>
      </div>

      {profile.role === 'musician' && (
        <div className="myprof-section">
          <h3>Genres</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginTop:'4px'}}>
            {GENRES.map(g => <button key={g} type="button" className={`gpill ${genres.includes(g) ? 'on' : ''}`} onClick={() => toggleGenre(g)}>{g}</button>)}
          </div>
        </div>
      )}

      <div className="myprof-section">
        <h3>Social media</h3>
        <div className="edit-field"><label>Instagram URL</label><input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/yourhandle" /></div>
        <div className="edit-field"><label>Facebook URL</label><input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/yourpage" /></div>
        <div className="edit-field"><label>YouTube URL</label><input type="url" value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/yourchannel" /></div>
        <div className="edit-field"><label>Spotify URL</label><input type="url" value={spotify} onChange={e => setSpotify(e.target.value)} placeholder="https://open.spotify.com/artist/..." /></div>
      </div>

      <div style={{display:'flex',alignItems:'center',marginTop:'0.5rem'}}>
        <button className="save-btn" onClick={save}>Save profile</button>
        {saved && <span className="save-msg">✅ Saved!</span>}
      </div>
    </div>
  )
}
