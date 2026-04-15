'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export type WeaponGroup = {
  slug: string
  name: string
  icon: string
  ammo_type: string | null
  subcategory: string | null
  levelsCount: number
}

const WEAPON_CATEGORIES = ['Todos', 'Assault Rifle', 'Battle Rifle', 'SMG', 'Shotgun', 'Sniper Rifle', 'LMG', 'Hand Cannon', 'Special']

export default function WeaponsClient({ weapons }: { weapons: WeaponGroup[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  const filtered = useMemo(() => {
    return weapons.filter((w) => {
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Todos' || (w.subcategory ?? '').toLowerCase().includes(category.toLowerCase())
      return matchSearch && matchCat
    })
  }, [weapons, search, category])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Armas</h1>
        <p className="mt-1 text-sm text-white/50">{weapons.length} armas · {filtered.length} mostradas</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Buscar arma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[var(--app-accent)]/50 focus:ring-1 focus:ring-[var(--app-accent)]/30 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {WEAPON_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                category === c
                  ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/15 text-[var(--app-accent)]'
                  : 'border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map((w) => (
          <Link
            key={w.slug}
            href={`/armas/${w.slug}`}
            className="loot-card group flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center transition duration-200 hover:border-[var(--app-accent)]/30 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(79,195,255,0.08)]"
          >
            <div className="relative h-16 w-16">
              <Image
                src={w.icon}
                alt={w.name}
                fill
                className="object-contain drop-shadow-lg transition duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(79,195,255,0.4)]"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{w.name}</p>
              {w.subcategory && (
                <p className="mt-0.5 text-[11px] text-white/40">{w.subcategory}</p>
              )}
              <p className="mt-1 text-[11px] text-white/30">{w.levelsCount} nivel{w.levelsCount !== 1 ? 'es' : ''}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-20 text-center text-white/40">Sin resultados para &ldquo;{search}&rdquo;</p>
      )}
    </div>
  )
}
