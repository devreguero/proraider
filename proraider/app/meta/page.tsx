import Image from 'next/image'

export const metadata = {
  title: 'Meta · ProRaider',
  description: 'Tier list de armas, mecánicas clave y guía de farming del meta actual de ARC Raiders.',
}

// ─── API fetch ────────────────────────────────────────────────────────────────

function baseName(name: string) {
  return name.replace(/\s+[IVXLCDM]+$/, '').trim()
}

async function fetchAllIcons(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  try {
    let page = 1
    while (true) {
      const res = await fetch(
        `https://metaforge.app/api/arc-raiders/items?limit=100&page=${page}`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) break
      const json = await res.json()
      for (const w of json.data ?? []) {
        const key = baseName(w.name).toLowerCase()
        if (!map.has(key)) map.set(key, w.icon)
      }
      if (!json.pagination?.hasNextPage) break
      page++
    }
  } catch {}
  return map
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    tier: 'S',
    label: 'Meta',
    color: '#f87171',
    bg: 'bg-red-400/10',
    border: 'border-red-400/25',
    text: 'text-red-400',
    weapons: [
      {
        name: 'Anvil',
        type: 'Hand Cannon',
        ammo: 'Pesada',
        pvp: true, pve: true,
        note: 'La opción más versátil del juego. Alta penetración de armadura, buena cadencia y manejo, y bajo coste. Top tanto en PvP como PvE.',
      },
      {
        name: 'Renegade',
        type: 'Battle Rifle',
        ammo: 'Pesada',
        pvp: true, pve: false,
        note: 'Cadencia elevada y daño superior en rango medio-largo. Uno de los mejores rifles para duelos a distancia.',
      },
      {
        name: 'Venator',
        type: 'Pistol',
        ammo: 'Media',
        pvp: true, pve: false,
        note: 'Dispara dos balas a la vez. Daño en ráfaga enorme a corta-media distancia — se comporta como un arma primaria.',
      },
      {
        name: 'Bobcat',
        type: 'SMG',
        ammo: 'Ligera',
        pvp: true, pve: false,
        note: 'SMG de altísima cadencia. Domina el CQC en PvP y es muy eficaz contra enemigos acorazados en corta distancia.',
      },
      {
        name: 'Vulcano',
        type: 'Shotgun',
        ammo: 'Ligera',
        pvp: true, pve: false,
        note: 'Mayor daño en ráfaga del juego. Élite para combate cerrado — puede liquidar a un jugador en muy pocos disparos.',
      },
    ],
  },
  {
    tier: 'A',
    label: 'Sólido',
    color: '#fb923c',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/25',
    text: 'text-orange-400',
    weapons: [
      {
        name: 'Il Toro',
        type: 'Shotgun',
        ammo: 'Ligera',
        pvp: true, pve: false,
        note: 'Escopeta de alto daño muy valorada en PvP. Capaz de eliminar jugadores en muy pocos disparos. Alternativa directa al Vulcano.',
      },
      {
        name: 'Dolabra',
        type: 'Energy Shotgun',
        ammo: 'Energía',
        pvp: true, pve: true,
        note: 'Nueva en Flashpoint (marzo 2026). Foco variable: dispersión amplia o haz concentrado. Muy fuerte contra ARC acorazados.',
      },
      {
        name: 'Canto',
        type: 'SMG',
        ammo: 'Media',
        pvp: true, pve: false,
        note: 'Nuevo en Flashpoint. Retroceso controlable y buen rendimiento PvP. Usa ammo media, más fiable que el Bobcat contra ARC.',
      },
      {
        name: 'Ferro',
        type: 'Battle Rifle',
        ammo: 'Pesada',
        pvp: false, pve: true,
        note: 'Calidad común con rendimiento de élite en PvE. Excelente penetración de armadura ARC y muy asequible para el crafting.',
      },
      {
        name: 'Tempest',
        type: 'Assault Rifle',
        ammo: 'Media',
        pvp: true, pve: true,
        note: 'Retroceso perdonador y daño consistente. Una de las mejores opciones para empezar por su equilibrio y facilidad de uso.',
      },
    ],
  },
  {
    tier: 'B',
    label: 'Viable',
    color: '#facc15',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/25',
    text: 'text-yellow-400',
    weapons: [
      {
        name: 'Hullcracker',
        type: 'Grenade Launcher',
        ammo: 'Especial',
        pvp: false, pve: true,
        note: 'Mejor opción para eliminar amenazas ARC mecánicas (Comets, Fireflies). Inútil en PvP por la velocidad del proyectil.',
      },
      {
        name: 'Jupiter',
        type: 'Sniper Rifle',
        ammo: 'Pesada',
        pvp: false, pve: true,
        note: 'Diseñado para amenazas ARC grandes y lejanas. Daño de francotirador excepcional contra jefes. Poco práctico en PvP.',
      },
      {
        name: 'Kettle',
        type: 'Assault Rifle',
        ammo: 'Media',
        pvp: true, pve: true,
        note: 'Rifle común muy sólido en PvE pese a los nerfs recibidos. Opción de bajo coste para farmear sin arriesgar equipo caro.',
      },
      {
        name: 'Bettina',
        type: 'Assault Rifle',
        ammo: 'Media',
        pvp: true, pve: true,
        note: 'Daño sostenido aceptable en PvP y PvE. Ha sido superada por las opciones de tier superior pero sigue siendo viable.',
      },
      {
        name: 'Stitcher',
        type: 'SMG',
        ammo: 'Ligera',
        pvp: false, pve: false,
        note: 'SMG básico que ha perdido relevancia con la llegada del Canto. Sigue siendo útil en fases iniciales del juego.',
      },
    ],
  },
]

const MECHANICS = [
  {
    icon: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z',
    title: 'El sonido te delata',
    color: 'text-amber-400',
    bg: 'bg-amber-400/8',
    border: 'border-amber-400/20',
    dot: 'bg-amber-400',
    points: [
      'Cada paso, disparo y saqueo emite sonido audible para jugadores y ARC cercanos.',
      'El ascensor hace sonar una alarma al llamarlo — atrae a todos en el mapa.',
      'Gentle Pressure y Silent Scavenger reducen el ruido al saquear y forzar.',
      'Evita correr en interiores o romper cristales si hay otros raiders cerca.',
    ],
  },
  {
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    title: 'Gestión de stamina',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/8',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
    points: [
      'Marathon Runner (5/5) es el primer skill obligatorio en cualquier build.',
      'Guardar el arma aumenta la velocidad y duración del sprint — úsalo al rotar.',
      'El slide no consume stamina: encadénalos en bajadas para rotar gratis.',
      'Las escopetas se recargan durante el dodge roll — dispara, esquiva, dispara.',
    ],
  },
  {
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Extracción inteligente',
    color: 'text-blue-400',
    bg: 'bg-blue-400/8',
    border: 'border-blue-400/20',
    dot: 'bg-blue-400',
    points: [
      'Extrae antes de que la zona se reduzca — cada minuto extra multiplica el riesgo.',
      'Incluso tumbado (knocked) puedes activar la extracción y escapar.',
      'No campees el punto de extracción — la posición móvil central es más segura.',
      'El Safe Pocket es inviolable: mete siempre lo más valioso antes de entrar en combate.',
    ],
  },
  {
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    title: 'Riven Tides — Próximamente',
    color: 'text-violet-400',
    bg: 'bg-violet-400/8',
    border: 'border-violet-400/20',
    dot: 'bg-violet-400',
    points: [
      'Nuevo mapa costero (dunas, acantilados, ruinas inundadas) — finales de abril 2026.',
      'Nuevo enemigo ARC grande aún sin confirmar. Teorías apuntan a "The Emperor" o "The Bishop".',
      'Expedition Window 3: retira a tu Raider para recompensas cosméticas exclusivas.',
      'El proyecto High-Gain Antenna expira antes de Riven Tides — complétalo ya.',
    ],
  },
]

const FARMING = [
  {
    title: 'Taquillas de seguridad',
    itemIcon: 'dam surveillance key',
    color: 'text-indigo-400', bg: 'bg-indigo-400/8', border: 'border-indigo-400/20',
    tip: '12–18% de probabilidad de blueprint. Las de grado militar llegan al 20%. Requieren Security Breach (36+ puntos en Survival) o tarjetas de acceso.',
  },
  {
    title: 'Close Scrutiny',
    itemIcon: 'assessor matrix',
    color: 'text-amber-400', bg: 'bg-amber-400/8', border: 'border-amber-400/20',
    tip: 'Operación de alto riesgo de Flashpoint. Los blueprints de la Dolabra dropean exclusivamente aquí. Los guardias dropean equipo mejorado.',
  },
  {
    title: 'Baron Husks',
    itemIcon: 'matriarch reactor',
    color: 'text-red-400', bg: 'bg-red-400/8', border: 'border-red-400/20',
    tip: 'Desde el Patch 1.22.0 los Baron Husks dropean más loot al morir. Priorízalos en cualquier expedición — el ratio loot/tiempo ha mejorado significativamente.',
  },
  {
    title: 'Progresión por fases',
    itemIcon: 'advanced arc powercell',
    color: 'text-emerald-400', bg: 'bg-emerald-400/8', border: 'border-emerald-400/20',
    tip: 'Fase 1: rutas seguras hasta 500K créditos. Fase 2: zonas de riesgo con Scrappy nivel 5. Fase 3: eventos de máquinas para Advanced ARC Powercells y blueprints épicos.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MetaPage() {
  const icons = await fetchAllIcons()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--app-accent)]/20 bg-[var(--app-accent)]/8 px-3 py-1 text-xs font-semibold text-[var(--app-accent)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--app-accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--app-accent)]" />
          </span>
          Flashpoint · Patch 1.24.0 · Abril 2026
        </div>
        <h1 className="text-3xl font-black text-white">Meta Actual</h1>
        <p className="mt-1.5 text-sm text-white/35">
          Tier list de armas, mecánicas clave y guía de farming
        </p>
      </div>

      {/* ── Tier List ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Tier List de Armas</h2>
        <p className="mt-1 text-sm text-white/35">Abril 2026 · Basado en rendimiento real en PvP y PvE</p>
      </div>

      <div className="space-y-3">
        {TIERS.map(({ tier, label, color, bg, border, text, weapons }) => (
          <div key={tier} className={`overflow-hidden rounded-2xl border ${border}`}>
            {/* Tier row header */}
            <div className={`flex items-center gap-3 px-4 py-2 ${bg}`}>
              <span className="text-2xl font-black leading-none" style={{ color }}>{tier}</span>
              <span className="text-xs font-semibold text-white/40">{label}</span>
              <div className="h-px flex-1 bg-white/6" />
              <span className="text-xs text-white/20">{weapons.length} armas</span>
            </div>

            {/* Weapon rows */}
            <div className="divide-y divide-white/4">
              {weapons.map((w) => {
                const iconUrl = icons.get(w.name.toLowerCase())
                return (
                  <div key={w.name} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02]">
                    {/* Icon */}
                    <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-white/[0.03]">
                      {iconUrl ? (
                        <Image
                          src={iconUrl}
                          alt={w.name}
                          width={80}
                          height={48}
                          className="h-full w-full object-contain p-1"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-5 w-5 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.608a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.473z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name + type */}
                    <div className="w-36 shrink-0">
                      <p className={`text-sm font-bold ${text}`}>{w.name}</p>
                      <p className="text-[11px] text-white/30">{w.type}</p>
                      <span className="mt-1 inline-block rounded border border-white/8 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/35">{w.ammo}</span>
                    </div>

                    {/* Note */}
                    <p className="flex-1 text-xs leading-relaxed text-white/50">{w.note}</p>

                    {/* PvP / PvE badges */}
                    <div className="flex shrink-0 flex-col gap-1">
                      {w.pvp && <span className="rounded border border-red-400/25 bg-red-400/10 px-1.5 py-0.5 text-center text-[9px] font-bold text-red-400">PvP</span>}
                      {w.pve && <span className="rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-center text-[9px] font-bold text-emerald-400">PvE</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-white/20">
        Fuentes: GamesRadar (1 abr 2026), Reddit, arcraiders.com · Patch 1.22.0–1.24.0
      </p>

      {/* ── Divider ── */}
      <div className="my-12 border-t border-white/6" />

      {/* ── Mechanics ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Mecánicas Clave</h2>
        <p className="mt-1 text-sm text-white/35">Lo que separa a un raider que extrae de uno que muere</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MECHANICS.map((m) => (
          <div key={m.title} className={`rounded-2xl border p-5 ${m.bg} ${m.border}`}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${m.border} bg-black/20`}>
                <svg className={`h-[18px] w-[18px] ${m.color}`} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                </svg>
              </div>
              <h3 className={`text-sm font-bold ${m.color}`}>{m.title}</h3>
            </div>
            <ul className="space-y-2">
              {m.points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/50">
                  <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${m.dot}`} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="my-12 border-t border-white/6" />

      {/* ── Farming ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Guía de Farming</h2>
        <p className="mt-1 text-sm text-white/35">Créditos, blueprints y materiales — las fuentes más eficientes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FARMING.map((f) => {
          const imgUrl = icons.get(f.itemIcon)
          return (
            <div key={f.title} className={`flex flex-col rounded-2xl border ${f.bg} ${f.border} overflow-hidden`}>
              {/* Image */}
              <div className="flex h-28 items-center justify-center border-b border-white/6 bg-black/20">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={f.title}
                    width={160}
                    height={100}
                    className="h-full w-full object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <svg className={`h-10 w-10 ${f.color} opacity-30`} fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <p className={`mb-2 text-sm font-bold ${f.color}`}>{f.title}</p>
                <p className="text-xs leading-relaxed text-white/45">{f.tip}</p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
