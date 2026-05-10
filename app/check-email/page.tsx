export default function CheckEmailPage() {
  return (
    <div className="check-email-wrap">
      <div style={{fontSize:'3rem',marginBottom:'1.5rem'}}>📬</div>
      <h2 style={{fontSize:'1.9rem',fontWeight:700,letterSpacing:'-0.04em',marginBottom:'0.75rem'}}>Check your email</h2>
      <p style={{color:'var(--muted)',fontSize:'0.9rem',lineHeight:1.7,marginBottom:'2rem',fontWeight:300}}>We've sent a confirmation link to your email address. Click the link to activate your account.</p>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r2)',padding:'1.2rem',fontSize:'0.83rem',color:'var(--muted)',lineHeight:1.65}}>
        Can't find it? Check your <strong style={{color:'var(--text)'}}>spam or junk folder</strong>.
      </div>
    </div>
  )
}
