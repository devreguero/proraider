export type SkillBranch = 'mobility' | 'conditioning' | 'survival'
export type SkillTier   = 1 | 2 | 'capstone'

export type Skill = {
  id:               string
  name:             string
  description:      string
  maxRanks:         number
  tier:             SkillTier
  branch:           SkillBranch
  requires?:        string
  minBranchPoints?: number
}

export const BRANCH_CONFIG = {
  mobility: {
    label:       'Movilidad',
    color:       '#f59e0b',
    textClass:   'text-amber-400',
    borderClass: 'border-amber-400/30',
    bgClass:     'bg-amber-400/10',
    fillClass:   'bg-amber-400',
    description: 'Movimiento, resistencia y desplazamiento táctico',
    icon:        'M13 10V3L4 14h7v7l9-11h-7z',
  },
  conditioning: {
    label:       'Acondicionamiento',
    color:       '#22c55e',
    textClass:   'text-green-400',
    borderClass: 'border-green-400/30',
    bgClass:     'bg-green-400/10',
    fillClass:   'bg-green-400',
    description: 'Resistencia física, escudos y combate',
    icon:        'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  survival: {
    label:       'Supervivencia',
    color:       '#ef4444',
    textClass:   'text-red-400',
    borderClass: 'border-red-400/30',
    bgClass:     'bg-red-400/10',
    fillClass:   'bg-red-400',
    description: 'Botín, crafteo y capacidad de carga',
    icon:        'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
} as const

// Branch-point gates per tier
export const TIER_MIN: Record<string | number, number> = {
  1:        0,
  2:        15,
  capstone: 36,
}

export const TOTAL_POINTS = 81

export const SKILLS: Skill[] = [
  // ─── MOVILIDAD ────────────────────────────────────────────────────────────────
  { id: 'nimble-climber',    branch: 'mobility', tier: 1,          maxRanks: 5, name: 'Nimble Climber',        description: 'Escala y supera obstáculos más rápido.' },
  { id: 'marathon-runner',   branch: 'mobility', tier: 1,          maxRanks: 5, name: 'Marathon Runner',       description: 'Moverse cuesta menos resistencia.',                   requires: 'nimble-climber'   },
  { id: 'slip-and-slide',    branch: 'mobility', tier: 1,          maxRanks: 5, name: 'Slip and Slide',        description: 'El deslizamiento es más largo y más rápido.',          requires: 'nimble-climber'   },
  { id: 'youthful-lungs',    branch: 'mobility', tier: 1,          maxRanks: 5, name: 'Youthful Lungs',        description: 'Aumenta tu reserva máxima de resistencia.',            requires: 'marathon-runner'  },
  { id: 'sturdy-ankles',     branch: 'mobility', tier: 1,          maxRanks: 5, name: 'Sturdy Ankles',         description: 'Reduce el daño de caídas no letales.',                 requires: 'slip-and-slide'   },
  { id: 'carry-momentum',    branch: 'mobility', tier: 2,          maxRanks: 1, name: 'Carry the Momentum',    description: 'Tras una esquiva en sprint, correr no consume resistencia brevemente.', requires: 'youthful-lungs' },
  { id: 'calming-stroll',    branch: 'mobility', tier: 2,          maxRanks: 1, name: 'Calming Stroll',        description: 'Regeneras resistencia al caminar como si estuvieras quieto.', requires: 'sturdy-ankles'  },
  { id: 'effortless-roll',   branch: 'mobility', tier: 2,          maxRanks: 5, name: 'Effortless Roll',       description: 'Las esquivas cuestan menos resistencia.',              requires: 'carry-momentum'   },
  { id: 'crawl-before-walk', branch: 'mobility', tier: 2,          maxRanks: 5, name: 'Crawl Before You Walk', description: 'Al ser derribado, te arrastras más rápido.',            requires: 'carry-momentum'   },
  { id: 'off-the-wall',      branch: 'mobility', tier: 2,          maxRanks: 5, name: 'Off The Wall',          description: 'El salto de pared cubre más distancia.',               requires: 'calming-stroll'   },
  { id: 'heroic-leap',       branch: 'mobility', tier: 2,          maxRanks: 5, name: 'Heroic Leap',           description: 'La esquiva en sprint cubre más distancia.',            requires: 'effortless-roll'  },
  { id: 'vigorous-vaulter',  branch: 'mobility', tier: 2,          maxRanks: 1, name: 'Vigorous Vaulter',      description: 'Superar obstáculos no se ralentiza al agotar la resistencia.', requires: 'crawl-before-walk' },
  { id: 'ready-to-roll',     branch: 'mobility', tier: 2,          maxRanks: 5, name: 'Ready to Roll',         description: 'La ventana para ejecutar una recuperación al caer es mayor.', requires: 'off-the-wall'  },
  { id: 'vaults-on-vaults',  branch: 'mobility', tier: 'capstone', maxRanks: 1, name: 'Vaults on Vaults',      description: 'Superar obstáculos ya no consume resistencia.' },
  { id: 'vault-spring',      branch: 'mobility', tier: 'capstone', maxRanks: 1, name: 'Vault Spring',          description: 'Puedes saltar al final de superar un obstáculo.' },

  // ─── ACONDICIONAMIENTO ────────────────────────────────────────────────────────
  { id: 'used-to-weight',    branch: 'conditioning', tier: 1,          maxRanks: 5, name: 'Used to the Weight',    description: 'Llevar escudo te ralentiza menos.' },
  { id: 'blast-born',        branch: 'conditioning', tier: 1,          maxRanks: 5, name: 'Blast-Born',             description: 'Tu oído se ve menos afectado por explosiones cercanas.',     requires: 'used-to-weight'    },
  { id: 'gentle-pressure',   branch: 'conditioning', tier: 1,          maxRanks: 5, name: 'Gentle Pressure',        description: 'Reduce el rango de sonido al abrir puertas y registrar cajas.', requires: 'used-to-weight' },
  { id: 'fight-or-flight',   branch: 'conditioning', tier: 1,          maxRanks: 5, name: 'Fight or Flight',        description: 'Al recibir daño en combate, recuperas resistencia.',          requires: 'blast-born'        },
  { id: 'proficient-pryer',  branch: 'conditioning', tier: 1,          maxRanks: 5, name: 'Proficient Pryer',       description: 'Registras y fuerzas puertas más rápido.',                    requires: 'gentle-pressure'   },
  { id: 'survivors-stamina', branch: 'conditioning', tier: 2,          maxRanks: 1, name: "Survivor's Stamina",     description: 'Cuando estás crítico, la resistencia se regenera más rápido.', requires: 'fight-or-flight'  },
  { id: 'unburdened-roll',   branch: 'conditioning', tier: 2,          maxRanks: 1, name: 'Unburdened Roll',        description: 'Si el escudo se rompe, la primera esquiva no cuesta resistencia.', requires: 'proficient-pryer' },
  { id: 'downed-determined', branch: 'conditioning', tier: 2,          maxRanks: 5, name: 'Downed but Determined',  description: 'Al ser derribado, tardas más en colapsar.',                   requires: 'survivors-stamina' },
  { id: 'a-little-extra',    branch: 'conditioning', tier: 2,          maxRanks: 1, name: 'A Little Extra',         description: 'Registrar objetos genera recursos adicionales.',              requires: 'unburdened-roll'   },
  { id: 'effortless-swing',  branch: 'conditioning', tier: 2,          maxRanks: 5, name: 'Effortless Swing',       description: 'Las habilidades cuerpo a cuerpo cuestan menos resistencia.',   requires: 'unburdened-roll'   },
  { id: 'turtle-crawl',      branch: 'conditioning', tier: 2,          maxRanks: 5, name: 'Turtle Crawl',           description: 'Mientras estás derribado, recibes menos daño.',               requires: 'downed-determined' },
  { id: 'loaded-arms',       branch: 'conditioning', tier: 2,          maxRanks: 1, name: 'Loaded Arms',            description: 'El peso de tus armas equipadas se reduce a la mitad.',        requires: 'a-little-extra'    },
  { id: 'sky-clearing-swing',branch: 'conditioning', tier: 2,          maxRanks: 5, name: 'Sky-Clearing Swing',     description: 'Haces más daño cuerpo a cuerpo a los drones.',                requires: 'effortless-swing'  },
  { id: 'back-on-your-feet', branch: 'conditioning', tier: 'capstone', maxRanks: 1, name: 'Back On Your Feet',      description: 'Cuando estás crítico, tu salud se regenera hasta cierto límite.' },
  { id: 'flyswatter',        branch: 'conditioning', tier: 'capstone', maxRanks: 1, name: 'Flyswatter',             description: 'Avispas y torretas pueden destruirse con un solo golpe cuerpo a cuerpo.' },

  // ─── SUPERVIVENCIA ────────────────────────────────────────────────────────────
  { id: 'agile-croucher',    branch: 'survival', tier: 1,          maxRanks: 5, name: 'Agile Croucher',         description: 'Tu velocidad de movimiento en cuclillas aumenta.' },
  { id: 'looters-instincts', branch: 'survival', tier: 1,          maxRanks: 5, name: "Looter's Instincts",     description: 'Los objetos se revelan mucho más rápido al registrar.',     requires: 'agile-croucher'      },
  { id: 'revitalizing-squat',branch: 'survival', tier: 1,          maxRanks: 5, name: 'Revitalizing Squat',     description: 'La regeneración de resistencia en cuclillas aumenta.',      requires: 'agile-croucher'      },
  { id: 'silent-scavenger',  branch: 'survival', tier: 1,          maxRanks: 5, name: 'Silent Scavenger',       description: 'Haces menos ruido al registrar objetos.',                   requires: 'looters-instincts'   },
  { id: 'in-round-crafting', branch: 'survival', tier: 1,          maxRanks: 1, name: 'In-Round Crafting',      description: 'Fabrica objetos topside: vendajes, escudos, trampas y granadas.', requires: 'revitalizing-squat' },
  { id: 'suffer-in-silence', branch: 'survival', tier: 2,          maxRanks: 1, name: 'Suffer in Silence',      description: 'Cuando estás crítico, tu movimiento hace menos ruido.',     requires: 'silent-scavenger'    },
  { id: 'good-as-new',       branch: 'survival', tier: 2,          maxRanks: 1, name: 'Good As New',            description: 'Bajo un efecto curativo, la regeneración de resistencia aumenta.', requires: 'in-round-crafting' },
  { id: 'broad-shoulders',   branch: 'survival', tier: 2,          maxRanks: 5, name: 'Broad Shoulders',        description: 'Aumenta tu peso de carga máximo (+2 kg por rango).',         requires: 'suffer-in-silence'   },
  { id: 'traveling-tinkerer',branch: 'survival', tier: 2,          maxRanks: 1, name: 'Traveling Tinkerer',     description: 'Desbloquea objetos adicionales de fabricación en campo.',    requires: 'suffer-in-silence'   },
  { id: 'stubborn-mule',     branch: 'survival', tier: 2,          maxRanks: 5, name: 'Stubborn Mule',          description: 'La regeneración de resistencia se penaliza menos con sobrepeso.', requires: 'good-as-new'      },
  { id: 'looters-luck',      branch: 'survival', tier: 2,          maxRanks: 5, name: "Looter's Luck",          description: 'Posibilidad de revelar el doble de objetos al registrar.',   requires: 'broad-shoulders'     },
  { id: 'one-raiders-scraps',branch: 'survival', tier: 2,          maxRanks: 5, name: "One Raider's Scraps",    description: 'Encuentras recursos al registrar contenedores de otros Raiders.', requires: 'traveling-tinkerer' },
  { id: 'three-deep-breaths',branch: 'survival', tier: 2,          maxRanks: 5, name: 'Three Deep Breaths',     description: 'Tras agotar la resistencia con una habilidad, te recuperas más rápido.', requires: 'stubborn-mule'  },
  { id: 'security-breach',   branch: 'survival', tier: 'capstone', maxRanks: 1, name: 'Security Breach',        description: 'Permite forzar taquillas de seguridad con botín premium.' },
  { id: 'minesweeper',       branch: 'survival', tier: 'capstone', maxRanks: 1, name: 'Minesweeper',            description: 'Puedes desactivar minas y explosivos desplegados cercanos.' },
]

export function getBranchPoints(allocated: Record<string, number>, branch: SkillBranch): number {
  return SKILLS
    .filter((s) => s.branch === branch)
    .reduce((sum, s) => sum + (allocated[s.id] ?? 0), 0)
}

export function getTotalPoints(allocated: Record<string, number>): number {
  return Object.values(allocated).reduce((a, b) => a + b, 0)
}
