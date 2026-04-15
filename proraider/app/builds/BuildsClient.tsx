'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BUILDS, encodeBuildParam, type Build } from '@/lib/buildsData'
import { SKILLS, BRANCH_CONFIG, getTotalPoints, getBranchPoints } from '@/lib/skillTreeData'

const TOTAL = 76

function branchPts(build: Build, branch: 'mobility' | 'conditioning' | 'survival') {
  return getBranchPoints(build.allocation, branch)
}

function BranchBar({
  branch,
  pts,
}: {
  branch: 'mobility' | 'conditioning' | 'survival'
  pts: number
}) {
  const cfg = BRANCH_CONFIG[branch]
  const pct = Math.round((pts / TOTAL) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className={`w-36 shrink-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider ${cfg.textClass}`}>
        {cfg.label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full ${cfg.fillClass} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-[11px] font-bold text-white/40">{pts}</span>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: 'twitch' | 'youtube' | 'both' }) {
  if (platform === 'twitch') {
    return (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    )
  }
  if (platform === 'youtube') {
    return (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  )
}

function BuildCard({ build }: { build: Build }) {
  const cfg = BRANCH_CONFIG[build.primaryBranch]
  const mobPts  = branchPts(build, 'mobility')
  const conPts  = branchPts(build, 'conditioning')
  const surPts  = branchPts(build, 'survival')
  const total   = getTotalPoints(build.allocation)
  const encoded = encodeBuildParam(build.allocation)

  return (
    <div className={`group flex h-full flex-col rounded-2xl border bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05] ${cfg.borderClass}`}>

      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {build.category === 'meta' ? (
            <span className={`mb-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`}>
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
              </svg>
              Meta
            </span>
          ) : (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-violet-300">
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              Creador
            </span>
          )}
          <h3 className="text-base font-bold text-white">{build.name}</h3>
          <p className={`text-[11px] font-semibold ${cfg.textClass}`}>{build.subtitle}</p>
        </div>

        {/* Points bubble */}
        <div className={`shrink-0 rounded-xl border px-3 py-1.5 text-center ${cfg.borderClass} ${cfg.bgClass}`}>
          <span className={`text-lg font-black ${cfg.textClass}`}>{total}</span>
          <span className="block text-[9px] font-semibold text-white/30">pts</span>
        </div>
      </div>

      {/* Creator info */}
      {build.creator && (
        <div className="mb-3 flex items-center gap-1.5 text-violet-300/70">
          <PlatformIcon platform={build.creator.platform} />
          <span className="text-[11px] font-semibold">{build.creator.name}</span>
          {build.note && (
            <span className="ml-auto text-[9px] text-white/20 italic">{build.note}</span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="mb-4 text-xs leading-relaxed text-white/45">{build.description}</p>

      {/* Branch bars */}
      <div className="mb-4 space-y-2">
        <BranchBar branch="mobility"     pts={mobPts} />
        <BranchBar branch="conditioning" pts={conPts} />
        <BranchBar branch="survival"     pts={surPts} />
      </div>

      {/* Playstyle tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {build.playstyle.map((tag) => (
          <span key={tag}
            className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40">
            {tag}
          </span>
        ))}
      </div>

      {/* Key skills */}
      <div className="mb-5">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/20">Skills clave</p>
        <ul className="space-y-1">
          {build.keySkills.map((id) => {
            const sk = SKILLS.find((s) => s.id === id)
            if (!sk) return null
            const bCfg = BRANCH_CONFIG[sk.branch]
            return (
              <li key={id} className="flex items-center gap-1.5 text-[11px]">
                <span className={`h-1 w-1 shrink-0 rounded-full ${bCfg.fillClass}`} />
                <span className="font-semibold text-white/60">{sk.name}</span>
                {sk.tier === 'capstone' && (
                  <span className={`ml-auto text-[9px] font-bold ${bCfg.textClass} opacity-60`}>CAPSTONE</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <Link
          href={`/skill-tree?build=${encoded}`}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass} hover:opacity-80`}
        >
          Cargar en el Constructor
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function BuildsClient() {
  const [tab, setTab] = useState<'meta' | 'creator'>('meta')

  const metaBuilds    = BUILDS.filter((b) => b.category === 'meta')
  const creatorBuilds = BUILDS.filter((b) => b.category === 'creator')
  const shown         = tab === 'meta' ? metaBuilds : creatorBuilds

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Builds Recomendadas</h1>
        <p className="mt-1.5 text-sm text-white/35">
          Builds del meta actual y las configuraciones de los mejores creadores de contenido de ARC Raiders.
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setTab('meta')}
          className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors ${
            tab === 'meta'
              ? 'border-[var(--app-accent)]/30 bg-[var(--app-accent)]/10 text-[var(--app-accent)]'
              : 'border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/60'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
          </svg>
          Meta Actual
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
            tab === 'meta' ? 'bg-[var(--app-accent)]/20' : 'bg-white/8'
          }`}>
            {metaBuilds.length}
          </span>
        </button>

        <button
          onClick={() => setTab('creator')}
          className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors ${
            tab === 'creator'
              ? 'border-violet-400/30 bg-violet-400/10 text-violet-300'
              : 'border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/60'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
          Builds de Creadores
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
            tab === 'creator' ? 'bg-violet-400/20' : 'bg-white/8'
          }`}>
            {creatorBuilds.length}
          </span>
        </button>
      </div>

      {/* Creator disclaimer */}
      {tab === 'creator' && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-violet-400/15 bg-violet-400/5 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-violet-400/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
          </svg>
          <p className="text-xs leading-relaxed text-white/35">
            Las builds de creadores son aproximaciones basadas en su estilo de juego observado en stream. Pueden no reflejar su configuración exacta.
          </p>
        </div>
      )}

      {/* Cards grid — key={tab} remounts on tab switch, retriggering stagger */}
      <div key={tab} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((build, i) => (
          <div
            key={build.id}
            className="card-stagger h-full"
            style={{ '--stagger': i } as React.CSSProperties}
          >
            <BuildCard build={build} />
          </div>
        ))}
      </div>
    </div>
  )
}
