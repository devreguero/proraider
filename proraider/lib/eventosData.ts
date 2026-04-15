export type EventType = 'boss' | 'ambiental' | 'exploracion' | 'misión' | 'recursos'

export type MapEvent = {
  id: string
  name: string
  type: EventType
  description: string
  tip: string
  reward?: string
}

export type GameMap = {
  id: string
  name: string
  subtitle: string
  color: string
  textClass: string
  borderClass: string
  bgClass: string
  events: MapEvent[]
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  boss:        'Boss',
  ambiental:   'Ambiental',
  exploracion: 'Exploración',
  misión:      'Misión',
  recursos:    'Recursos',
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  boss:        'text-red-400 bg-red-400/10 border-red-400/25',
  ambiental:   'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  exploracion: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  misión:      'text-violet-400 bg-violet-400/10 border-violet-400/25',
  recursos:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
}

export const MAPS: GameMap[] = [
  {
    id: 'dam',
    name: 'Dam Battlegrounds',
    subtitle: 'Mapa industrial con zona de pantano al norte',
    color: '#60a5fa',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-400/25',
    bgClass: 'bg-blue-400/8',
    events: [
      {
        id: 'toxic-swamp',
        name: 'Toxic Swamp',
        type: 'ambiental',
        description: 'La zona norte del mapa queda cubierta por gas tóxico. Moverse sin protección causa daño continuo.',
        tip: 'Lleva un respirador o evita la zona norte hasta que termine. Los ARC en esta zona también se ven afectados.',
        reward: 'Materiales Topside de alta rareza en la zona tóxica',
      },
      {
        id: 'open-arc-probes',
        name: 'Open ARC Probes',
        type: 'misión',
        description: 'Sondas ARC aparecen en el mapa y deben ser activadas antes de que los enemigos las aseguren.',
        tip: 'Actúa rápido — las sondas tienen temporizador. Prioriza las más alejadas del spawn principal.',
        reward: 'Loot especial de sonda + progreso de expedición',
      },
      {
        id: 'harvester',
        name: 'Harvester',
        type: 'boss',
        description: 'Aparece el Harvester, una unidad ARC pesada con armadura avanzada y ataques de área.',
        tip: 'Flanquea desde ambos lados y evita su cono de fuego frontal. Los apilados de equipo mueren muy rápido.',
        reward: 'Drop garantizado de materiales Rare/Epic + posible blueprint',
      },
      {
        id: 'matriarch-dam',
        name: 'Matriarch',
        type: 'boss',
        description: 'La Matriarch ARC aparece cerca de la presa. Boss de alto nivel con fase de vuelo.',
        tip: 'Necesitas armadura completa y al menos Vita Shot. En fase 2 usa el terreno para cubrirte de los proyectiles.',
        reward: 'Matriarch Reactor (drop legendario) + loot de alto nivel',
      },
      {
        id: 'night-raid',
        name: 'Night Raid',
        type: 'ambiental',
        description: 'El mapa cambia a condición nocturna. Visibilidad reducida, pero los ARC aumentan su actividad.',
        tip: 'Usa el movimiento sigiloso. Los enemigos tienen visión reducida también, aprovéchalo para flanquear.',
        reward: 'Mayor spawn de materiales ARC raros durante la noche',
      },
    ],
  },
  {
    id: 'spaceport',
    name: 'Spaceport',
    subtitle: 'Puerto espacial con zonas verticales y almacenes',
    color: '#a78bfa',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-400/25',
    bgClass: 'bg-violet-400/8',
    events: [
      {
        id: 'launch-tower-loot',
        name: 'Launch Tower Loot',
        type: 'exploracion',
        description: 'Se abre el acceso a la torre de lanzamiento con loot de alta rareza. Ventana de tiempo limitada.',
        tip: 'La torre tiene múltiples plantas — empieza por arriba y baja. Otros jugadores también irán.',
        reward: 'Loot Rare/Epic concentrado + materiales Topside',
      },
      {
        id: 'prospecting-probes',
        name: 'Prospecting Probes',
        type: 'exploracion',
        description: 'Sondas de prospección ARC aterrizan en el mapa. Contienen materiales y datos valiosos.',
        tip: 'Las sondas aparecen en zonas abiertas — vigila el sky para localizarlas al caer.',
        reward: 'Materiales Topside + ARC Powercell avanzados',
      },
      {
        id: 'open-arc-probes-space',
        name: 'Open ARC Probes',
        type: 'misión',
        description: 'Sondas ARC a lo largo del spaceport deben ser activadas. Evento de misión con temporizador.',
        tip: 'El spaceport tiene rutas largas — usa el Zipline si tienes. Coordina con el equipo las sondas más lejanas.',
        reward: 'Loot especial de sonda + progreso de expedición',
      },
      {
        id: 'electromagnetic-storm',
        name: 'Electromagnetic Storm',
        type: 'ambiental',
        description: 'Tormenta electromagnética que desactiva temporalmente escudos y habilidades electrónicas.',
        tip: 'Sin escudo eres mucho más vulnerable. Juega conservador y usa cobertura física.',
        reward: 'Al terminar, spawn de materiales ARC raros en zonas expuestas',
      },
      {
        id: 'matriarch-space',
        name: 'Matriarch',
        type: 'boss',
        description: 'La Matriarch ARC aparece en los hangares del spaceport. Zona cerrada — sin escapatoria fácil.',
        tip: 'El hangar limita el movimiento. Usa las columnas para romper su línea de visión en fase 2.',
        reward: 'Matriarch Reactor (drop legendario) + loot de alto nivel',
      },
    ],
  },
  {
    id: 'buried-city',
    name: 'Buried City',
    subtitle: 'Ciudad subterránea con combate en espacios cerrados',
    color: '#f97316',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-400/25',
    bgClass: 'bg-orange-400/8',
    events: [
      {
        id: 'hidden-bunker',
        name: 'Hidden Bunker',
        type: 'exploracion',
        description: 'Se revela la ubicación de un búnker secreto con loot de alto valor. Disponible por tiempo limitado.',
        tip: 'El búnker puede tener trampas y guardianes ARC. Lleva equipo de explosivos para abrirte paso.',
        reward: 'Loot concentrado de alta rareza + posibles blueprints',
      },
      {
        id: 'cold-snap',
        name: 'Cold Snap',
        type: 'ambiental',
        description: 'Bajada brusca de temperatura. El frío extremo ralentiza el movimiento y drena el escudo.',
        tip: 'Mantente en movimiento para generar calor. Las zonas interiores del mapa tienen temperatura normal.',
        reward: 'Recursos de naturaleza especiales disponibles durante el frío',
      },
      {
        id: 'close-scrutiny',
        name: 'Close Scrutiny',
        type: 'misión',
        description: 'ARC aumenta su presencia de vigilancia. Torretas adicionales y patrullas reforzadas en la ciudad.',
        tip: 'Muévete con más sigilo y evita las zonas abiertas. Las torretas tienen puntos ciegos — identifícalos.',
        reward: 'Los guardianes de vigilancia dropean equipamiento mejorado',
      },
      {
        id: 'harvester-city',
        name: 'Harvester',
        type: 'boss',
        description: 'El Harvester patrulla los túneles de la ciudad. Espacio estrecho — combate muy peligroso.',
        tip: 'En espacios cerrados sus ataques de área son letales. Usa granadas de humo para cubrirte.',
        reward: 'Drop garantizado de materiales Rare/Epic + posible blueprint',
      },
      {
        id: 'night-raid-city',
        name: 'Night Raid',
        type: 'ambiental',
        description: 'La ya oscura ciudad queda completamente a oscuras. Los ARC cambian a modo de combate nocturno.',
        tip: 'En la ciudad enterrada la oscuridad es total. Usa luces químicas para marcar rutas de escape.',
        reward: 'Mayor spawn de materiales ARC raros durante la noche',
      },
    ],
  },
  {
    id: 'blue-gate',
    name: 'Blue Gate',
    subtitle: 'Mapa de transición con zona boscosa y construcciones',
    color: '#34d399',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-400/25',
    bgClass: 'bg-emerald-400/8',
    events: [
      {
        id: 'lush-bloom',
        name: 'Lush Bloom',
        type: 'recursos',
        description: 'Florecimiento en las zonas boscosas. Plantas y recursos naturales raros brotan en el mapa.',
        tip: 'La zona boscosa del norte concentra la mayor densidad de spawns. Lleva inventario libre.',
        reward: 'Plantas raras, Great Mullein, Moss, Candleberry en abundancia',
      },
      {
        id: 'locked-gate',
        name: 'Locked Gate',
        type: 'misión',
        description: 'Puertas y accesos bloqueados se abren brevemente durante el evento. Zonas con loot especial.',
        tip: 'Las puertas tienen temporizador. Identifica las de mayor valor antes de que empiece el evento.',
        reward: 'Loot de zona restringida + posibles llaves adicionales',
      },
      {
        id: 'electromagnetic-storm-bg',
        name: 'Electromagnetic Storm',
        type: 'ambiental',
        description: 'Tormenta electromagnética en Blue Gate. Escudos desactivados y tecnología ARC alterada.',
        tip: 'Los ARC de patrulla también pierden sus escudos. Aprovecha para atacar objetivos que normalmente son difíciles.',
        reward: 'ARC sin escudo son más fáciles de eliminar — mejor ratio de loot',
      },
      {
        id: 'matriarch-bg',
        name: 'Matriarch',
        type: 'boss',
        description: 'La Matriarch ARC aparece en la zona central de Blue Gate. Terreno abierto con pocas coberturas.',
        tip: 'En terreno abierto, mantén distancia y usa el Barricade Kit para crear cobertura temporal.',
        reward: 'Matriarch Reactor (drop legendario) + loot de alto nivel',
      },
      {
        id: 'night-raid-bg',
        name: 'Night Raid',
        type: 'ambiental',
        description: 'El bosque de Blue Gate queda en oscuridad. Los ARC tienen patrullas nocturnas más agresivas.',
        tip: 'La vegetación densa ayuda a ocultarse. Muévete lento y usa las sombras a tu favor.',
        reward: 'Mayor spawn de materiales ARC raros durante la noche',
      },
    ],
  },
  {
    id: 'stella-montis',
    name: 'Stella Montis',
    subtitle: 'Complejo de investigación ARC en zona montañosa',
    color: '#f59e0b',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-400/25',
    bgClass: 'bg-amber-400/8',
    events: [
      {
        id: 'cold-snap-sm',
        name: 'Cold Snap',
        type: 'ambiental',
        description: 'En las alturas de Stella Montis el frío es extremo. El escudo se drena constantemente en exterior.',
        tip: 'El complejo interior mantiene temperatura. Planifica tus rutas para reducir tiempo al exterior.',
        reward: 'Recursos de naturaleza especiales disponibles durante el frío',
      },
      {
        id: 'hidden-bunker-sm',
        name: 'Hidden Bunker',
        type: 'exploracion',
        description: 'Los laboratorios de Stella Montis ocultan búnkeres con datos de investigación ARC.',
        tip: 'Busca paneles de acceso en las paredes de los laboratorios. Lleva llaves de Stella Montis.',
        reward: 'Datos de investigación + materiales de laboratorio de alta rareza',
      },
      {
        id: 'matriarch-sm',
        name: 'Matriarch',
        type: 'boss',
        description: 'La Matriarch aparece en el área central del complejo. Pasillos estrechos en interior.',
        tip: 'El complejo interior tiene muchos pasillos. El Defibrillator es clave si tu equipo cae.',
        reward: 'Matriarch Reactor (drop legendario) + loot de alto nivel',
      },
      {
        id: 'close-scrutiny-sm',
        name: 'Close Scrutiny',
        type: 'misión',
        description: 'El sistema de seguridad de Stella Montis se activa al máximo. Torretas y drones en todo el complejo.',
        tip: 'Las granadas EMP son esenciales aquí. Ten cuidado con los drones de techo en los laboratorios.',
        reward: 'Los sistemas de seguridad dropean componentes electrónicos avanzados',
      },
      {
        id: 'night-raid-sm',
        name: 'Night Raid',
        type: 'ambiental',
        description: 'El complejo entra en modo nocturno. Las luces de emergencia son la única fuente de luz.',
        tip: 'Los pasillos iluminados son trampas — muévete por zonas en penumbra. Los ARC tienen visión nocturna.',
        reward: 'Mayor spawn de materiales ARC raros durante la noche',
      },
    ],
  },
]
