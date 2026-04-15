'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { MapDef } from '@/lib/mapsData'
import { SPAWN_DATA } from '@/lib/spawnData'

const MapViewer = dynamic(() => import('./MapViewer'), { ssr: false })

export type LayerKey = 'playerSpawn' | 'containers' | 'keys' | 'arcSpawns' | 'extractions' | 'poi'

type LayerDef = {
  key: LayerKey
  label: string
  color: string
  available: boolean
}

export default function MapLayout({ map }: { map: MapDef }) {
  const hasSpawns = (SPAWN_DATA[map.id]?.length ?? 0) > 0

  const layers: LayerDef[] = [
    { key: 'playerSpawn', label: 'Spawns de jugadores', color: '#ffffff', available: hasSpawns },
    { key: 'extractions', label: 'Extracciones',        color: '#4ade80', available: false },
    { key: 'containers',  label: 'Contenedores',        color: '#fb923c', available: false },
    { key: 'keys',        label: 'Llaves y accesos',    color: '#facc15', available: false },
    { key: 'arcSpawns',   label: 'Spawns ARC',          color: '#f87171', available: false },
    { key: 'poi',         label: 'Puntos de interés',   color: '#a78bfa', available: false },
  ]

  const [active, setActive] = useState<Set<LayerKey>>(
    () => new Set(layers.filter((l) => l.available).map((l) => l.key))
  )

  const toggle = (key: LayerKey) =>
    setActive((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="flex h-full w-full overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/8 bg-[#141414]">

        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-4 py-4">
          <Link
            href="/mapas"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Mapa</p>
            <h1 className="truncate text-sm font-bold text-white">{map.name}</h1>
          </div>
        </div>

        {/* Layers */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Capas
          </p>

          <div className="space-y-1">
            {layers.map(({ key, label, color, available }) => {
              const on = active.has(key)
              return (
                <button
                  key={key}
                  onClick={() => available && toggle(key)}
                  disabled={!available}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition ${
                    !available
                      ? 'cursor-default opacity-35'
                      : on
                        ? 'bg-white/[0.06] text-white'
                        : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
                  }`}
                >
                  {/* Color dot / icon */}
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: available ? color : '#555', opacity: on || !available ? 1 : 0.4 }}
                  />

                  <span className="flex-1 font-medium">{label}</span>

                  {available ? (
                    /* Toggle */
                    <div
                      className="relative h-4 w-7 shrink-0 rounded-full transition-colors"
                      style={{ background: on ? color : 'rgba(255,255,255,0.12)' }}
                    >
                      <span
                        className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform"
                        style={{ transform: on ? 'translateX(13px)' : 'translateX(2px)' }}
                      />
                    </div>
                  ) : (
                    <span className="shrink-0 text-[10px] text-white/20">Pronto</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/8 px-4 py-3">
          <p className="text-center text-[10px] text-white/20">
            Scroll para zoom · Arrastra para mover
          </p>
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="relative min-w-0 flex-1">
        {map.tileId ? (
          <MapViewer map={map} activeLayers={active} />
        ) : (
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={map.heroImage} alt={map.name} className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-base font-bold text-white/50">Mapa interactivo en desarrollo</p>
                <p className="mt-1 text-sm text-white/25">Disponible próximamente</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
