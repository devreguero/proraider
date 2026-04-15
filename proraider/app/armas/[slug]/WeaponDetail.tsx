'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getBuildForWeapon, SLOT_COLORS } from '@/lib/attachmentsData'

type StatBlock = {
  damage?: number
  fireRate?: number
  range?: number
  magazineSize?: number
  stability?: number
  weight?: number
  agility?: number
  stealth?: number
  firingMode?: string
  ammo?: string
  increasedFireRate?: number
  reducedDispersionRecoveryTime?: number
  reducedVerticalRecoil?: number
  reducedPerShotDispersion?: number
  reducedMaxShotDispersion?: number
  reducedReloadTime?: number
  increasedBulletVelocity?: number
  increasedADSSpeed?: number
  reducedRecoilRecoveryTime?: number
  reducedDurabilityBurnRate?: number
  [key: string]: number | string | null | undefined
}

export type Weapon = {
  id: string
  name: string
  icon: string
  rarity: string
  value: number
  ammo_type: string | null
  subcategory: string | null
  description: string | null
  flavor_text: string | null
  stat_block: StatBlock
}

const RARITY_COLOR: Record<string, string> = {
  Common:    'text-white/60 border-white/20 bg-white/5',
  Uncommon:  'text-green-400 border-green-500/30 bg-green-500/10',
  Rare:      'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Epic:      'text-purple-400 border-purple-500/30 bg-purple-500/10',
  Legendary: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
}

const BASE_STATS: { key: string; label: string; unit?: string }[] = [
  { key: 'damage',      label: 'Daño' },
  { key: 'fireRate',    label: 'Cadencia' },
  { key: 'range',       label: 'Alcance' },
  { key: 'magazineSize',label: 'Cargador' },
  { key: 'stability',   label: 'Estabilidad' },
  { key: 'weight',      label: 'Peso' },
  { key: 'agility',     label: 'Agilidad' },
  { key: 'stealth',     label: 'Sigilo' },
]

const BONUS_STATS: { key: string; label: string }[] = [
  { key: 'increasedFireRate',               label: '⬆ Cadencia' },
  { key: 'reducedVerticalRecoil',           label: '⬇ Retroceso vertical' },
  { key: 'reducedPerShotDispersion',        label: '⬇ Dispersión por disparo' },
  { key: 'reducedMaxShotDispersion',        label: '⬇ Dispersión máxima' },
  { key: 'reducedDispersionRecoveryTime',   label: '⬇ Recuperación dispersión' },
  { key: 'reducedReloadTime',               label: '⬇ Tiempo de recarga' },
  { key: 'increasedBulletVelocity',         label: '⬆ Velocidad de bala' },
  { key: 'increasedADSSpeed',               label: '⬆ Velocidad ADS' },
  { key: 'reducedRecoilRecoveryTime',       label: '⬇ Recuperación retroceso' },
  { key: 'reducedDurabilityBurnRate',       label: '⬇ Desgaste' },
]

function romanToNum(name: string): number {
  const match = name.match(/([IVXLCDM]+)$/)
  if (!match) return 0
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let result = 0
  const roman = match[1]
  for (let i = 0; i < roman.length; i++) {
    const curr = map[roman[i]] ?? 0
    const next = map[roman[i + 1]] ?? 0
    result += curr < next ? -curr : curr
  }
  return result
}

function StatBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10">
      <div
        className="h-1.5 rounded-full bg-[var(--app-accent)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function WeaponDetail({ levels }: { levels: Weapon[] }) {
  const sorted = [...levels].sort((a, b) => romanToNum(a.name) - romanToNum(b.name))
  const [selected, setSelected] = useState(0)
  const weapon = sorted[selected]

  const baseName = weapon.name.replace(/\s+[IVXLCDM]+$/, '').trim()
  const weaponSlug = baseName.toLowerCase().replace(/\s+/g, '-')
  const build = getBuildForWeapon(weaponSlug)

  // Nivel I como fuente canónica de los stats base (evita datos inconsistentes de la API)
  const base = sorted[0].stat_block ?? {}
  const sb = weapon.stat_block ?? {}

  // Calcula el fireRate efectivo: base * (1 + increasedFireRate / 100)
  function effectiveStat(key: string): number | null {
    const baseVal = base[key] as number | null
    if (!baseVal) return null
    if (key === 'fireRate') {
      const bonus = (sb.increasedFireRate as number) || 0
      return Math.round((baseVal * (1 + bonus / 100)) * 10) / 10
    }
    return baseVal
  }

  const bonuses = BONUS_STATS.filter((s) => {
    // fireRate ya se muestra calculado en stats base, no repetir como bonus
    if (s.key === 'increasedFireRate') return false
    const v = sb[s.key]
    return v !== null && v !== undefined && v !== 0
  })

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <a href="/armas" className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Armas
      </a>

      <div className="mt-6 grid gap-10 md:grid-cols-[180px_1fr]">
        {/* Columna izquierda */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-40 w-40">
            <Image src={weapon.icon} alt={weapon.name} fill className="object-contain drop-shadow-2xl" unoptimized />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{baseName}</h1>
            {weapon.subcategory && <p className="mt-1 text-sm text-white/45">{weapon.subcategory}</p>}
          </div>

          {/* Modo de disparo + munición */}
          <div className="w-full space-y-1.5">
            {sb.firingMode && (
              <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs">
                <span className="text-white/45">Modo</span>
                <span className="font-semibold text-white/80">{sb.firingMode}</span>
              </div>
            )}
            {weapon.ammo_type && (
              <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs">
                <span className="text-white/45">Munición</span>
                <span className="font-semibold text-white/80">{weapon.ammo_type}</span>
              </div>
            )}
            <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs">
              <span className="text-white/45">Valor</span>
              <span className="font-semibold text-white/80">{weapon.value.toLocaleString()} ₢</span>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">
          {/* Selector de nivel */}
          {sorted.length > 1 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/35">Nivel</p>
              <div className="flex flex-wrap gap-2">
                {sorted.map((w, i) => {
                  const lvl = w.name.replace(baseName, '').trim() || 'Base'
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelected(i)}
                      className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                        selected === i
                          ? (RARITY_COLOR[w.rarity] ?? RARITY_COLOR.Common)
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rareza */}
          <span className={`self-start rounded-xl border px-3 py-1.5 text-sm font-semibold ${RARITY_COLOR[weapon.rarity] ?? RARITY_COLOR.Common}`}>
            {weapon.rarity}
          </span>

          {/* Stats base */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/35">Estadísticas base</p>
            <div className="space-y-3">
              {BASE_STATS.map(({ key, label }) => {
                const val = effectiveStat(key)
                if (!val) return null
                const baseVal = base[key] as number
                const isBuffed = key === 'fireRate' && val !== baseVal
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/55">{label}</span>
                      <div className="flex items-center gap-2">
                        {isBuffed && (
                          <span className="text-xs text-white/30 line-through">{baseVal}</span>
                        )}
                        <span className={`font-bold ${isBuffed ? 'text-[var(--app-accent)]' : 'text-white'}`}>{val}</span>
                      </div>
                    </div>
                    <StatBar value={val} max={key === 'damage' ? 120 : key === 'range' ? 100 : key === 'fireRate' ? 80 : 100} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bonuses del nivel */}
          {bonuses.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/35">Bonificaciones de nivel</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bonuses.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <span className="text-xs text-white/55">{label}</span>
                    <span className="text-sm font-bold text-[var(--app-accent)]">+{sb[key]}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {weapon.description && (
            <p className="text-sm leading-relaxed text-white/45">{weapon.description}</p>
          )}
        </div>
      </div>

      {/* Mejor build de attachments */}
      {build && (
        <>
          <div className="my-10 h-px bg-white/8" />
          <section>
            <div className="mb-5 flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
                Mejor combinación de attachments
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-base font-bold text-white">{build.playstyle}</span>
              </div>
              <p className="text-sm leading-6 text-white/45">{build.note}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {build.attachments.map((att) => {
                const colors = SLOT_COLORS[att.slot]
                return (
                  <div
                    key={att.name}
                    className="flex items-center gap-4 overflow-hidden rounded-xl border border-white/8 bg-white/[0.025] p-3 transition hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    {/* Icono del attachment */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={att.icon}
                        alt={att.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Slot badge */}
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors}`}>
                        {att.slot}
                      </span>
                      <p className="mt-1 truncate text-sm font-semibold text-white/85">{att.name}</p>
                      <p className="mt-0.5 text-xs leading-4 text-white/40">{att.bonus}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
