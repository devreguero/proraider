'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  SKILLS, BRANCH_CONFIG, TOTAL_POINTS, TIER_MIN,
  getBranchPoints, getTotalPoints,
  type SkillBranch,
} from '@/lib/skillTreeData'

// ── Canvas ────────────────────────────────────────────────────────────────────
const W = 1200
const H = 880

// The 15 large nodes: 3 branch roots + 6 tier-2 gate openers + 6 capstones
const LARGE_NODES = new Set([
  'used-to-weight', 'nimble-climber', 'agile-croucher',
  'survivors-stamina', 'unburdened-roll', 'carry-momentum', 'calming-stroll', 'suffer-in-silence', 'good-as-new',
  'back-on-your-feet', 'flyswatter', 'vaults-on-vaults', 'vault-spring', 'security-breach', 'minesweeper',
])

function getR(skill: { id: string }): number {
  return LARGE_NODES.has(skill.id) ? 20 : 13
}

// ── Coordinates from arcskilltree.com reference (canonical in-game layout) ───
// Source canvas ~1340×570 → ours 1200×880
// new_X = old_X × 0.821 − 10   |   new_Y = old_Y × 1.193 + 80
// (back-on-your-feet x clamped to 25 to stay on-canvas)

// ── Skill icons ───────────────────────────────────────────────────────────────
const WI = 'https://arcraiders.wiki/w/images'
const ICONS: Record<string, string> = {
  // Mobility
  'nimble-climber':     `${WI}/a/a4/Icon_Nimble_Climber.png`,
  'marathon-runner':    `${WI}/7/75/Icon_Marathon_Runner.png`,
  'slip-and-slide':     `${WI}/0/0c/Icon_Slip_and_Slide.png`,
  'youthful-lungs':     `${WI}/b/be/Icon_Youthful_Lungs.png`,
  'sturdy-ankles':      `${WI}/6/63/Icon_Sturdy_Ankles.png`,
  'carry-momentum':     `${WI}/2/2b/Icon_Carry_The_Momentum.png`,
  'calming-stroll':     `${WI}/a/ab/Icon_Calming_Stroll.png`,
  'effortless-roll':    `${WI}/c/ce/Icon_Effortless_Roll.png`,
  'crawl-before-walk':  `${WI}/b/b0/Icon_Crawl_Before_You_Walk.png`,
  'off-the-wall':       `${WI}/2/2c/Icon_Off_The_Wall.png`,
  'heroic-leap':        `${WI}/f/f0/Icon_Heroic_Leap.png`,
  'vigorous-vaulter':   `${WI}/1/12/Icon_Vigorous_Vaulter.png`,
  'ready-to-roll':      `${WI}/9/91/Icon_Ready_To_Roll.png`,
  'vaults-on-vaults':   `${WI}/7/73/Icon_Vaults_On_Vaults_On_Vaults.png`,
  'vault-spring':       `${WI}/0/0a/Icon_Vault_Spring.png`,
  // Conditioning
  'used-to-weight':     `${WI}/4/43/Icon_Used_To_The_Weight.png`,
  'blast-born':         `${WI}/b/b5/Icon_Blast-Born.png`,
  'gentle-pressure':    `${WI}/0/01/Icon_Gentle_Pressure.png`,
  'fight-or-flight':    `${WI}/2/26/Icon_Fight_Or_Flight.png`,
  'proficient-pryer':   `${WI}/1/12/Icon_Proficient_Pryer.png`,
  'survivors-stamina':  `${WI}/3/31/Icon_Survivor%27s_Stamina.png`,
  'unburdened-roll':    `${WI}/7/74/Icon_Unburdened_Roll.png`,
  'downed-determined':  `${WI}/4/4a/Icon_Downed_But_Determined.png`,
  'a-little-extra':     `${WI}/9/98/Icon_A_Little_Extra.png`,
  'effortless-swing':   `${WI}/7/7f/Icon_Effortless_Swing.png`,
  'turtle-crawl':       `${WI}/f/f0/Icon_Turtle_Crawl.png`,
  'loaded-arms':        `${WI}/6/60/Icon_Loaded_Arms.png`,
  'sky-clearing-swing': `${WI}/c/c9/Icon_Sky-Clearing_Swing.png`,
  'back-on-your-feet':  `${WI}/4/4f/Icon_Back_On_Your_Feet.png`,
  'flyswatter':         `${WI}/5/5d/Icon_Flyswatter.png`,
  // Survival
  'agile-croucher':     `${WI}/6/65/Icon_Agile_Croucher.png`,
  'looters-instincts':  `${WI}/4/4d/Icon_Looter%27s_Instincts.png`,
  'revitalizing-squat': `${WI}/e/e8/Icon_Revitalizing_Squat.png`,
  'silent-scavenger':   `${WI}/8/84/Icon_Silent_Scavenger.png`,
  'in-round-crafting':  `${WI}/b/b4/Icon_In-round_Crafting.png`,
  'suffer-in-silence':  `${WI}/4/4c/Icon_Suffer_In_Silence.png`,
  'good-as-new':        `${WI}/6/60/Icon_Good_As_New.png`,
  'broad-shoulders':    `${WI}/7/76/Icon_Broad_Shoulders.png`,
  'traveling-tinkerer': `${WI}/5/50/Icon_Traveling_Tinkerer.png`,
  'stubborn-mule':      `${WI}/8/81/Icon_Stubborn_Mule.png`,
  'looters-luck':       `${WI}/f/f5/Icon_Looter%27s_Luck.png`,
  'one-raiders-scraps': `${WI}/0/01/Icon_One_Raider%27s_Scraps.png`,
  'three-deep-breaths': `${WI}/a/ae/Icon_Three_Deep_Breaths.png`,
  'security-breach':    `${WI}/8/8f/Icon_Security_Breach.png`,
  'minesweeper':        `${WI}/c/cc/Icon_Minesweeper.png`,
}

type NodePos      = { skillId: string; x: number; y: number }
type Edge         = { from: string; to: string }
type BranchLayout = { nodes: NodePos[]; edges: Edge[] }

// nodes[0] = trunk base (lowest on canvas = highest y value)
const LAYOUTS: Record<SkillBranch, BranchLayout> = {

  // ── CONDITIONING — fans LEFT from central trunk ──────────────────────────────
  conditioning: {
    nodes: [
      { skillId: 'used-to-weight',    x: 492, y: 730 }, // trunk base
      { skillId: 'blast-born',        x: 388, y: 723 },
      { skillId: 'gentle-pressure',   x: 400, y: 625 },
      { skillId: 'fight-or-flight',   x: 346, y: 688 },
      { skillId: 'proficient-pryer',  x: 400, y: 555 },
      { skillId: 'survivors-stamina', x: 272, y: 617 },
      { skillId: 'unburdened-roll',   x: 336, y: 457 },
      { skillId: 'downed-determined', x: 191, y: 556 },
      { skillId: 'a-little-extra',    x: 221, y: 476 },
      { skillId: 'effortless-swing',  x: 254, y: 397 },
      { skillId: 'turtle-crawl',      x: 149, y: 520 },
      { skillId: 'loaded-arms',       x: 180, y: 440 },
      { skillId: 'sky-clearing-swing',x: 212, y: 360 },
      { skillId: 'back-on-your-feet', x:  75, y: 426 },
      { skillId: 'flyswatter',        x: 106, y: 264 },
    ],
    edges: [
      { from: 'used-to-weight',    to: 'blast-born'         },
      { from: 'used-to-weight',    to: 'gentle-pressure'    },
      { from: 'blast-born',        to: 'fight-or-flight'    },
      { from: 'gentle-pressure',   to: 'proficient-pryer'   },
      { from: 'fight-or-flight',   to: 'survivors-stamina'  },
      { from: 'proficient-pryer',  to: 'unburdened-roll'    },
      { from: 'survivors-stamina', to: 'downed-determined'  },
      { from: 'survivors-stamina', to: 'a-little-extra'     },
      { from: 'unburdened-roll',   to: 'a-little-extra'     },
      { from: 'unburdened-roll',   to: 'effortless-swing'   },
      { from: 'downed-determined', to: 'turtle-crawl'       },
      { from: 'a-little-extra',    to: 'loaded-arms'        },
      { from: 'effortless-swing',  to: 'sky-clearing-swing' },
      { from: 'turtle-crawl',      to: 'back-on-your-feet'  },
      { from: 'loaded-arms',       to: 'back-on-your-feet'  },
      { from: 'loaded-arms',       to: 'flyswatter'         },
      { from: 'sky-clearing-swing',to: 'flyswatter'         },
    ],
  },

  // ── MOBILITY — central trunk going straight up ──────────────────────────────
  mobility: {
    nodes: [
      { skillId: 'nimble-climber',    x: 568, y: 672 }, // trunk base
      { skillId: 'marathon-runner',   x: 495, y: 557 },
      { skillId: 'slip-and-slide',    x: 666, y: 557 },
      { skillId: 'youthful-lungs',    x: 495, y: 491 },
      { skillId: 'sturdy-ankles',     x: 666, y: 491 },
      { skillId: 'carry-momentum',    x: 525, y: 407 },
      { skillId: 'calming-stroll',    x: 610, y: 407 },
      { skillId: 'effortless-roll',   x: 495, y: 294 },
      { skillId: 'crawl-before-walk', x: 582, y: 294 },
      { skillId: 'off-the-wall',      x: 665, y: 294 },
      { skillId: 'heroic-leap',       x: 495, y: 226 },
      { skillId: 'vigorous-vaulter',  x: 582, y: 226 },
      { skillId: 'ready-to-roll',     x: 665, y: 226 },
      { skillId: 'vaults-on-vaults',  x: 525, y:  80 },
      { skillId: 'vault-spring',      x: 611, y:  80 },
    ],
    edges: [
      { from: 'nimble-climber',    to: 'marathon-runner'   },
      { from: 'nimble-climber',    to: 'slip-and-slide'    },
      { from: 'marathon-runner',   to: 'youthful-lungs'    },
      { from: 'slip-and-slide',    to: 'sturdy-ankles'     },
      { from: 'youthful-lungs',    to: 'carry-momentum'    },
      { from: 'sturdy-ankles',     to: 'calming-stroll'    },
      { from: 'carry-momentum',    to: 'effortless-roll'   },
      { from: 'carry-momentum',    to: 'crawl-before-walk' },
      { from: 'calming-stroll',    to: 'crawl-before-walk' },
      { from: 'calming-stroll',    to: 'off-the-wall'      },
      { from: 'effortless-roll',   to: 'heroic-leap'       },
      { from: 'crawl-before-walk', to: 'vigorous-vaulter'  },
      { from: 'off-the-wall',      to: 'ready-to-roll'     },
      { from: 'heroic-leap',       to: 'vaults-on-vaults'  },
      { from: 'vigorous-vaulter',  to: 'vaults-on-vaults'  },
      { from: 'ready-to-roll',     to: 'vault-spring'      },
    ],
  },

  // ── SURVIVAL — fans RIGHT from central trunk ────────────────────────────────
  survival: {
    nodes: [
      { skillId: 'agile-croucher',    x:  676, y: 760 }, // trunk base
      { skillId: 'looters-instincts', x:  792, y: 654 },
      { skillId: 'revitalizing-squat',x:  804, y: 752 },
      { skillId: 'silent-scavenger',  x:  792, y: 582 },
      { skillId: 'in-round-crafting', x:  846, y: 717 },
      { skillId: 'suffer-in-silence', x:  832, y: 487 },
      { skillId: 'good-as-new',       x:  896, y: 647 },
      { skillId: 'broad-shoulders',   x:  938, y: 425 },
      { skillId: 'traveling-tinkerer',x:  969, y: 502 },
      { skillId: 'stubborn-mule',     x: 1002, y: 586 },
      { skillId: 'looters-luck',      x:  978, y: 390 },
      { skillId: 'one-raiders-scraps',x: 1011, y: 470 },
      { skillId: 'three-deep-breaths',x: 1044, y: 550 },
      { skillId: 'security-breach',   x: 1062, y: 292 },
      { skillId: 'minesweeper',       x: 1126, y: 455 },
    ],
    edges: [
      { from: 'agile-croucher',     to: 'looters-instincts'  },
      { from: 'agile-croucher',     to: 'revitalizing-squat' },
      { from: 'looters-instincts',  to: 'silent-scavenger'   },
      { from: 'revitalizing-squat', to: 'in-round-crafting'  },
      { from: 'silent-scavenger',   to: 'suffer-in-silence'  },
      { from: 'in-round-crafting',  to: 'good-as-new'        },
      { from: 'suffer-in-silence',  to: 'broad-shoulders'    },
      { from: 'suffer-in-silence',  to: 'traveling-tinkerer' },
      { from: 'good-as-new',        to: 'traveling-tinkerer' },
      { from: 'good-as-new',        to: 'stubborn-mule'      },
      { from: 'broad-shoulders',    to: 'looters-luck'       },
      { from: 'traveling-tinkerer', to: 'one-raiders-scraps' },
      { from: 'stubborn-mule',      to: 'three-deep-breaths' },
      { from: 'looters-luck',       to: 'security-breach'    },
      { from: 'one-raiders-scraps', to: 'security-breach'    },
      { from: 'one-raiders-scraps', to: 'minesweeper'        },
      { from: 'three-deep-breaths', to: 'minesweeper'        },
    ],
  },
}

// ── Label X centers ───────────────────────────────────────────────────────────
const LABEL_X: Record<SkillBranch, number> = {
  conditioning: 270,
  mobility:     578,
  survival:     901,
}


type GNode = NodePos & { branch: SkillBranch }
const BRANCHES: SkillBranch[] = ['conditioning', 'mobility', 'survival']

// ── Component ─────────────────────────────────────────────────────────────────
export default function SkillTreeBuilder() {
  const searchParams = useSearchParams()
  const [allocated, setAllocated] = useState<Record<string, number>>(() => {
    const param = searchParams.get('build')
    if (!param) return {}
    try { return JSON.parse(atob(param)) } catch { return {} }
  })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tipPos,    setTipPos]    = useState({ x: 0, y: 0 })

  const totalSpent = getTotalPoints(allocated)
  const remaining  = TOTAL_POINTS - totalSpent

  const isLocked = useCallback((skillId: string): boolean => {
    const skill = SKILLS.find((s) => s.id === skillId)
    if (!skill) return true
    const bPts   = getBranchPoints(allocated, skill.branch)
    const minPts = skill.minBranchPoints ?? TIER_MIN[skill.tier] ?? 0
    if (bPts < minPts) return true
    if (skill.requires) {
      const pre = SKILLS.find((s) => s.id === skill.requires)
      if (!pre || (allocated[pre.id] ?? 0) < 1) return true
    }
    return false
  }, [allocated])

  const canRemove = useCallback((skillId: string): boolean => {
    if ((allocated[skillId] ?? 0) <= 0) return false
    // Block removing the LAST point if any skill that requires this one is allocated
    if ((allocated[skillId] ?? 0) === 1 && SKILLS.some((s) => s.requires === skillId && (allocated[s.id] ?? 0) > 0)) return false
    const skill = SKILLS.find((s) => s.id === skillId)!
    const sim: Record<string, number> = { ...allocated }
    const cur = sim[skillId] ?? 0
    if (cur <= 1) delete sim[skillId]; else sim[skillId] = cur - 1
    const nb = getBranchPoints(sim, skill.branch)
    for (const s of SKILLS) {
      if (s.id === skillId || s.branch !== skill.branch || (sim[s.id] ?? 0) <= 0) continue
      if (nb < (s.minBranchPoints ?? TIER_MIN[s.tier] ?? 0)) return false
    }
    return true
  }, [allocated])

  const addRank = useCallback((skillId: string) => {
    const skill = SKILLS.find((s) => s.id === skillId)
    if (!skill || isLocked(skillId) || (allocated[skillId] ?? 0) >= skill.maxRanks || remaining <= 0) return
    setAllocated((p) => ({ ...p, [skillId]: (p[skillId] ?? 0) + 1 }))
  }, [allocated, isLocked, remaining])

  const removeRank = useCallback((skillId: string) => {
    if (!canRemove(skillId)) return
    setAllocated((p) => {
      const n = { ...p }
      const cur = n[skillId] ?? 0
      if (cur <= 1) delete n[skillId]; else n[skillId] = cur - 1
      return n
    })
  }, [canRemove])

  const reset = useCallback(() => setAllocated({}), [])

  const allNodes: GNode[] = BRANCHES.flatMap((branch) =>
    LAYOUTS[branch].nodes.map((n) => ({ ...n, branch }))
  )
  const nodeMap = Object.fromEntries(allNodes.map((n) => [n.skillId, n]))
  const hoveredSkill = hoveredId ? SKILLS.find((s) => s.id === hoveredId) : null

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Skill Tree Builder</h1>
          <p className="mt-0.5 text-xs text-white/30">Click: añadir · Click derecho: quitar · Hover: detalles</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BRANCHES.map((b) => {
            const cfg  = BRANCH_CONFIG[b]
            const bPts = getBranchPoints(allocated, b)
            return (
              <div key={b} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold ${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`}>
                <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
                </svg>
                <span className="hidden sm:inline">{cfg.label}</span>
                <span>{bPts}</span>
              </div>
            )
          })}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-1.5 text-center">
            <span className="text-base font-bold text-[var(--app-accent)]">{totalSpent}</span>
            <span className="text-xs text-white/25"> / {TOTAL_POINTS}</span>
          </div>
          <button onClick={reset} disabled={totalSpent === 0}
            className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-25">
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/6">
        <div className="h-1 rounded-full bg-[var(--app-accent)] transition-all duration-500"
          style={{ width: `${(totalSpent / TOTAL_POINTS) * 100}%` }} />
      </div>

      {/* Canvas */}
      <div className="overflow-x-auto rounded-2xl border border-white/6"
        onMouseMove={(e) => { if (hoveredId) setTipPos({ x: e.clientX + 16, y: e.clientY - 96 }) }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 700, display: 'block', width: '100%' }}>
          <defs>
            <filter id="glow-xl" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="blur-only" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7"/>
            </filter>
            <filter id="blur-sm" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
            </filter>
            {allNodes.map(({ skillId }) => {
              const sk = SKILLS.find((s) => s.id === skillId)!
              const nr = getR(sk)
              return (
                <clipPath key={skillId} id={`cp-${skillId}`}>
                  <circle r={nr - 3}/>
                </clipPath>
              )
            })}
            <radialGradient id="bg-c" cx="20%" cy="75%" r="28%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="bg-m" cx="45%" cy="55%" r="25%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="bg-s" cx="80%" cy="70%" r="28%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width={W} height={H} fill="#080d18"/>
          <rect width={W} height={H} fill="url(#bg-c)"/>
          <rect width={W} height={H} fill="url(#bg-m)"/>
          <rect width={W} height={H} fill="url(#bg-s)"/>

          {/* ── Trunk lines (bottom nodes → shared bar at y=820) ──────────────── */}
          {BRANCHES.map((branch) => {
            const base    = LAYOUTS[branch].nodes[0]
            const baseSk  = SKILLS.find((s) => s.id === base.skillId)!
            const baseR   = getR(baseSk)
            const cfg     = BRANCH_CONFIG[branch]
            const hasPts  = getBranchPoints(allocated, branch) > 0
            return (
              <g key={`trunk-${branch}`}>
                {hasPts && (
                  <line x1={base.x} y1={base.y + baseR} x2={base.x} y2={820}
                    stroke={cfg.color} strokeWidth={14} opacity={0.12} filter="url(#blur-only)"/>
                )}
                <line x1={base.x} y1={base.y + baseR} x2={base.x} y2={820}
                  stroke={hasPts ? cfg.color : 'rgba(255,255,255,0.07)'}
                  strokeWidth={hasPts ? 5 : 2}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}/>
              </g>
            )
          })}
          {/* Horizontal connector */}
          <line x1={LAYOUTS.conditioning.nodes[0].x} y1={820}
                x2={LAYOUTS.survival.nodes[0].x}     y2={820}
                stroke="rgba(255,255,255,0.08)" strokeWidth={2}/>

          {/* ── Edges ────────────────────────────────────────────────────────── */}
          {BRANCHES.flatMap((branch) => {
            const cfg = BRANCH_CONFIG[branch]
            return LAYOUTS[branch].edges.map((edge) => {
              const fn = nodeMap[edge.from]
              const tn = nodeMap[edge.to]
              if (!fn || !tn) return null
              const rF   = allocated[edge.from] ?? 0
              const rT   = allocated[edge.to]   ?? 0
              const both = rF > 0 && rT > 0
              const any  = rF > 0 || rT > 0
              const midY = (fn.y + tn.y) / 2
              const d    = `M ${fn.x} ${fn.y} C ${fn.x} ${midY} ${tn.x} ${midY} ${tn.x} ${tn.y}`
              return (
                <g key={`${edge.from}→${edge.to}`}>
                  {both && (
                    <path d={d} fill="none" stroke={cfg.color}
                      strokeWidth={18} opacity={0.15} filter="url(#blur-only)"/>
                  )}
                  <path d={d} fill="none" stroke="rgba(0,0,0,0.45)"
                    strokeWidth={both ? 9 : any ? 6 : 3}/>
                  <path d={d} fill="none"
                    stroke={both ? cfg.color : any ? `${cfg.color}50` : 'rgba(255,255,255,0.07)'}
                    strokeWidth={both ? 5 : any ? 3 : 2}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}/>
                </g>
              )
            }).filter(Boolean)
          })}

          {/* ── Nodes ────────────────────────────────────────────────────────── */}
          {allNodes.map(({ skillId, branch, x: nx, y: ny }) => {
            const skill  = SKILLS.find((s) => s.id === skillId)!
            const nr     = getR(skill)
            const rank   = allocated[skillId] ?? 0
            const locked = isLocked(skillId)
            const maxed  = rank >= skill.maxRanks
            const isHov  = hoveredId === skillId
            const active = rank > 0
            const cfg    = BRANCH_CONFIG[branch]

            return (
              <g key={skillId}
                transform={`translate(${nx}, ${ny})`}
                style={{ cursor: locked && !active ? 'not-allowed' : 'pointer' }}
                onClick={() => addRank(skillId)}
                onContextMenu={(e) => { e.preventDefault(); removeRank(skillId) }}
                onMouseEnter={(e) => { setHoveredId(skillId); setTipPos({ x: e.clientX + 16, y: e.clientY - 96 }) }}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Outer glow halo */}
                {active && (
                  <circle r={nr + 12} fill={cfg.color} opacity={maxed ? 0.30 : 0.18} filter="url(#blur-only)"/>
                )}
                {isHov && (
                  <circle r={nr + 8} fill={cfg.color} opacity={0.38} filter="url(#blur-only)"/>
                )}

                {/* Dark disc */}
                <circle r={nr} fill="#080d18"/>

                {/* Neon ring */}
                <circle r={nr} fill="none"
                  stroke={
                    active  ? cfg.color
                    : isHov ? `${cfg.color}60`
                    : locked ? 'rgba(255,255,255,0.09)'
                    : 'rgba(255,255,255,0.22)'
                  }
                  strokeWidth={active ? 3.5 : 1.8}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}/>

                {/* Ring inner glow */}
                {active && (
                  <circle r={nr} fill="none" stroke={cfg.color}
                    strokeWidth={8} opacity={0.18} filter="url(#blur-only)"/>
                )}

                {/* Icon */}
                {ICONS[skillId] && (
                  <image href={ICONS[skillId]}
                    x={-(nr - 4)} y={-(nr - 4)}
                    width={(nr - 4) * 2} height={(nr - 4) * 2}
                    clipPath={`url(#cp-${skillId})`}
                    style={{
                      filter: active
                        ? `drop-shadow(0 0 3px ${cfg.color}) brightness(10) saturate(0.2)`
                        : locked ? 'brightness(0.18) saturate(0)' : 'brightness(0.55) saturate(0)',
                      transition: 'filter 0.2s',
                    }}/>
                )}

                {/* Rank badge */}
                {active && skill.maxRanks > 1 && (
                  <g transform={`translate(${nr}, ${-nr})`}>
                    <circle r={nr === 20 ? 7 : 5.5} fill="#080d18" stroke={cfg.color} strokeWidth={1.2}/>
                    <text textAnchor="middle" dominantBaseline="central"
                      fontSize={nr === 20 ? '7' : '5.5'} fontWeight="800"
                      fill={cfg.color} fontFamily="ui-monospace,monospace">
                      {maxed ? '★' : rank}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* ── Branch labels ─────────────────────────────────────────────────── */}
          {BRANCHES.map((branch) => {
            const cfg  = BRANCH_CONFIG[branch]
            const bPts = getBranchPoints(allocated, branch)
            const lx   = LABEL_X[branch]
            return (
              <g key={`lbl-${branch}`}>
                <text x={lx} y={H - 45} textAnchor="middle" fontSize="9.5"
                  fill={bPts > 0 ? cfg.color : 'rgba(255,255,255,0.2)'}
                  fontFamily="ui-monospace,monospace" fontWeight="700" letterSpacing="0.14em"
                  style={{ transition: 'fill 0.3s' }}>
                  {cfg.label.toUpperCase()}
                </text>
                <text x={lx} y={H - 25} textAnchor="middle" fontSize="17"
                  fill={bPts > 0 ? cfg.color : 'rgba(255,255,255,0.15)'}
                  fontFamily="ui-monospace,monospace" fontWeight="800"
                  style={{ transition: 'fill 0.3s' }}>
                  {bPts}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredSkill && (
        <div className="pointer-events-none fixed z-50 w-60 rounded-xl border border-white/10 bg-[#0a0a0a]/96 p-3.5 shadow-2xl backdrop-blur-md"
          style={{ left: tipPos.x, top: tipPos.y }}>
          <p className={`text-sm font-bold ${BRANCH_CONFIG[hoveredSkill.branch].textClass}`}>
            {hoveredSkill.name}
          </p>
          <p className="mt-1.5 text-xs leading-4 text-white/50">{hoveredSkill.description}</p>
          <div className="mt-2.5 flex items-center justify-between text-[10px]">
            <span className="text-white/30">
              Rango {allocated[hoveredSkill.id] ?? 0} / {hoveredSkill.maxRanks}
            </span>
            {hoveredSkill.requires && (
              <span className="text-yellow-400/55">
                Req: {SKILLS.find((s) => s.id === hoveredSkill.requires)?.name}
              </span>
            )}
          </div>
        </div>
      )}

      <p className="mt-5 text-center text-[11px] text-white/15">
        81 puntos al nivel máximo · Resetear en raid ~152,000 ₢
      </p>
    </div>
  )
}
