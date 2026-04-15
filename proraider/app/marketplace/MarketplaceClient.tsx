'use client'

import Image from 'next/image'
import { useState, useActionState, useEffect, useTransition, useRef, useCallback } from 'react'
import type { MarketListing } from '@/lib/db'
import type { SessionPayload } from '@/lib/session'
import type { Item } from '@/app/items/ItemsClient'
import { createMarketListing, deleteMarketListing, type MarketFormState } from '@/app/actions/marketplace'
import { useRouter } from 'next/navigation'

/* ── types ──────────────────────────────────────────────────────────────────── */

type ItemSlim = Pick<Item, 'id' | 'name' | 'rarity' | 'icon' | 'item_type'>

/* ── rarity styles ──────────────────────────────────────────────────────────── */

const RARITY_STYLES: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  Common:    { text: 'text-white/50',   border: 'border-white/15',     bg: 'bg-white/5',      dot: 'bg-white/40'  },
  Uncommon:  { text: 'text-green-400',  border: 'border-green-400/30', bg: 'bg-green-400/8',  dot: 'bg-green-400' },
  Rare:      { text: 'text-blue-400',   border: 'border-blue-400/30',  bg: 'bg-blue-400/8',   dot: 'bg-blue-400'  },
  Epic:      { text: 'text-purple-400', border: 'border-purple-400/30',bg: 'bg-purple-400/8', dot: 'bg-purple-400'},
  Legendary: { text: 'text-amber-400',  border: 'border-amber-400/30', bg: 'bg-amber-400/8',  dot: 'bg-amber-400' },
}

function rs(rarity: string) {
  return RARITY_STYLES[rarity] ?? RARITY_STYLES.Common
}

/* ── helpers ────────────────────────────────────────────────────────────────── */

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'ahora'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

/* ── ItemPicker ─────────────────────────────────────────────────────────────── */

function ItemPicker({
  nameField,
  rarityField,
  quantityField,
  label,
  items,
  nameError,
  quantityError,
}: {
  nameField: string
  rarityField: string
  quantityField: string
  label: string
  items: ItemSlim[]
  nameError?: string
  quantityError?: string
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ItemSlim | null>(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.length >= 1
    ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(item: ItemSlim) {
    setSelected(item)
    setQuery(item.name)
    setOpen(false)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    setOpen(false)
  }

  const style = selected ? rs(selected.rarity) : null

  return (
    <div className="flex-1 min-w-0">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/30">
        {label}
      </label>

      {/* Hidden form inputs */}
      <input type="hidden" name={nameField}   value={selected?.name   ?? ''} />
      <input type="hidden" name={rarityField} value={selected?.rarity ?? 'Common'} />

      {/* Search field */}
      <div ref={containerRef} className="relative">
        <div className={`flex items-center gap-2 rounded-xl border bg-white/5 px-3 py-2.5 transition ${
          open ? 'border-[var(--app-accent)]/40' : nameError ? 'border-red-400/40' : 'border-white/10'
        }`}>
          {selected ? (
            <div className="relative h-6 w-6 shrink-0">
              <Image src={selected.icon} alt={selected.name} fill className="object-contain" unoptimized />
            </div>
          ) : (
            <svg className="h-4 w-4 shrink-0 text-white/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); setOpen(true) }}
            onFocus={() => { if (query.length >= 1) setOpen(true) }}
            placeholder="Buscar item…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
          />

          {selected && style && (
            <span className={`hidden shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-flex ${style.text} ${style.border} ${style.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {selected.rarity}
            </span>
          )}

          {(selected || query) && (
            <button type="button" onClick={clear} className="shrink-0 text-white/25 transition hover:text-white/60">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c] shadow-2xl">
            {results.map((item) => {
              const s = rs(item.rarity)
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); select(item) }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/5"
                >
                  <div className="relative h-8 w-8 shrink-0">
                    <Image src={item.icon} alt={item.name} fill className="object-contain" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/30">{item.item_type}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.text} ${s.border} ${s.bg}`}>
                    {item.rarity}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {open && query.length >= 1 && results.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white/30">
            Sin resultados para &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}

      {/* Quantity */}
      <div className="mt-2">
        <input
          name={quantityField}
          type="number"
          defaultValue={1}
          min={1}
          max={9999}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white outline-none transition focus:border-[var(--app-accent)]/40"
          placeholder="Cantidad"
        />
        {quantityError && <p className="mt-1 text-xs text-red-400">{quantityError}</p>}
      </div>
    </div>
  )
}

/* ── ItemSide (card display) ────────────────────────────────────────────────── */

function ItemSide({
  name,
  rarity,
  quantity,
  items,
  role,
}: {
  name: string
  rarity: string
  quantity: number
  items: ItemSlim[]
  role: 'offer' | 'want'
}) {
  const style = rs(rarity)
  const item = items.find((i) => i.name === name)

  const roleLabel  = role === 'offer' ? 'Ofrezco'   : 'Busco'
  const roleColor  = role === 'offer' ? 'text-emerald-400' : 'text-sky-400'
  const roleBorder = role === 'offer' ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-sky-400/20 bg-sky-400/5'

  return (
    <div className={`flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border p-3 text-center ${roleBorder}`}>
      {/* Role label */}
      <span className={`text-[9px] font-black uppercase tracking-widest ${roleColor}`}>{roleLabel}</span>

      {/* Icon */}
      {item ? (
        <div className="relative h-11 w-11">
          <Image src={item.icon} alt={name} fill className="object-contain drop-shadow-lg" unoptimized />
        </div>
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/5">
          <svg className="h-5 w-5 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4"/>
          </svg>
        </div>
      )}

      {/* Name + rarity + qty */}
      <div className="min-w-0 w-full">
        <p className="truncate text-xs font-bold leading-snug text-white">{name}</p>
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
          <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${style.text} ${style.border} ${style.bg}`}>
            <span className={`h-1 w-1 rounded-full ${style.dot}`} />
            {rarity}
          </span>
          {quantity > 1 && (
            <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-bold text-white/40">
              ×{quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── ListingCard ────────────────────────────────────────────────────────────── */

function ListingCard({
  listing,
  isOwner,
  items,
  onDelete,
}: {
  listing: MarketListing
  isOwner: boolean
  items: ItemSlim[]
  onDelete: (id: number) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const offerStyle = rs(listing.offer_item_rarity)

  async function handleDelete() {
    setDeleting(true)
    const res = await deleteMarketListing(listing.id)
    if (res.error) { setDeleting(false); setConfirming(false) }
    else onDelete(listing.id)
  }

  return (
    <div className={`group/card relative flex h-full flex-col rounded-2xl border bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05] ${offerStyle.border}`}>

      {/* Trade display */}
      <div className="mb-4 flex items-stretch gap-2">
        <ItemSide
          name={listing.offer_item_name}
          rarity={listing.offer_item_rarity}
          quantity={listing.offer_quantity}
          items={items}
          role="offer"
        />

        {/* Arrow */}
        <div className="shrink-0 flex items-center">
          <svg className="h-4 w-4 text-white/15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
          </svg>
        </div>

        <ItemSide
          name={listing.want_item_name}
          rarity={listing.want_item_rarity}
          quantity={listing.want_quantity}
          items={items}
          role="want"
        />
      </div>

      {/* Note */}
      {listing.note && (
        <p className="mb-3 text-xs leading-relaxed text-white/35 italic">{listing.note}</p>
      )}

      {/* Footer */}
      <div className="mt-auto border-t border-white/6 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-[9px] font-bold text-white/50 uppercase">
            {listing.username[0]}
          </div>
          <span className="flex-1 truncate text-[11px] font-semibold text-white/35">{listing.username}</span>
          <span className="shrink-0 text-[10px] text-white/20">{timeAgo(listing.created_at)}</span>
        </div>
        {!isOwner && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { detail: { userId: listing.user_id, username: listing.username } }))}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--app-accent)]/20 bg-[var(--app-accent)]/5 py-1.5 text-[11px] font-semibold text-[var(--app-accent)]/70 transition hover:bg-[var(--app-accent)]/12 hover:text-[var(--app-accent)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
            </svg>
            Contactar
          </button>
        )}
      </div>

      {/* Delete (owner) */}
      {isOwner && (
        <>
          {/* Confirming overlay — centered on card */}
          {confirming && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-red-400/25 bg-[#1a0a0a] px-6 py-4 shadow-xl">
                <span className="text-sm font-semibold text-red-300">¿Eliminar este anuncio?</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-500/80 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
                  >
                    {deleting ? '…' : 'Sí, eliminar'}
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    disabled={deleting}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/50 transition hover:text-white/80"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trigger button — visible on card hover */}
          {!confirming && (
            <button
              onClick={() => setConfirming(true)}
              className="absolute right-3 top-3 hidden rounded-lg border border-red-400/20 bg-red-400/8 px-2 py-1 text-[10px] font-bold text-red-400/70 transition hover:bg-red-400/15 hover:text-red-400 group-hover/card:flex"
            >
              Eliminar
            </button>
          )}
        </>
      )}
    </div>
  )
}

/* ── PostForm ───────────────────────────────────────────────────────────────── */

const INITIAL_STATE: MarketFormState = {}

function PostForm({ items, onSuccess }: { items: ItemSlim[]; onSuccess: () => void }) {
  const [state, action, pending] = useActionState(createMarketListing, INITIAL_STATE)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success, onSuccess])

  return (
    <form action={action} className="space-y-5">
      {state.errors?.general && (
        <p className="rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-2.5 text-sm text-red-300">
          {state.errors.general[0]}
        </p>
      )}

      {/* Two pickers side by side */}
      <div className="flex items-start gap-4">
        <ItemPicker
          label="Ofrezco"
          nameField="offer_item_name"
          rarityField="offer_item_rarity"
          quantityField="offer_quantity"
          items={items}
          nameError={state.errors?.offer_item_name?.[0]}
          quantityError={state.errors?.offer_quantity?.[0]}
        />

        {/* Divider arrow */}
        <div className="mt-8 shrink-0 flex flex-col items-center gap-1 text-white/20">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
          </svg>
        </div>

        <ItemPicker
          label="A cambio de"
          nameField="want_item_name"
          rarityField="want_item_rarity"
          quantityField="want_quantity"
          items={items}
          nameError={state.errors?.want_item_name?.[0]}
          quantityError={state.errors?.want_quantity?.[0]}
        />
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/30">
          Nota <span className="normal-case font-normal text-white/20">(opcional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          maxLength={200}
          placeholder="Condiciones extra, urgencia, etc."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[var(--app-accent)]/40 focus:bg-white/8"
        />
      </div>

      {/* Contact */}
      <div>
        <label htmlFor="contact" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/30">
          Contacto
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          placeholder="Discord: usuario#0000"
          maxLength={100}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[var(--app-accent)]/40 focus:bg-white/8"
        />
        {state.errors?.contact && (
          <p className="mt-1 text-xs text-red-400">{state.errors.contact[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/10 py-3 text-sm font-bold text-[var(--app-accent)] transition hover:bg-[var(--app-accent)]/18 disabled:opacity-40"
      >
        {pending ? 'Publicando…' : 'Publicar intercambio'}
      </button>
    </form>
  )
}

/* ── main ───────────────────────────────────────────────────────────────────── */

export default function MarketplaceClient({
  initialListings,
  session,
  items,
}: {
  initialListings: MarketListing[]
  session: SessionPayload | null
  items: ItemSlim[]
}) {
  const router = useRouter()
  const [listings, setListings] = useState(initialListings)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Sync local state when server data updates after router.refresh()
  useEffect(() => {
    setListings(initialListings)
  }, [initialListings])

  function handleDelete(id: number) {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  function handleRefresh() {
    setRefreshing(true)
    startTransition(() => {
      router.refresh()
    })
  }

  useEffect(() => {
    if (!isPending) setRefreshing(false)
  }, [isPending])

  const handlePostSuccess = useCallback(() => {
    setShowForm(false)
    startTransition(() => router.refresh())
  }, [router])

  const filtered = listings.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return l.offer_item_name.toLowerCase().includes(q) || l.want_item_name.toLowerCase().includes(q)
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Marketplace</h1>
          <p className="mt-1.5 text-sm text-white/35">
            Intercambia items con otros jugadores de ARC Raiders.
          </p>
        </div>
        {session ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/10 px-5 py-2.5 text-sm font-bold text-[var(--app-accent)] transition hover:bg-[var(--app-accent)]/18"
          >
            {showForm ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancelar
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Publicar intercambio
              </>
            )}
          </button>
        ) : (
          <a
            href="/login"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/50 transition hover:border-white/20 hover:text-white/80"
          >
            Inicia sesión para publicar
          </a>
        )}
      </div>

      {/* Post form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-[var(--app-accent)]/15 bg-[var(--app-accent)]/3 p-6">
          <h2 className="mb-5 text-base font-bold text-white">Nuevo intercambio</h2>
          <PostForm items={items} onSuccess={handlePostSuccess} />
        </div>
      )}

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por item ofrecido o buscado…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-[var(--app-accent)]/40"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Recargar anuncios"
          className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/40 transition hover:border-white/20 hover:bg-white/10 hover:text-white/80 disabled:opacity-40"
        >
          <svg
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </button>
        <span className="text-sm text-white/25">{filtered.length} anuncio{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] py-20 text-center">
          <svg className="h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
          </svg>
          <p className="text-sm text-white/25">
            {search ? 'No hay intercambios que coincidan.' : 'No hay intercambios todavía. ¡Sé el primero en publicar!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((listing, i) => (
            <div
              key={listing.id}
              className="card-stagger h-full"
              style={{ '--stagger': i } as React.CSSProperties}
            >
              <ListingCard
                listing={listing}
                isOwner={session?.userId === listing.user_id}
                items={items}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-white/15">
        ProRaider no se responsabiliza de las transacciones entre jugadores. Verifica siempre la identidad antes de intercambiar.
      </p>
    </div>
  )
}
