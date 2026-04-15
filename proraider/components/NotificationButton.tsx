'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Notification = {
  id: string
  title: string
  category: string
  date: string
  href: string
}

const STORAGE_KEY = 'proraider_read_notifications'

const CATEGORY_COLORS: Record<string, string> = {
  'Patch Notes':    'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'Content Update': 'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Update':         'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Community':      'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  'Developer Blog': 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  'News':           'text-sky-400 bg-sky-400/10 border-sky-400/25',
  'Event':          'text-orange-400 bg-orange-400/10 border-orange-400/25',
}

function categoryColor(cat: string) {
  return (
    CATEGORY_COLORS[cat] ??
    Object.entries(CATEGORY_COLORS).find(([k]) =>
      cat.toLowerCase().includes(k.toLowerCase())
    )?.[1] ??
    'text-white/40 bg-white/5 border-white/10'
  )
}

export default function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  // Load read IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setReadIds(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  // Fetch notifications from API
  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data: Notification[]) => {
        setNotifications(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  function markAllRead() {
    const allIds = notifications.map((n) => n.id)
    const newSet = new Set(allIds)
    setReadIds(newSet)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds)) } catch {}
  }

  function markRead(id: string) {
    const newSet = new Set(readIds)
    newSet.add(id)
    setReadIds(newSet)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet])) } catch {}
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-xl px-2.5 text-white/35 transition hover:bg-white/8 hover:text-white/80 focus:outline-none"
        aria-label="Notificaciones"
      >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-150 delay-75 group-hover:max-w-xs group-hover:opacity-100">
          Notificaciones
        </span>

        {unreadCount > 0 && (
          <span className="absolute left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--app-accent)] text-[9px] font-bold text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 z-50 ml-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <span className="text-sm font-semibold text-white">Novedades ARC Raiders</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[var(--app-accent)] transition hover:text-white"
              >
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <span className="text-xs text-white/30">Cargando...</span>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <span className="text-xs text-white/30">Sin noticias disponibles</span>
              </div>
            )}

            {!loading && notifications.map((n) => {
              const unread = !readIds.has(n.id)
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => { markRead(n.id); setOpen(false) }}
                  className={`flex items-start gap-3 px-4 py-3 transition hover:bg-white/5 ${unread ? 'bg-white/[0.03]' : ''}`}
                >
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${unread ? 'bg-[var(--app-accent)]' : 'bg-transparent'}`} />
                  <div className="min-w-0 flex-1">
                    {n.category && (
                      <span className={`mb-1 inline-block rounded border px-1.5 py-px text-[9px] font-bold ${categoryColor(n.category)}`}>
                        {n.category}
                      </span>
                    )}
                    <p className={`text-xs leading-snug ${unread ? 'text-white/90' : 'text-white/45'}`}>
                      {n.title}
                    </p>
                    {n.date && (
                      <p className="mt-0.5 text-[10px] text-white/30">{n.date}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          {!loading && notifications.length > 0 && (
            <div className="border-t border-white/8 px-4 py-2.5">
              <Link
                href="/news"
                onClick={() => setOpen(false)}
                className="block text-center text-xs text-white/30 transition hover:text-white/60"
              >
                Ver todas las noticias →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
