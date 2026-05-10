'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MessagesClient({ userId, initialConversations, profileMap }: any) {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const supabase = createClient()
  const intervalRef = useRef<any>(null)

  const loadMessages = async (convId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const openConv = (conv: any) => {
    setActiveConv(conv)
    loadMessages(conv.id)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => loadMessages(conv.id), 3000)
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return
    await supabase.from('messages').insert({ conversation_id: activeConv.id, sender_id: userId, content: input.trim() })
    setInput('')
    loadMessages(activeConv.id)
  }

  const getOther = (conv: any) => {
    const otherId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1
    return profileMap[otherId] || {}
  }

  return (
    <div className="msg-layout">
      <div className="conv-panel">
        <div className="conv-panel-header">Messages</div>
        <div className="conv-list">
          {conversations.length === 0 && <div style={{padding:'1.5rem',textAlign:'center',fontSize:'0.83rem',color:'var(--muted)'}}>No conversations yet.</div>}
          {conversations.map((conv: any) => {
            const other = getOther(conv)
            const name = other.act_name || `${other.first_name || ''} ${other.last_name || ''}`.trim() || 'Unknown'
            return (
              <div key={conv.id} className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`} onClick={() => openConv(conv)}>
                <div className="conv-av">{other.avatar_url ? <img src={other.avatar_url} alt={name} /> : '🎵'}</div>
                <div>
                  <div className="conv-name">{name}</div>
                  <div className="conv-preview">{other.county || ''}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header">
          {activeConv ? (() => {
            const other = getOther(activeConv)
            const name = other.act_name || `${other.first_name || ''} ${other.last_name || ''}`.trim()
            return (
              <>
                <div className="conv-av">{other.avatar_url ? <img src={other.avatar_url} alt={name} /> : '🎵'}</div>
                <div style={{fontWeight:600,fontSize:'0.9rem'}}>{name}</div>
              </>
            )
          })() : <div style={{color:'var(--muted)',fontSize:'0.9rem'}}>Select a conversation</div>}
        </div>
        <div className="chat-messages">
          {messages.length === 0 && activeConv && <div style={{textAlign:'center',color:'var(--muted)',fontSize:'0.83rem',margin:'auto'}}>No messages yet. Say hello!</div>}
          {messages.map((m: any) => {
            const isOut = m.sender_id === userId
            const time = new Date(m.created_at).toLocaleTimeString('en-IE', {hour:'2-digit',minute:'2-digit'})
            return (
              <div key={m.id} className={isOut ? 'msg-row-out' : 'msg-row-in'}>
                <div className={`msg-bubble ${isOut ? 'msg-out' : 'msg-in'}`}>{m.content}</div>
                <div className="msg-time">{time}</div>
              </div>
            )
          })}
        </div>
        <div className="chat-input-wrap">
          <input className="chat-input" type="text" placeholder="Type a message…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={!activeConv} />
          <button className="send-btn" style={{width:'auto',padding:'10px 18px'}} onClick={sendMessage} disabled={!activeConv}>Send</button>
        </div>
      </div>
    </div>
  )
}
