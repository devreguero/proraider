'use client'

import Image from 'next/image'
import { useState, useMemo, useEffect, useCallback } from 'react'

const PAGE_SIZE = 48

export type Item = {
  id: string
  name: string
  description: string
  item_type: string
  rarity: string
  icon: string
  value: number
  weight: number
  stackSize: number
  loot_area: string | null
  subcategory: string | null
  flavor_text: string | null
  // RaidTheory enriched data
  recyclesInto?: Record<string, number>
  salvagesInto?: Record<string, number>
  recipe?: Record<string, number>
  craftBench?: string | string[]
  stationLevelRequired?: number
  blueprintLocked?: boolean
  effects?: Record<string, { value: string | number }>
  vendors?: { trader: string; cost: Record<string, number>; limit?: number }[]
}

const RARITY_STYLES: Record<string, string> = {
  Common:    'border-white/20 text-white/60',
  Uncommon:  'border-green-500/40 text-green-400',
  Rare:      'border-blue-500/40 text-blue-400',
  Epic:      'border-purple-500/40 text-purple-400',
  Legendary: 'border-amber-500/40 text-amber-400',
}

const RARITY_DOT: Record<string, string> = {
  Common:    'bg-white/40',
  Uncommon:  'bg-green-400',
  Rare:      'bg-blue-400',
  Epic:      'bg-purple-400',
  Legendary: 'bg-amber-400',
}

const RARITY_GLOW: Record<string, string> = {
  Common:    '',
  Uncommon:  'shadow-[0_0_24px_rgba(74,222,128,0.12)]',
  Rare:      'shadow-[0_0_24px_rgba(96,165,250,0.12)]',
  Epic:      'shadow-[0_0_24px_rgba(192,132,252,0.12)]',
  Legendary: 'shadow-[0_0_24px_rgba(251,191,36,0.14)]',
}

const BENCH_NAMES: Record<string, string> = {
  in_raid: 'En Incursión',
  med_station: 'Estación Médica',
  utility_bench: 'Mesa de Utilidades',
  workbench: 'Banco de Trabajo',
  refiner: 'Refinería',
  gear_station: 'Estación de Equipo',
  electronics_bench: 'Banco Electrónico',
}

function formatId(id: string): string {
  return id
    .split('_')
    .map((w) => (w === 'arc' ? 'ARC' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

function formatBench(id: string): string {
  return BENCH_NAMES[id] ?? formatId(id)
}

// ─── Item Modal ────────────────────────────────────────────────────────────────

function ItemModal({ item, onClose }: { item: Item; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const benches = item.craftBench
    ? Array.isArray(item.craftBench) ? item.craftBench : [item.craftBench]
    : []

  const hasCraft = (item.recipe && Object.keys(item.recipe).length > 0)
  const hasRecycle = (item.recyclesInto && Object.keys(item.recyclesInto).length > 0)
  const hasEffects = (item.effects && Object.keys(item.effects).length > 0)
  const hasVendors = (item.vendors && item.vendors.length > 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a] ${RARITY_GLOW[item.rarity] ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 p-6 pb-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image src={item.icon} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${RARITY_STYLES[item.rarity] ?? RARITY_STYLES.Common}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[item.rarity] ?? RARITY_DOT.Common}`} />
                {item.rarity}
              </span>
              {item.blueprintLocked && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Blueprint
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-bold leading-tight text-white">{item.name}</h2>
            <p className="text-sm text-white/40">{item.item_type}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mx-6 mb-4 grid grid-cols-3 gap-2">
          {item.value > 0 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center">
              <p className="text-[10px] text-white/35">Valor</p>
              <p className="text-sm font-semibold text-white">{item.value.toLocaleString()} ₢</p>
            </div>
          )}
          {item.weight > 0 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center">
              <p className="text-[10px] text-white/35">Peso</p>
              <p className="text-sm font-semibold text-white">{item.weight} kg</p>
            </div>
          )}
          {item.stackSize > 1 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center">
              <p className="text-[10px] text-white/35">Stack</p>
              <p className="text-sm font-semibold text-white">×{item.stackSize}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div className="mx-6 mb-4">
            <p className="text-sm text-white/55 leading-relaxed">{item.description}</p>
            {item.flavor_text && item.flavor_text !== item.description && (
              <p className="mt-2 border-l-2 border-white/15 pl-3 text-xs italic text-white/30">{item.flavor_text}</p>
            )}
          </div>
        )}

        {/* Effects */}
        {hasEffects && (
          <Section title="Efectos">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.effects!).map(([key, { value }]) => (
                <div key={key} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                  <p className="text-[10px] text-white/35">{key}</p>
                  <p className="text-sm font-semibold text-white">{String(value)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Crafting */}
        {hasCraft && (
          <Section title="Fabricación">
            {benches.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {benches.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/8 px-3 py-1 text-xs font-medium text-[var(--app-accent)]">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    {formatBench(b)}
                  </span>
                ))}
                {item.stationLevelRequired && item.stationLevelRequired > 0 && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/50">
                    Nivel {item.stationLevelRequired}
                  </span>
                )}
              </div>
            )}
            <div className="space-y-1.5">
              {Object.entries(item.recipe!).map(([id, qty]) => (
                <MaterialRow key={id} id={id} qty={qty} />
              ))}
            </div>
          </Section>
        )}

        {/* Recycling */}
        {hasRecycle && (
          <Section title="Reciclaje">
            <div className="space-y-1.5">
              {Object.entries(item.recyclesInto!).map(([id, qty]) => (
                <MaterialRow key={id} id={id} qty={qty} color="text-green-400" />
              ))}
            </div>
          </Section>
        )}

        {/* Vendors */}
        {hasVendors && (
          <Section title="Vendedores">
            <div className="space-y-2">
              {item.vendors!.map((v, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                  <span className="text-sm font-semibold text-white">{v.trader}</span>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    {Object.entries(v.cost).map(([currency, amount]) => (
                      <span key={currency} className="font-semibold text-white">
                        {Number(amount).toLocaleString()} {currency === 'coins' ? '₢' : currency}
                      </span>
                    ))}
                    {v.limit && <span className="text-xs text-white/30">Límite: {v.limit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-6 mb-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/25">{title}</h3>
      {children}
    </div>
  )
}

function MaterialRow({ id, qty, color = 'text-white/70' }: { id: string; qty: number; color?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
      <span className={`text-sm ${color}`}>{formatId(id)}</span>
      <span className="text-sm font-semibold text-white">×{qty}</span>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ItemsClient({ items, types }: { items: Item[]; types: string[] }) {
  const [search, setSearch] = useState('')
  const [rarity, setRarity] = useState('Todos')
  const [type, setType] = useState('Todos')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const rarities = ['Todos', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchRarity = rarity === 'Todos' || item.rarity === rarity
      const matchType = type === 'Todos' || item.item_type === type
      return matchSearch && matchRarity && matchType
    })
  }, [items, search, rarity, type])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, rarity, type])

  const handleClose = useCallback(() => setSelectedItem(null), [])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Items</h1>
        <p className="mt-1 text-sm text-white/50">{items.length} items en total · {filtered.length} encontrados</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Buscar item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[var(--app-accent)]/50 focus:ring-1 focus:ring-[var(--app-accent)]/30 sm:max-w-xs"
        />

        <div className="flex flex-wrap gap-2">
          {rarities.map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                rarity === r
                  ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/15 text-[var(--app-accent)]'
                  : 'border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white/70 outline-none focus:border-[var(--app-accent)]/50"
        >
          <option value="Todos">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-20 text-center text-white/40">Sin resultados para &ldquo;{search}&rdquo;</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {paginated.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="loot-card group flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-left transition duration-200 hover:border-[var(--app-accent)]/30 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(79,195,255,0.08)] cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative mx-auto mb-3 h-16 w-16">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className="object-contain drop-shadow-lg transition duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(79,195,255,0.4)]"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col">
                <p className="text-xs font-semibold leading-tight text-white line-clamp-2">
                  {item.name}
                </p>
                <p className="mt-1 text-[10px] text-white/40">{item.item_type}</p>

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${RARITY_STYLES[item.rarity] ?? RARITY_STYLES.Common}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[item.rarity] ?? RARITY_DOT.Common}`} />
                    {item.rarity}
                  </span>
                  {item.value > 0 && (
                    <span className="text-[10px] text-white/35">{item.value.toLocaleString()} ₢</span>
                  )}
                </div>

                {/* Recycle/Craft hint */}
                <div className="mt-2 flex gap-2">
                  {item.recyclesInto && Object.keys(item.recyclesInto).length > 0 && (
                    <span className="text-[10px] text-white/30">♻ Reciclable</span>
                  )}
                  {item.recipe && Object.keys(item.recipe).length > 0 && (
                    <span className="text-[10px] text-white/30">⚒ Crafteable</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-white/30">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`h-9 min-w-[2.25rem] rounded-xl border px-3 text-sm font-semibold transition ${
                    page === p
                      ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/15 text-[var(--app-accent)]'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && <ItemModal item={selectedItem} onClose={handleClose} />}
    </div>
  )
}
