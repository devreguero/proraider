const W = 'https://arcraiders.wiki/w/images'

export type AttachmentSlot = 'Bocacha' | 'Empuñadura' | 'Culata' | 'Cargador' | 'Módulo'

export type Attachment = {
  name:   string
  slot:   AttachmentSlot
  icon:   string
  bonus:  string
}

// ─── Catálogo completo de attachments ────────────────────────────────────────

export const ATTACHMENTS: Record<string, Attachment> = {
  // Bocachas genéricas
  'Compensator I':   { name: 'Compensator I',   slot: 'Bocacha',    icon: `${W}/5/5f/Compensator_I.png`,    bonus: '-20% dispersión por disparo, -10% dispersión máxima' },
  'Compensator II':  { name: 'Compensator II',  slot: 'Bocacha',    icon: `${W}/0/0a/Compensator_II.png`,   bonus: '-40% dispersión por disparo, -20% dispersión máxima' },
  'Compensator III': { name: 'Compensator III', slot: 'Bocacha',    icon: `${W}/a/af/Compensator_III.png`,  bonus: '-60% dispersión por disparo, -30% dispersión máxima' },
  'Extended Barrel': { name: 'Extended Barrel', slot: 'Bocacha',    icon: `${W}/2/2f/Extended_Barrel.png`,  bonus: '+25% velocidad de bala, +15% retroceso vertical' },
  'Muzzle Brake I':  { name: 'Muzzle Brake I',  slot: 'Bocacha',    icon: `${W}/4/4f/Muzzle_Brake_I.png`,  bonus: '-15% retroceso horizontal y vertical' },
  'Muzzle Brake II': { name: 'Muzzle Brake II', slot: 'Bocacha',    icon: `${W}/2/23/Muzzle_Brake_II.png`, bonus: '-20% retroceso horizontal y vertical' },
  'Muzzle Brake III':{ name: 'Muzzle Brake III',slot: 'Bocacha',    icon: `${W}/a/a2/Muzzle_Brake_III.png`,bonus: '-25% retroceso horizontal y vertical' },
  'Silencer I':      { name: 'Silencer I',      slot: 'Bocacha',    icon: `${W}/f/f7/Silencer_I.png`,      bonus: '-20% ruido de disparo' },
  'Silencer II':     { name: 'Silencer II',     slot: 'Bocacha',    icon: `${W}/c/c0/Silencer_II.png`,     bonus: '-40% ruido de disparo' },
  'Silencer III':    { name: 'Silencer III',    slot: 'Bocacha',    icon: `${W}/3/3e/Silencer_III.png`,    bonus: '-60% ruido de disparo' },
  // Bocachas escopeta
  'Shotgun Choke I':  { name: 'Shotgun Choke I',  slot: 'Bocacha', icon: `${W}/0/07/Shotgun_Choke_I.png`,  bonus: '-10% dispersión base' },
  'Shotgun Choke II': { name: 'Shotgun Choke II', slot: 'Bocacha', icon: `${W}/6/63/Shotgun_Choke_II.png`, bonus: '-20% dispersión base' },
  'Shotgun Choke III':{ name: 'Shotgun Choke III',slot: 'Bocacha', icon: `${W}/3/36/Shotgun_Choke_III.png`,bonus: '-30% dispersión base' },
  'Shotgun Silencer': { name: 'Shotgun Silencer', slot: 'Bocacha', icon: `${W}/4/4d/Shotgun_Silencer.png`, bonus: '-50% ruido de disparo' },
  // Empuñaduras
  'Angled Grip I':    { name: 'Angled Grip I',    slot: 'Empuñadura', icon: `${W}/b/b5/Angled_Grip_I.png`,    bonus: '-20% retroceso horizontal' },
  'Angled Grip II':   { name: 'Angled Grip II',   slot: 'Empuñadura', icon: `${W}/2/2b/Angled_Grip_II.png`,   bonus: '-30% retroceso horizontal' },
  'Angled Grip III':  { name: 'Angled Grip III',  slot: 'Empuñadura', icon: `${W}/0/0f/Angled_Grip_III.png`,  bonus: '-40% retroceso horizontal, -30% velocidad ADS' },
  'Horizontal Grip':  { name: 'Horizontal Grip',  slot: 'Empuñadura', icon: `${W}/8/89/Horizontal_Grip.png`,  bonus: '-30% retroceso horiz. y vert., -30% velocidad ADS' },
  'Vertical Grip I':  { name: 'Vertical Grip I',  slot: 'Empuñadura', icon: `${W}/4/4d/Vertical_Grip_I.png`,  bonus: '-20% retroceso vertical' },
  'Vertical Grip II': { name: 'Vertical Grip II', slot: 'Empuñadura', icon: `${W}/3/3c/Vertical_Grip_II.png`, bonus: '-30% retroceso vertical' },
  'Vertical Grip III':{ name: 'Vertical Grip III',slot: 'Empuñadura', icon: `${W}/2/20/Vertical_Grip_III.png`,bonus: '-40% retroceso vertical, -30% velocidad ADS' },
  // Culatas
  'Kinetic Converter': { name: 'Kinetic Converter', slot: 'Culata', icon: `${W}/7/71/Kinetic_Converter.png`, bonus: '+15% cadencia de fuego, +20% retroceso' },
  'Lightweight Stock': { name: 'Lightweight Stock', slot: 'Culata', icon: `${W}/c/cb/Lightweight_Stock.png`, bonus: '+200% velocidad ADS, -30% tiempo equipar, +50% retroceso' },
  'Padded Stock':      { name: 'Padded Stock',      slot: 'Culata', icon: `${W}/4/4b/Padded_Stock.png`,      bonus: 'Reduce el retroceso percibido y mejora el control' },
  'Stable Stock I':    { name: 'Stable Stock I',    slot: 'Culata', icon: `${W}/8/8d/Stable_Stock_I.png`,    bonus: '-20% tiempo recuperación retroceso y dispersión' },
  'Stable Stock II':   { name: 'Stable Stock II',   slot: 'Culata', icon: `${W}/b/b4/Stable_Stock_II.png`,   bonus: '-35% tiempo recuperación retroceso y dispersión' },
  'Stable Stock III':  { name: 'Stable Stock III',  slot: 'Culata', icon: `${W}/e/eb/Stable_Stock_III.png`,  bonus: '-50% tiempo recuperación, +20% tiempo equipar' },
  // Cargadores — luz
  'Extended Light Mag I':   { name: 'Extended Light Mag I',   slot: 'Cargador', icon: `${W}/2/23/Extended_Light_Mag_I.png`,   bonus: '+5 balas en cargador' },
  'Extended Light Mag II':  { name: 'Extended Light Mag II',  slot: 'Cargador', icon: `${W}/c/cf/Extended_Light_Mag_II.png`,  bonus: '+10 balas en cargador' },
  'Extended Light Mag III': { name: 'Extended Light Mag III', slot: 'Cargador', icon: `${W}/4/40/Extended_Light_Mag_III.png`, bonus: '+15 balas en cargador' },
  // Cargadores — medio
  'Extended Medium Mag I':   { name: 'Extended Medium Mag I',   slot: 'Cargador', icon: `${W}/4/44/Extended_Medium_Mag_I.png`,   bonus: '+4 balas en cargador' },
  'Extended Medium Mag II':  { name: 'Extended Medium Mag II',  slot: 'Cargador', icon: `${W}/5/50/Extended_Medium_Mag_II.png`,  bonus: '+8 balas en cargador' },
  'Extended Medium Mag III': { name: 'Extended Medium Mag III', slot: 'Cargador', icon: `${W}/a/a1/Extended_Medium_Mag_III.png`, bonus: '+12 balas en cargador' },
  // Cargadores — escopeta
  'Extended Shotgun Mag I':   { name: 'Extended Shotgun Mag I',   slot: 'Cargador', icon: `${W}/9/9b/Extended_Shotgun_Mag_I.png`,   bonus: '+2 cartuchos en cargador' },
  'Extended Shotgun Mag II':  { name: 'Extended Shotgun Mag II',  slot: 'Cargador', icon: `${W}/4/4f/Extended_Shotgun_Mag_II.png`,  bonus: '+4 cartuchos en cargador' },
  'Extended Shotgun Mag III': { name: 'Extended Shotgun Mag III', slot: 'Cargador', icon: `${W}/7/77/Extended_Shotgun_Mag_III.png`, bonus: '+6 cartuchos en cargador' },
  // Módulos especiales
  'Anvil Splitter': { name: 'Anvil Splitter', slot: 'Módulo', icon: `${W}/e/ef/Anvil_Splitter.png`, bonus: '+3 proyectiles, -70% daño por proyectil' },
}

// ─── Mejor build por arma ─────────────────────────────────────────────────────

export type WeaponBuild = {
  weaponSlug:  string
  playstyle:   string
  note:        string
  attachments: Attachment[]
}

function a(key: string): Attachment {
  const att = ATTACHMENTS[key]
  if (!att) throw new Error(`Attachment not found: ${key}`)
  return att
}

export const WEAPON_BUILDS: WeaponBuild[] = [
  {
    weaponSlug: 'kettle',
    playstyle:  'Control y precisión',
    note: 'Build equilibrado para SMG. El Compensator reduce la dispersión en ráfagas cortas y el Stable Stock acelera la recuperación entre disparos.',
    attachments: [a('Compensator II'), a('Angled Grip II'), a('Stable Stock II'), a('Extended Light Mag II')],
  },
  {
    weaponSlug: 'rattler',
    playstyle:  'Pistola de combate cercano',
    note: 'La Rattler tiene slots limitados. El Compensator mejora la precisión y el Stable Stock reduce el tiempo de recuperación entre disparos rápidos.',
    attachments: [a('Compensator I'), a('Angled Grip I'), a('Stable Stock II')],
  },
  {
    weaponSlug: 'arpeggio',
    playstyle:  'Largo alcance / Tirador',
    note: 'Maximiza la precisión a distancia. El Compensator III combinado con el Stable Stock III convierte el Arpeggio en un tirador de élite con mínima dispersión.',
    attachments: [a('Compensator III'), a('Angled Grip II'), a('Stable Stock III'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'tempest',
    playstyle:  'Asalto agresivo',
    note: 'El Padded Stock compensa el retroceso de la alta cadencia. El Compensator III garantiza que cada ráfaga llegue al objetivo.',
    attachments: [a('Compensator III'), a('Angled Grip III'), a('Padded Stock'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'bettina',
    playstyle:  'Escopeta de asalto',
    note: 'El Muzzle Brake III reduce el retroceso brutal de la Bettina. El Padded Stock complementa para mantener el control entre disparos consecutivos.',
    attachments: [a('Muzzle Brake III'), a('Angled Grip III'), a('Padded Stock'), a('Extended Shotgun Mag II')],
  },
  {
    weaponSlug: 'ferro',
    playstyle:  'Francotirador sigiloso',
    note: 'El Silencer es esencial en el Ferro para no revelar posición. El Stable Stock II mejora el tiempo de recuperación entre disparos a larga distancia.',
    attachments: [a('Silencer II'), a('Stable Stock II')],
  },
  {
    weaponSlug: 'renegade',
    playstyle:  'Asalto de daño sostenido',
    note: 'El Muzzle Brake III domina el retroceso del Renegade en ráfagas largas. El Stable Stock III minimiza el tiempo muerto entre rafagaas.',
    attachments: [a('Muzzle Brake III'), a('Stable Stock III'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'aphelion',
    playstyle:  'LMG de supresión',
    note: 'El Angled Grip III controla el retroceso horizontal durante el fuego sostenido. El Stable Stock III reduce los tiempos de recuperación entre ráfagas.',
    attachments: [a('Angled Grip III'), a('Stable Stock III'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'stitcher',
    playstyle:  'Asalto alta cadencia',
    note: 'El Kinetic Converter potencia la ya alta cadencia del Stitcher. El Compensator III y el Vertical Grip III mantienen la precisión a esa velocidad.',
    attachments: [a('Compensator III'), a('Vertical Grip III'), a('Kinetic Converter'), a('Extended Light Mag III')],
  },
  {
    weaponSlug: 'canto',
    playstyle:  'Control de retroceso',
    note: 'Build enfocado en estabilizar el Canto para combate a media distancia. El Stable Stock II reduce los tiempos de recuperación entre ráfagas.',
    attachments: [a('Compensator II'), a('Vertical Grip II'), a('Stable Stock II'), a('Extended Medium Mag II')],
  },
  {
    weaponSlug: 'bobcat',
    playstyle:  'LMG / Fuego de supresión',
    note: 'El Kinetic Converter lleva al Bobcat al límite de su cadencia. Compensator III y Vertical Grip III impiden que el arma se descontrole.',
    attachments: [a('Compensator III'), a('Vertical Grip III'), a('Kinetic Converter'), a('Extended Light Mag III')],
  },
  {
    weaponSlug: 'il-toro',
    playstyle:  'Escopeta táctica',
    note: 'El Shotgun Choke II concentra el patrón de perdigones para mayor efectividad a media distancia. El Lightweight Stock mejora el tiempo de reacción.',
    attachments: [a('Shotgun Choke II'), a('Vertical Grip II'), a('Lightweight Stock'), a('Extended Shotgun Mag II')],
  },
  {
    weaponSlug: 'vulcano',
    playstyle:  'Escopeta automática',
    note: 'El Kinetic Converter aprovecha la acción semi-auto del Vulcano. El Shotgun Choke III mantiene la precisión del patrón a mayor distancia.',
    attachments: [a('Shotgun Choke III'), a('Vertical Grip III'), a('Kinetic Converter'), a('Extended Shotgun Mag III')],
  },
  {
    weaponSlug: 'dolabra',
    playstyle:  'Asalto equilibrado',
    note: 'Build versátil para el Dolabra. El Compensator II y el Stable Stock II ofrecen un equilibrio entre precisión y velocidad de recuperación.',
    attachments: [a('Compensator II'), a('Angled Grip II'), a('Stable Stock II'), a('Extended Medium Mag II')],
  },
  {
    weaponSlug: 'anvil',
    playstyle:  'Pistola de alto daño',
    note: 'El Compensator III maximiza la precisión del Anvil en cada disparo individual. Esencial dado su baja cadencia y alto daño por bala.',
    attachments: [a('Compensator III')],
  },
  {
    weaponSlug: 'torrente',
    playstyle:  'Escopeta de cadencia rápida',
    note: 'El Kinetic Converter es el attachment definitivo del Torrente. Compensator III mantiene los patrones concentrados a distancias medias.',
    attachments: [a('Compensator III'), a('Kinetic Converter'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'osprey',
    playstyle:  'DMR / Francotirador semi-auto',
    note: 'El Extended Barrel aumenta la velocidad de bala para mayor efectividad a larga distancia. El Lightweight Stock mejora el tiempo de apuntado entre disparos.',
    attachments: [a('Extended Barrel'), a('Lightweight Stock'), a('Extended Medium Mag II')],
  },
  {
    weaponSlug: 'jupiter',
    playstyle:  'Asalto pesado',
    note: 'El Muzzle Brake III reduce el retroceso del Jupiter en ráfagas largas. El Stable Stock III minimiza el tiempo entre ráfagas para máximo DPS.',
    attachments: [a('Muzzle Brake III'), a('Vertical Grip II'), a('Stable Stock III'), a('Extended Medium Mag III')],
  },
  {
    weaponSlug: 'hullcracker',
    playstyle:  'Escopeta de penetración',
    note: 'El Lightweight Stock mejora drásticamente el tiempo de apuntado del Hullcracker. El Vertical Grip II controla el retroceso hacia abajo entre disparos.',
    attachments: [a('Vertical Grip II'), a('Lightweight Stock')],
  },
]

export function getBuildForWeapon(slug: string): WeaponBuild | undefined {
  return WEAPON_BUILDS.find((b) => b.weaponSlug === slug)
}

export const SLOT_COLORS: Record<AttachmentSlot, string> = {
  'Bocacha':    'text-orange-400  border-orange-400/25  bg-orange-400/8',
  'Empuñadura': 'text-blue-400    border-blue-400/25    bg-blue-400/8',
  'Culata':     'text-purple-400  border-purple-400/25  bg-purple-400/8',
  'Cargador':   'text-green-400   border-green-400/25   bg-green-400/8',
  'Módulo':     'text-amber-400   border-amber-400/25   bg-amber-400/8',
}
