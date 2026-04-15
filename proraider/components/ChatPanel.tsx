'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { SessionPayload } from '@/lib/session'
import type { ConversationMeta, ChatMessage } from '@/lib/db'
import { startConversation, sendMessage } from '@/app/actions/chat'

/* ── helpers ────────────────────────────────────────────────────────────────── */

function msgTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function convTime(dateStr: string | null) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'ahora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

/* ── main component ─────────────────────────────────────────────────────────── */

export default function ChatPanel({ session }: { session: SessionPayload }) {
  const [open, setOpen]           = useState(false)
  const [view, setView]           = useState<'list' | 'thread'>('list')
  const [convId, setConvId]       = useState<number | null>(null)
  const [otherName, setOtherName] = useState('')
  const [convs, setConvs]         = useState<ConversationMeta[]>([])
  const [msgs, setMsgs]           = useState<ChatMessage[]>([])
  const [unread, setUnread]       = useState(0)
  const [input, setInput]         = useState('')
  const [sending, setSending]     = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)
  const pollRef                   = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── fetch helpers ── */

  const fetchConvs = useCallback(async () => {
    const res = await fetch('/api/chat', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setConvs(data.conversations)
    setUnread(data.unreadTotal)
  }, [])

  const fetchMsgs = useCallback(async (id: number) => {
    const res = await fetch(`/api/chat/conv?id=${id}`, { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setMsgs(data.messages)
    // clear unread for this conv
    setConvs((prev) => prev.map((c) => c.id === id ? { ...c, unread_count: 0 } : c))
    setUnread((prev) => Math.max(0, prev - 1))
  }, [])

  /* ── polling ── */

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)

    if (!open) {
      // slow poll for badge
      fetchConvs()
      pollRef.current = setInterval(fetchConvs, 15000)
    } else if (view === 'list') {
      fetchConvs()
      pollRef.current = setInterval(fetchConvs, 4000)
    } else if (view === 'thread' && convId) {
      fetchMsgs(convId)
      pollRef.current = setInterval(() => fetchMsgs(convId), 3000)
    }

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [open, view, convId, fetchConvs, fetchMsgs])

  /* ── scroll to bottom on new messages ── */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  /* ── focus input when opening thread ── */

  useEffect(() => {
    if (view === 'thread') inputRef.current?.focus()
  }, [view])

  /* ── listen for open-chat events from marketplace ── */

  useEffect(() => {
    async function handleOpenChat(e: Event) {
      const { userId, username } = (e as CustomEvent<{ userId: number; username: string }>).detail
      const res = await startConversation(userId)
      if (res.error || !res.convId) return
      setConvId(res.convId)
      setOtherName(username)
      setView('thread')
      setOpen(true)
    }
    window.addEventListener('open-chat', handleOpenChat)
    return () => window.removeEventListener('open-chat', handleOpenChat)
  }, [])

  /* ── actions ── */

  function openThread(conv: ConversationMeta) {
    setConvId(conv.id)
    setOtherName(conv.other_username)
    setView('thread')
  }

  function backToList() {
    setView('list')
    setConvId(null)
    setMsgs([])
  }

  async function handleSend() {
    if (!input.trim() || !convId || sending) return
    const text = input.trim()
    setSending(true)
    setInput('')

    // optimistic
    const optimistic: ChatMessage = {
      id: Date.now(),
      conversation_id: convId,
      sender_id: session.userId,
      sender_username: session.username,
      content: text,
      read: 0,
      created_at: new Date().toISOString(),
    }
    setMsgs((prev) => [...prev, optimistic])

    await sendMessage(convId, text)
    setSending(false)
    fetchMsgs(convId)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  /* ── render ── */

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">

      {/* Panel */}
      {open && (
        <div className="flex h-[440px] w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#181818] shadow-2xl shadow-black/60">

          {/* Header */}
          <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-4 py-3">
            {view === 'thread' && (
              <button onClick={backToList} className="mr-1 text-white/40 transition hover:text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            )}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--app-accent)]/15 text-[11px] font-bold text-[var(--app-accent)] uppercase">
              {view === 'thread' ? otherName[0] : session.username[0]}
            </div>
            <span className="flex-1 truncate text-sm font-semibold text-white">
              {view === 'thread' ? otherName : 'Mensajes'}
            </span>
            <button onClick={() => setOpen(false)} className="text-white/30 transition hover:text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          {view === 'list' ? (
            <div className="flex-1 overflow-y-auto">
              {convs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <svg className="h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
                  </svg>
                  <p className="text-xs text-white/25">Sin conversaciones aún.<br/>Usa <strong className="text-white/40">Contactar</strong> en el Marketplace.</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {convs.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => openThread(c)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <div className="relative shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-[11px] font-bold text-white/50 uppercase">
                            {c.other_username[0]}
                          </div>
                          {c.unread_count > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--app-accent)] text-[9px] font-bold text-black">
                              {c.unread_count}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-white">{c.other_username}</span>
                            <span className="shrink-0 text-[10px] text-white/25">{convTime(c.last_message_at)}</span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-white/35">
                            {c.last_message ?? 'Sin mensajes aún'}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {msgs.length === 0 && (
                  <p className="mt-4 text-center text-xs text-white/25">Di hola 👋</p>
                )}
                {msgs.map((m) => {
                  const isMine = m.sender_id === session.userId
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[72%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                        isMine
                          ? 'rounded-br-sm bg-[var(--app-accent)]/20 text-white'
                          : 'rounded-bl-sm bg-white/8 text-white/85'
                      }`}>
                        <p>{m.content}</p>
                        <p className={`mt-0.5 text-[10px] ${isMine ? 'text-[var(--app-accent)]/50 text-right' : 'text-white/25'}`}>
                          {msgTime(m.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-white/8 px-3 py-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-[var(--app-accent)]/30">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje…"
                    maxLength={1000}
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="shrink-0 text-[var(--app-accent)] transition hover:text-white disabled:opacity-30"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-13 w-13 items-center justify-center rounded-full border border-[var(--app-accent)]/30 bg-[#1a1a1a] text-[var(--app-accent)] shadow-lg shadow-black/50 transition hover:bg-[var(--app-accent)]/15 hover:shadow-[0_0_20px_rgba(79,195,255,0.2)]"
        aria-label="Mensajes"
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--app-accent)] text-[10px] font-bold text-black">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  )
}
