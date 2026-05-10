import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      return NextResponse.redirect(`${origin}${profile?.role === 'venue' ? '/dashboard' : '/profile/me'}`)
    }
  }
  return NextResponse.redirect(`${origin}/login`)
}
