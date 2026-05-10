import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesClient from '@/components/messages/MessagesClient'

export const metadata = { title: 'Messages — Concertigo' }

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await supabase
    .from('conversations').select('*')
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const otherIds = (conversations || []).map((c: any) => c.participant_1 === user.id ? c.participant_2 : c.participant_1)
  const { data: profiles } = otherIds.length ? await supabase.from('profiles').select('id,first_name,last_name,act_name,avatar_url,county').in('id', otherIds) : { data: [] }
  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]))

  return <MessagesClient userId={user.id} initialConversations={conversations || []} profileMap={profileMap} />
}
