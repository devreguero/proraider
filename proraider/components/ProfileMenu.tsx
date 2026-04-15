'use client'

import { useEffect, useRef, useState } from 'react'
import { logout } from '@/app/actions/auth'

type Props = {
  username: string
  email: string
}

export default function ProfileMenu({ username, email }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initial = username[0].toUpperCase()

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center gap-3 overflow-hidden rounded-xl px-2.5 text-white/35 transition hover:bg-white/8 hover:text-white/80 focus:outline-none"
        aria-label="Menú de perfil"
      >
        {/* Avatar */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/20 text-[11px] font-bold text-[var(--app-accent)]">
          {initial}
        </div>

        {/* Username */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-150 delay-75 group-hover:max-w-xs group-hover:opacity-100">
          {username}
        </span>
      </button>

      {open && (
        <div className="absolute left-full bottom-0 z-50 ml-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl shadow-black/40">
          <div className="border-b border-white/8 px-4 py-3">
            <p className="truncate text-sm font-semibold text-white">{username}</p>
            <p className="truncate text-xs text-white/45">{email}</p>
          </div>
          <div className="py-1.5">
            <a href="/perfil" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Mi perfil
            </a>
            <a href="/configuracion" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              Configuración
            </a>
          </div>
          <div className="border-t border-white/8 py-1.5">
            <form action={logout}>
              <button type="submit"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 transition hover:bg-white/5 hover:text-red-400">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
