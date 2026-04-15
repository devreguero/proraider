export type BuildAllocation = Record<string, number>

export type Build = {
  id:            string
  name:          string
  subtitle:      string
  category:      'meta' | 'creator'
  creator?: {
    name:     string
    handle:   string
    platform: 'twitch' | 'youtube' | 'both'
  }
  description:   string
  playstyle:     string[]
  allocation:    BuildAllocation
  primaryBranch: 'mobility' | 'conditioning' | 'survival'
  keySkills:     string[]
  note?:         string
}

// ── Builds ────────────────────────────────────────────────────────────────────
// All builds use exactly 81 points (max level).
// Prerequisite rule: a skill only needs ≥1 rank in its required skill (not max).
// Tier gates per branch: tier 2 → 15 pts · capstone → 36 pts

export const BUILDS: Build[] = [

  // ── META 1: Movilidad (más usada) ─────────────────────────────────────────
  // Exact build from arcskilltree.com/taxi2g — Mobility 81p
  // Conditioning 18  |  Mobility 38  |  Survival 25  = 81
  {
    id:            'meta-movilidad',
    name:          'Movilidad Total',
    subtitle:      'La build más usada del meta',
    category:      'meta',
    description:   'La build más popular de la comunidad. Domina la movilidad con ambos capstones de vaulting y Heroic Leap maxeado, mientras mantiene la base de saqueo con Broad Shoulders y Looter\'s Luck.',
    playstyle:     ['Más popular', 'Rotación rápida', 'PvP + Saqueo'],
    primaryBranch: 'mobility',
    keySkills:     ['vaults-on-vaults', 'vault-spring', 'heroic-leap', 'vigorous-vaulter', 'broad-shoulders'],
    allocation: {
      // ── Conditioning 18 ─────────────────────────────────────────────────
      'used-to-weight':    5,
      'blast-born':        1,   // req: used-to-weight ✓
      'gentle-pressure':   1,   // req: used-to-weight ✓
      'fight-or-flight':   5,   // req: blast-born ≥1   ✓  → 12 pts...
      'proficient-pryer':  3,   // req: gentle-pressure ≥1 ✓  → 15 pts, tier 2 open
      'unburdened-roll':   1,   // req: proficient-pryer ≥1 ✓
      'a-little-extra':    1,   // req: unburdened-roll ✓
      'loaded-arms':       1,   // req: a-little-extra ✓
      // ── Mobility 38 ─────────────────────────────────────────────────────
      'nimble-climber':    5,
      'marathon-runner':   5,   // req: nimble-climber ✓
      'slip-and-slide':    1,   // req: nimble-climber ✓
      'youthful-lungs':    5,   // req: marathon-runner ✓
      'sturdy-ankles':     2,   // req: slip-and-slide ≥1 ✓  → 18 pts, tier 2 open
      'carry-momentum':    1,   // req: youthful-lungs ✓
      'calming-stroll':    1,   // req: sturdy-ankles ≥1 ✓
      'effortless-roll':   5,   // req: carry-momentum ✓
      'crawl-before-walk': 5,   // req: carry-momentum ✓
      'heroic-leap':       5,   // req: effortless-roll ✓  → 36 pts, capstone open
      'vigorous-vaulter':  1,   // req: crawl-before-walk ✓
      'vaults-on-vaults':  1,   // capstone ✓
      'vault-spring':      1,   // capstone ✓
      // ── Survival 25 ─────────────────────────────────────────────────────
      'agile-croucher':    5,
      'looters-instincts': 5,   // req: agile-croucher ✓
      'silent-scavenger':  5,   // req: looters-instincts ✓  → 15 pts, tier 2 open
      'suffer-in-silence': 1,   // req: silent-scavenger ✓
      'broad-shoulders':   5,   // req: suffer-in-silence ✓
      'looters-luck':      4,   // req: broad-shoulders ✓
    },
  },

  // ── META 2: Breach (más rentable) ─────────────────────────────────────────
  // Exact build from arcskilltree.com/taxi2g — Breach 81p
  // Conditioning 18  |  Mobility 26  |  Survival 37  = 81
  {
    id:            'meta-breach',
    name:          'Security Breach',
    subtitle:      'La build más rentable',
    category:      'meta',
    description:   'La build más rentable del juego: desbloquea Security Breach para forzar taquillas de seguridad con botín premium que otros jugadores no pueden abrir. Combina movilidad funcional con el mejor loot posible.',
    playstyle:     ['Más rentable', 'Saqueo premium', 'Exploración'],
    primaryBranch: 'survival',
    keySkills:     ['security-breach', 'broad-shoulders', 'looters-luck', 'three-deep-breaths', 'traveling-tinkerer'],
    allocation: {
      // ── Conditioning 18 ─────────────────────────────────────────────────
      'used-to-weight':    5,
      'blast-born':        1,   // req: used-to-weight ✓
      'gentle-pressure':   1,   // req: used-to-weight ✓
      'fight-or-flight':   3,   // req: blast-born ≥1   ✓
      'proficient-pryer':  5,   // req: gentle-pressure ≥1 ✓  → 15 pts, tier 2 open
      'unburdened-roll':   1,   // req: proficient-pryer ✓
      'a-little-extra':    1,   // req: unburdened-roll ✓
      'loaded-arms':       1,   // req: a-little-extra ✓
      // ── Mobility 26 ─────────────────────────────────────────────────────
      'nimble-climber':    3,
      'marathon-runner':   5,   // req: nimble-climber ≥1 ✓
      'slip-and-slide':    1,   // req: nimble-climber ≥1 ✓
      'youthful-lungs':    5,   // req: marathon-runner ✓
      'sturdy-ankles':     1,   // req: slip-and-slide ≥1 ✓  → 15 pts, tier 2 open
      'carry-momentum':    1,   // req: youthful-lungs ✓
      'calming-stroll':    1,   // req: sturdy-ankles ≥1 ✓
      'effortless-roll':   4,   // req: carry-momentum ✓
      'crawl-before-walk': 4,   // req: carry-momentum ✓
      'vigorous-vaulter':  1,   // req: crawl-before-walk ≥1 ✓
      // ── Survival 37 ─────────────────────────────────────────────────────
      'agile-croucher':    3,
      'looters-instincts': 5,   // req: agile-croucher ≥1 ✓
      'revitalizing-squat':1,   // req: agile-croucher ≥1 ✓
      'silent-scavenger':  5,   // req: looters-instincts ✓  → 14 tier-1 pts...
      'in-round-crafting': 1,   // req: revitalizing-squat ≥1 ✓  → 15 pts, tier 2 open
      'suffer-in-silence': 1,   // req: silent-scavenger ✓
      'good-as-new':       1,   // req: in-round-crafting ✓
      'broad-shoulders':   5,   // req: suffer-in-silence ✓
      'traveling-tinkerer':1,   // req: suffer-in-silence ✓
      'stubborn-mule':     2,   // req: good-as-new ✓
      'looters-luck':      5,   // req: broad-shoulders ✓
      'one-raiders-scraps':1,   // req: traveling-tinkerer ✓
      'three-deep-breaths':5,   // req: stubborn-mule ≥1 ✓  → 36 pts total, capstone open
      'security-breach':   1,   // capstone ✓
    },
  },

  // ── CREATOR: Tfue ─────────────────────────────────────────────────────────
  // Exact build from arcskilltree.com/tfue
  // Conditioning 27  |  Mobility 27  |  Survival 27  = 81
  {
    id:            'creator-tfue',
    name:          'Build de Tfue',
    subtitle:      '27 / 27 / 27 — Perfectly Balanced',
    category:      'creator',
    creator: {
      name:     'Tfue',
      handle:   'Tfue',
      platform: 'twitch',
    },
    description:   'La build de Tfue es un reparto exactamente igualado: 27 puntos en cada rama. Maximiza la movilidad de combate con Crawl Before You Walk y Vigorous Vaulter, la resistencia con Turtle Crawl y el saqueo con Looter\'s Luck al máximo.',
    playstyle:     ['Equilibrado', 'PvP', 'Movilidad de combate'],
    primaryBranch: 'mobility',
    keySkills:     ['vigorous-vaulter', 'crawl-before-walk', 'turtle-crawl', 'looters-luck', 'broad-shoulders'],
    allocation: {
      // ── Conditioning 27 ─────────────────────────────────────────────────
      'used-to-weight':    5,
      'blast-born':        1,   // req: used-to-weight ✓
      'gentle-pressure':   1,   // req: used-to-weight ✓
      'fight-or-flight':   5,   // req: blast-born ≥1   ✓
      'proficient-pryer':  5,   // req: gentle-pressure ≥1 ✓  → 17 pts, tier 2 open
      'survivors-stamina': 1,   // req: fight-or-flight ✓
      'unburdened-roll':   1,   // req: proficient-pryer ✓
      'downed-determined': 1,   // req: survivors-stamina ✓
      'a-little-extra':    1,   // req: unburdened-roll ✓
      'turtle-crawl':      5,   // req: downed-determined ≥1 ✓
      'loaded-arms':       1,   // req: a-little-extra ✓
      // ── Mobility 27 ─────────────────────────────────────────────────────
      'nimble-climber':    5,
      'marathon-runner':   5,   // req: nimble-climber ✓
      'youthful-lungs':    5,   // req: marathon-runner ✓   → 15 pts, tier 2 open
      'carry-momentum':    1,   // req: youthful-lungs ✓
      'effortless-roll':   5,   // req: carry-momentum ✓
      'crawl-before-walk': 5,   // req: carry-momentum ✓
      'vigorous-vaulter':  1,   // req: crawl-before-walk ✓
      // ── Survival 27 ─────────────────────────────────────────────────────
      'agile-croucher':    5,
      'looters-instincts': 5,   // req: agile-croucher ✓
      'revitalizing-squat':3,   // req: agile-croucher ✓
      'silent-scavenger':  1,   // req: looters-instincts ✓
      'in-round-crafting': 1,   // req: revitalizing-squat ≥1 ✓
      'suffer-in-silence': 1,   // req: silent-scavenger ≥1 ✓
      'good-as-new':       1,   // req: in-round-crafting ✓
      'broad-shoulders':   5,   // req: suffer-in-silence ✓
      'looters-luck':      5,   // req: broad-shoulders ✓
    },
  },
]

export function encodeBuildParam(allocation: BuildAllocation): string {
  return btoa(JSON.stringify(allocation))
}
