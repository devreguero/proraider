'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventSlot = { minor: string | null; major: string | null }
type ScheduleHour = { hour: number } & { [map: string]: EventSlot }

type EventsData = {
  maps: string[]
  eventTypes: Record<string, { description: string; color: string }>
  schedule: ScheduleHour[]
  confirmedHours: number[]
}

type AgendaItem = {
  id: string        // `${mapName}__${hour}`
  mapName: string
  hour: number
}

// ─── Event styling ────────────────────────────────────────────────────────────

const EVENT_STYLES: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  'Hidden Bunker':       { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30',    dot: 'bg-red-400' },
  'Matriarch':           { text: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30', dot: 'bg-violet-400' },
  'Harvester':           { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  'Prospecting Probes':  { text: 'text-teal-400',   bg: 'bg-teal-400/10',   border: 'border-teal-400/30',   dot: 'bg-teal-400' },
  'Night Raid':          { text: 'text-slate-400',  bg: 'bg-slate-400/10',  border: 'border-slate-400/30',  dot: 'bg-slate-400' },
  'Electromagnetic Storm':{ text: 'text-blue-400',  bg: 'bg-blue-400/10',   border: 'border-blue-400/30',   dot: 'bg-blue-400' },
  'Locked Gate':         { text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30', dot: 'bg-indigo-400' },
  'Cold Snap':           { text: 'text-white/70',   bg: 'bg-white/5',       border: 'border-white/15',      dot: 'bg-white/60' },
  'Close Scrutiny':      { text: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30',  dot: 'bg-amber-400' },
  'Hurricane':           { text: 'text-slate-300',  bg: 'bg-slate-400/10',  border: 'border-slate-400/30',  dot: 'bg-slate-300' },
  'Lush Blooms':         { text: 'text-emerald-400',bg: 'bg-emerald-400/10',border: 'border-emerald-400/30',dot: 'bg-emerald-400' },
  'Launch Tower Loot':   { text: 'text-emerald-400',bg: 'bg-emerald-400/10',border: 'border-emerald-400/30',dot: 'bg-emerald-400' },
  'Uncovered Caches':    { text: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30',  dot: 'bg-amber-400' },
  'Bird City':           { text: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/30',    dot: 'bg-sky-400' },
  'Husk Graveyard':      { text: 'text-slate-400',  bg: 'bg-slate-400/10',  border: 'border-slate-400/30',  dot: 'bg-slate-400' },
}

const DEFAULT_STYLE = { text: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10', dot: 'bg-white/40' }

function style(name: string | null) {
  if (!name) return DEFAULT_STYLE
  return EVENT_STYLES[name] ?? DEFAULT_STYLE
}

// ─── Event icons (real in-game icons from arcraiders.wiki) ───────────────────

const WIKI = 'https://arcraiders.wiki/w/images'

const EVENT_ICON_URLS: Record<string, string> = {
  'Hidden Bunker':        `${WIKI}/7/79/Icon_HiddenBunker.png`,
  'Matriarch':            `${WIKI}/2/26/Icon_ARC_Matriarch.png`,
  'Harvester':            `${WIKI}/5/56/Icon_ARC_Harvester.png`,
  'Prospecting Probes':   `${WIKI}/2/21/Icon_ProspectingProbes.png`,
  'Night Raid':           `${WIKI}/b/b5/Icon_NightRaid.png`,
  'Electromagnetic Storm':`${WIKI}/2/20/Icon_ElectromagneticStorm.png`,
  'Locked Gate':          `${WIKI}/b/b0/Icon_LockedGate.png`,
  'Cold Snap':            `${WIKI}/6/60/Icon_ColdSnap.png`,
  'Close Scrutiny':       `${WIKI}/8/83/Icon_CloseScrutiny.gif`,
  'Hurricane':            `${WIKI}/c/c0/Icon_Hurricane.png`,
  'Lush Blooms':          `${WIKI}/5/54/Icon_Nature.png`,
  'Launch Tower Loot':    `${WIKI}/2/2a/Icon_LaunchTowerLoot.png`,
  'Uncovered Caches':     `${WIKI}/8/8d/Icon_UncoveredCaches.png`,
  'Bird City':            `${WIKI}/e/e4/Icon_BirdCity.png`,
  'Husk Graveyard':       `${WIKI}/a/a2/Icon_HuskGraveyard.png`,
}

function EventIcon({ name, className = 'h-3.5 w-3.5' }: { name: string; className?: string }) {
  const url = EVENT_ICON_URLS[name]
  if (!url) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

const MAP_COLORS: Record<string, { accent: string; border: string; bg: string; dot: string }> = {
  'Dam':          { accent: 'text-blue-400',    border: 'border-blue-400/20',    bg: 'bg-blue-400/5',    dot: 'bg-blue-400' },
  'Buried City':  { accent: 'text-orange-400',  border: 'border-orange-400/20',  bg: 'bg-orange-400/5',  dot: 'bg-orange-400' },
  'Spaceport':    { accent: 'text-violet-400',  border: 'border-violet-400/20',  bg: 'bg-violet-400/5',  dot: 'bg-violet-400' },
  'Blue Gate':    { accent: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5', dot: 'bg-emerald-400' },
  'Stella Montis':{ accent: 'text-amber-400',   border: 'border-amber-400/20',   bg: 'bg-amber-400/5',   dot: 'bg-amber-400' },
}

// ─── Event badge ──────────────────────────────────────────────────────────────

function EventBadge({ name, tier, live }: { name: string; tier: 'major' | 'minor'; live?: boolean }) {
  const s = style(name)
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${s.bg} ${s.border}`}>
      <span className={`relative flex shrink-0 ${s.text}`}>
        {live && <span className={`absolute -inset-0.5 animate-ping rounded-full opacity-20 ${s.dot}`} />}
        <EventIcon name={name} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold leading-tight ${s.text}`}>{name}</p>
        <p className="text-[10px] capitalize text-white/25">{tier === 'major' ? 'Evento Mayor' : 'Evento Menor'}</p>
      </div>
    </div>
  )
}

function NoEventBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <span className="h-2 w-2 shrink-0 rounded-full bg-white/10" />
      <p className="text-sm text-white/20">Sin evento</p>
    </div>
  )
}

// ─── Map card ─────────────────────────────────────────────────────────────────

function MapCard({
  mapName,
  current,
  next,
  countdown,
  confirmed,
}: {
  mapName: string
  current: EventSlot
  next: EventSlot
  countdown: string
  confirmed: boolean
}) {
  const mc = MAP_COLORS[mapName] ?? { accent: 'text-white/50', border: 'border-white/10', bg: 'bg-white/5' }
  const hasNextEvent = next.major || next.minor

  return (
    <div className={`flex flex-col rounded-2xl border ${mc.border} ${mc.bg} overflow-hidden`}>
      {/* Map header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/6 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className={`h-4 w-4 shrink-0 ${mc.accent}`} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className={`text-sm font-bold ${mc.accent}`}>{mapName}</span>
        </div>
        {/* Countdown */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-black/20 px-2.5 py-1">
          <svg className="h-3 w-3 text-white/25" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          <span className="font-mono text-xs font-semibold text-white/50">{countdown}</span>
          {!confirmed && (
            <span className="ml-1 rounded bg-amber-400/20 px-1 text-[9px] font-bold text-amber-400">?</span>
          )}
        </div>
      </div>

      {/* Current events */}
      <div className="flex flex-col gap-2 p-4">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/25">Ahora</p>
        {current.major ? <EventBadge name={current.major} tier="major" live /> : <NoEventBadge />}
        {current.minor ? <EventBadge name={current.minor} tier="minor" live /> : null}
      </div>

      {/* Next events */}
      {hasNextEvent && (
        <div className="flex flex-col gap-2 border-t border-white/5 bg-black/10 p-4">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/20">Próximo</p>
          {next.major ? <EventBadge name={next.major} tier="major" /> : null}
          {next.minor ? <EventBadge name={next.minor} tier="minor" /> : null}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

// ─── Agenda section ───────────────────────────────────────────────────────────

function AgendaSection({
  agenda,
  data,
  utcHour,
  utcMin,
  onRemove,
}: {
  agenda: AgendaItem[]
  data: EventsData
  utcHour: number
  utcMin: number
  onRemove: (id: string) => void
}) {
  function minutesUntil(targetHour: number) {
    if (targetHour === utcHour) return 0
    const diff = targetHour > utcHour
      ? (targetHour - utcHour) * 60 - utcMin
      : (24 - utcHour + targetHour) * 60 - utcMin
    return diff
  }

  function countdownLabel(targetHour: number) {
    const mins = minutesUntil(targetHour)
    if (mins === 0) return 'Ahora'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h === 0) return `en ${m}m`
    if (m === 0) return `en ${h}h`
    return `en ${h}h ${m}m`
  }

  const sorted = [...agenda].sort((a, b) => minutesUntil(a.hour) - minutesUntil(b.hour))

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Mi Agenda</h2>
          <p className="text-xs text-white/30">Marca horas del horario para seguirlas aquí</p>
        </div>
        {agenda.length > 0 && (
          <button
            onClick={() => agenda.forEach(a => onRemove(a.id))}
            className="text-xs text-white/25 underline hover:text-white/50"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {agenda.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] py-10 text-center">
          <svg className="h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p className="text-sm text-white/25">Sin eventos en agenda</p>
          <p className="text-xs text-white/15">Pulsa <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">+</span> en el horario para añadir</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => {
            const slot = data.schedule.find(s => s.hour === item.hour)
            const events: EventSlot = slot?.[item.mapName] ?? { minor: null, major: null }
            const mc = MAP_COLORS[item.mapName] ?? { accent: 'text-white/50', border: 'border-white/10', bg: 'bg-white/5', dot: 'bg-white/40' }
            const isNow = item.hour === utcHour
            const label = countdownLabel(item.hour)

            return (
              <div key={item.id} className={`relative flex flex-col gap-3 rounded-2xl border p-4 ${mc.border} ${isNow ? mc.bg : 'bg-white/[0.02]'}`}>
                {/* Remove */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="absolute right-3 top-3 rounded-lg p-1 text-white/20 hover:bg-white/8 hover:text-white/60"
                  aria-label="Eliminar"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 pr-6">
                  <span className={`font-mono text-xl font-black tabular-nums ${mc.accent}`}>
                    {String(item.hour).padStart(2, '0')}:00
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${mc.accent}`}>{item.mapName}</span>
                    <span className={`text-[10px] font-semibold ${isNow ? 'text-emerald-400' : 'text-white/30'}`}>
                      {isNow
                        ? <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> En curso</span>
                        : label
                      }
                    </span>
                  </div>
                </div>

                {/* Events */}
                <div className="flex flex-col gap-1.5">
                  {events.major ? (
                    <span className={`inline-flex items-center gap-1.5 self-start rounded border px-2 py-1 text-xs font-semibold ${style(events.major).text} ${style(events.major).bg} ${style(events.major).border}`}>
                      <EventIcon name={events.major} className="h-3 w-3" />
                      {events.major}
                    </span>
                  ) : null}
                  {events.minor ? (
                    <span className={`inline-flex items-center gap-1.5 self-start rounded border px-2 py-1 text-xs font-semibold ${style(events.minor).text} ${style(events.minor).bg} ${style(events.minor).border}`}>
                      <EventIcon name={events.minor} className="h-3 w-3" />
                      {events.minor}
                    </span>
                  ) : null}
                  {!events.major && !events.minor && (
                    <span className="text-xs text-white/20">Sin eventos esta hora</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Schedule table ───────────────────────────────────────────────────────────

function ScheduleTable({
  data,
  utcHour,
  agenda,
  onToggle,
}: {
  data: EventsData
  utcHour: number
  agenda: AgendaItem[]
  onToggle: (mapName: string, hour: number) => void
}) {
  const [selectedMap, setSelectedMap] = useState(data.maps[0])
  const mc = MAP_COLORS[selectedMap] ?? { accent: 'text-white/50', border: 'border-white/10', bg: 'bg-white/5', dot: 'bg-white/40' }
  const rowRef = useRef<HTMLTableRowElement | null>(null)

  // Scroll current hour into view when map changes or on mount
  useEffect(() => {
    rowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedMap])

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-bold text-white">Horario completo — 24h UTC</h2>

      {/* Map tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {data.maps.map((m) => {
          const c = MAP_COLORS[m] ?? { accent: 'text-white/50', border: 'border-white/10', bg: 'bg-white/5' }
          const active = m === selectedMap
          return (
            <button
              key={m}
              onClick={() => setSelectedMap(m)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? `${c.bg} ${c.border} ${c.accent}`
                  : 'border-white/8 bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className={`overflow-hidden rounded-2xl border ${mc.border}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03]">
                <th className="w-16 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/25">
                  UTC
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/25">
                  Mayor
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/25">
                  Menor
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 24 }, (_, h) => {
                const slot = data.schedule.find(s => s.hour === h)
                const events: EventSlot = slot?.[selectedMap] ?? { minor: null, major: null }
                const confirmed = data.confirmedHours.includes(h)
                const isCurrent = h === utcHour
                const majorStyle = style(events.major)
                const minorStyle = style(events.minor)
                const isBookmarked = agenda.some(a => a.id === `${selectedMap}__${h}`)

                return (
                  <tr
                    key={h}
                    ref={isCurrent ? rowRef : null}
                    className={`border-b border-white/4 transition-colors last:border-0 ${
                      isCurrent
                        ? `${mc.bg} border-white/10`
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Hour */}
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono text-xs font-bold tabular-nums ${isCurrent ? mc.accent : 'text-white/40'}`}>
                          {String(h).padStart(2, '0')}h
                        </span>
                        {isCurrent && (
                          <span className={`h-1 w-1 rounded-full ${mc.dot} animate-pulse`} />
                        )}
                        {!confirmed && (
                          <span className="text-[9px] font-bold text-amber-400/60">?</span>
                        )}
                      </div>
                    </td>

                    {/* Major */}
                    <td className="px-3 py-1.5">
                      {events.major ? (
                        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-semibold ${majorStyle.text} ${majorStyle.bg} ${majorStyle.border}`}>
                          <EventIcon name={events.major} className="h-3 w-3" />
                          {events.major}
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/12">—</span>
                      )}
                    </td>

                    {/* Minor */}
                    <td className="px-3 py-1.5">
                      {events.minor ? (
                        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-semibold ${minorStyle.text} ${minorStyle.bg} ${minorStyle.border}`}>
                          <EventIcon name={events.minor} className="h-3 w-3" />
                          {events.minor}
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/12">—</span>
                      )}
                    </td>

                    {/* Bookmark */}
                    <td className="w-8 px-2 py-1.5">
                      <button
                        onClick={() => onToggle(selectedMap, h)}
                        title={isBookmarked ? 'Quitar de agenda' : 'Añadir a agenda'}
                        className={`rounded p-1 transition-colors ${
                          isBookmarked
                            ? `${mc.accent} opacity-100`
                            : 'text-white/15 hover:text-white/50'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EventosClient({ initialData }: { initialData: EventsData | null }) {
  const [data, setData] = useState<EventsData | null>(initialData)
  const [now, setNow] = useState(new Date())
  const [error, setError] = useState(false)
  const [agenda, setAgenda] = useState<AgendaItem[]>([])

  // Load agenda from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('proraider-agenda')
      if (saved) setAgenda(JSON.parse(saved))
    } catch {}
  }, [])

  // Persist agenda to localStorage
  useEffect(() => {
    try { localStorage.setItem('proraider-agenda', JSON.stringify(agenda)) } catch {}
  }, [agenda])

  const handleToggle = useCallback((mapName: string, hour: number) => {
    const id = `${mapName}__${hour}`
    setAgenda(prev =>
      prev.some(a => a.id === id)
        ? prev.filter(a => a.id !== id)
        : [...prev, { id, mapName, hour }]
    )
  }, [])

  const handleRemove = useCallback((id: string) => {
    setAgenda(prev => prev.filter(a => a.id !== id))
  }, [])

  // 1-second ticker
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Refresh schedule data every 30 min
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    if (!initialData) fetchData()
    const t = setInterval(fetchData, 30 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchData, initialData])

  const utcHour = now.getUTCHours()
  const utcMin  = now.getUTCMinutes()
  const utcSec  = now.getUTCSeconds()

  // Countdown to next hour
  const remMin = String(59 - utcMin).padStart(2, '0')
  const remSec = String(59 - utcSec).padStart(2, '0')
  const countdown = `${remMin}:${remSec}`

  const nextHour = (utcHour + 1) % 24

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Eventos en Vivo</h1>
          <p className="mt-1.5 text-sm text-white/35">
            Eventos activos ahora mismo en cada mapa · Actualización automática cada hora
          </p>
        </div>

        {/* UTC Clock */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div>
            <p className="font-mono text-2xl font-bold tabular-nums leading-none text-white">
              {String(utcHour).padStart(2, '0')}:{String(utcMin).padStart(2, '0')}:{String(utcSec).padStart(2, '0')}
            </p>
            <p className="mt-1 text-[11px] text-white/30">UTC · Cambio en <span className="font-semibold text-white/50">{countdown}</span></p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && !data && (
        <div className="flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          No se pudo cargar el horario de eventos. Inténtalo de nuevo más tarde.
        </div>
      )}

      {/* Loading skeleton */}
      {!data && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-white/6 bg-white/[0.02]" />
          ))}
        </div>
      )}

      {/* Map grid */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.maps.map((mapName, idx) => {
            const currentSlot = data.schedule.find(s => s.hour === utcHour)
            const nextSlot    = data.schedule.find(s => s.hour === nextHour)
            const confirmed   = data.confirmedHours.includes(utcHour)

            const current: EventSlot = currentSlot?.[mapName] ?? { minor: null, major: null }
            const next: EventSlot    = nextSlot?.[mapName]    ?? { minor: null, major: null }

            // At sm (2-col), the 5th card would be an orphan — span both columns to center it
            const isLast = idx === data.maps.length - 1
            const spanClass = isLast && data.maps.length % 2 !== 0 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto sm:w-full lg:col-span-1 lg:max-w-none lg:mx-0' : ''

            return (
              <div key={mapName} className={spanClass}>
                <MapCard
                  mapName={mapName}
                  current={current}
                  next={next}
                  countdown={countdown}
                  confirmed={confirmed}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      {data && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/6 pt-5 text-xs text-white/25 sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-white/40" />
            Evento activo ahora
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/20" />
            Próximo evento
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-amber-400/20 px-1 text-[9px] font-bold text-amber-400">?</span>
            Hora sin confirmar
          </div>
          <span className="ml-auto">
            Datos: <a href="https://arcraidershub.com/events" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">arcraidershub.com</a>
          </span>
        </div>
      )}

      {/* Full 24h schedule */}
      {data && (
        <ScheduleTable
          data={data}
          utcHour={utcHour}
          agenda={agenda}
          onToggle={handleToggle}
        />
      )}

      {/* Agenda */}
      {data && (
        <AgendaSection
          agenda={agenda}
          data={data}
          utcHour={utcHour}
          utcMin={utcMin}
          onRemove={handleRemove}
        />
      )}
    </div>
  )
}
