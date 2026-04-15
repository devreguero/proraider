'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { LootSection } from '@/lib/lootGuideData'
import type { Item } from '@/app/items/ItemsClient'

type ItemMeta = Pick<Item, 'icon' | 'rarity' | 'item_type'>

const RARITY_DOT: Record<string, string> = {
  Common:    'bg-white/40',
  Uncommon:  'bg-green-400',
  Rare:      'bg-blue-400',
  Epic:      'bg-purple-400',
  Legendary: 'bg-amber-400',
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  recycle: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
  station: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.65-4.65l-.088-.09a2.25 2.25 0 00-3.182 0l-.09.088" />
    </svg>
  ),
  quests: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
  keep: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
}

function ItemRow({
  name,
  tip,
  tags,
  meta,
  accentColor,
}: {
  name: string
  tip: string
  tags?: string[]
  meta: ItemMeta | undefined
  accentColor: string
}) {
  const rarity = meta?.rarity ?? 'Common'
  const dot = RARITY_DOT[rarity] ?? RARITY_DOT.Common

  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-white/6 bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
      {/* Top row: icon + name/rarity */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-white/5">
          {meta?.icon ? (
            <Image src={meta.icon} alt={name} fill className="object-contain p-1" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/15">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4"/>
              </svg>
            </div>
          )}
        </div>

        {/* Name + rarity */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-white/90">{name}</p>
          {meta && (
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-white/30">
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {rarity}
              {meta.item_type && <span className="text-white/20">· {meta.item_type}</span>}
            </span>
          )}
        </div>
      </div>

      {/* Tip — grows to fill remaining space so cards stay equal-height */}
      <p className="flex-1 text-xs leading-relaxed text-white/40">{tip}</p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/45"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LootGuideClient({
  sections,
  itemMap,
}: {
  sections: LootSection[]
  itemMap: Map<string, ItemMeta>
}) {
  const [active, setActive] = useState<string>(sections[0].id)
  const section = sections.find((s) => s.id === active)!

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Guía de Loot</h1>
        <p className="mt-1.5 text-sm text-white/35">
          Qué reciclar, qué vender y qué guardar para no perder recursos valiosos entre raids.
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              active === s.id
                ? `${s.borderClass} ${s.bgClass} ${s.textClass}`
                : 'border-white/8 bg-white/3 text-white/35 hover:border-white/15 hover:text-white/60'
            }`}
          >
            <span className={active === s.id ? s.textClass : 'text-white/25'}>
              {SECTION_ICONS[s.id]}
            </span>
            {s.title}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${active === s.id ? 'bg-white/10' : 'bg-white/5'}`}>
              {s.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Active section */}
      <div key={active}>
        {/* Section header */}
        <div className={`mb-6 flex items-start gap-4 rounded-2xl border p-5 ${section.borderClass} ${section.bgClass}`}>
          <div className={`mt-0.5 shrink-0 ${section.textClass}`}>{SECTION_ICONS[section.id]}</div>
          <div className="min-w-0 flex-1">
            <h2 className={`text-base font-bold ${section.textClass}`}>{section.title}</h2>
            <p className="mt-0.5 text-sm text-white/40">{section.subtitle}</p>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <p className="text-xs leading-relaxed text-white/35">{section.tip}</p>
            </div>
          </div>
        </div>

        {/* Items grid — items-stretch so all cards reach the same height */}
        <div className="grid items-stretch gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item, i) => (
            <div
              key={item.name}
              className="card-stagger"
              style={{ '--stagger': i } as React.CSSProperties}
            >
              <ItemRow
                name={item.name}
                tip={item.tip}
                tags={item.tags}
                meta={itemMap.get(item.name)}
                accentColor={section.color}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
