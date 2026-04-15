export type GuideCategory = 'primeros-pasos' | 'tactica' | 'combate' | 'economia'

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  'primeros-pasos': 'Primeros pasos',
  'tactica':        'Táctica',
  'combate':        'Combate',
  'economia':       'Economía',
}

export const CATEGORY_COLORS: Record<GuideCategory, string> = {
  'primeros-pasos': '#4fc3ff',
  'tactica':        '#4ade80',
  'combate':        '#f87171',
  'economia':       '#facc15',
}

// SVG path(s) for each category icon (24×24 viewBox, stroke-based)
export const CATEGORY_ICONS: Record<GuideCategory, string> = {
  'primeros-pasos': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'tactica':        'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  'combate':        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'economia':       'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
}

// SVG d-attribute for each individual guide icon
export const GUIDE_ICONS: Record<string, string> = {
  'guia-del-principiante':          'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z',
  'como-funcionan-las-extracciones':'M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 14l5-5H9l3 5zm0-8l-5 5h3v5h4v-5h3l-5-5z',
  'movimiento-y-posicionamiento':   'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-8.5V7h2v4.5l3 1.73-1 1.73L11 13.5z',
  'jugar-en-squad':                 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 1a3 3 0 100-6 3 3 0 000 6zm4 9v-2a3 3 0 00-2.25-2.906',
  'tipos-de-arc-y-como-eliminarlos':'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'duelos-pvp-supervivencia':       'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M12 8v4m0 4h.01',
  'gestion-del-inventario':         'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  'crafting-y-progresion':          'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
}

export type GuideSection =
  | { type: 'text';    content: string }
  | { type: 'h2';      content: string }
  | { type: 'h3';      content: string }
  | { type: 'tip';     title: string; content: string }
  | { type: 'warning'; title: string; content: string }
  | { type: 'list';    title?: string; items: string[] }
  | { type: 'image';   src: string; alt: string; caption?: string }

export type Guide = {
  slug:       string
  title:      string
  description: string
  category:   GuideCategory
  heroImage:  string
  readTime:   number
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  sections:   GuideSection[]
}

export const GUIDES: Guide[] = [
  // ─── Primeros pasos ───────────────────────────────────────────────────────

  {
    slug:        'guia-del-principiante',
    title:       'Guía del principiante',
    description: 'Todo lo que necesitas saber para completar tu primera raid sin morir y volver al hideout con algo de loot.',
    category:    'primeros-pasos',
    heroImage:   'https://sht-vod.dn.nexoncdn.co.kr/shpd-comm/Media/AR/134_thumbnail_medium.png',
    readTime:    8,
    difficulty:  'Principiante',
    sections: [
      {
        type: 'text',
        content: 'ARC Raiders es un shooter de extracción PvPvE donde encarnas a un Raider que se infiltra en zonas controladas por máquinas ARC para recolectar recursos, craftear y progresar. Tu objetivo es entrar, lootearlo todo y salir con vida antes de que los ARCs o jugadores enemigos te eliminen.',
      },
      { type: 'h2', content: 'Antes de entrar al mapa' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/9/98/Speranza.png', alt: 'Speranza — el hideout', caption: 'Speranza, tu base de operaciones. Aquí preparas el loadout antes de cada raid.' },
      {
        type: 'text',
        content: 'Antes de desplegar, revisa tu inventario en el hideout. Lleva siempre al menos un kit médico, suficiente munición para tu arma principal y una secundaria de respaldo. Los recursos que lleves al mapa se pierden si mueres, así que no arriesgues tu mejor equipamiento en tus primeras raids.',
      },
      {
        type: 'tip',
        title: 'Kit mínimo de inicio',
        content: 'Arma principal + secundaria, 2 meds, munición para 2-3 encuentros. No más. El peso afecta tu movilidad.',
      },
      { type: 'h2', content: 'Primeros minutos en el mapa' },
      {
        type: 'text',
        content: 'Nada más spawnear, aleja del spawn cuanto antes. Otros jugadores también conocen las zonas de spawn y pueden tenderte una emboscada. Moverse rápido hacia el interior del mapa reduce el riesgo de PvP temprano.',
      },
      {
        type: 'list',
        title: 'Prioridades al entrar',
        items: [
          'Alejarte del spawn inmediatamente',
          'Orientarte con el mapa: identifica tu posición y la extracción más cercana',
          'Buscar Field Crates y Raider Caches en edificios cercanos',
          'Escuchar el ambiente: los ARCs emiten sonidos antes de detectarte',
        ],
      },
      { type: 'h2', content: 'El sistema de inventario y peso' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/3/35/Enelica_Dam_Wall.jpg', alt: 'Muro de la presa Enelica Dam', caption: 'Los mapas de ARC Raiders son entornos abiertos de gran escala — aprende a moverse por ellos antes de llenarte de loot.' },
      {
        type: 'text',
        content: 'Cada item tiene un peso. Al superar tu límite de carga te mueves más lento, lo que puede ser mortal en un encuentro. Aprende qué items valen el espacio que ocupan: un item raro ligero es mejor que tres comunes pesados si ya vas justo de espacio.',
      },
      {
        type: 'warning',
        title: 'Todo lo que llevas puede perderse',
        content: 'Si mueres en el mapa, perderás todo lo que tengas encima excepto lo guardado en el seguro. En las primeras raids, no arriesgues items que no puedas permitirte perder.',
      },
      { type: 'h2', content: 'Extraer con éxito' },
      {
        type: 'text',
        content: 'Hay dos tipos de extracción: los Raider Hatches (escotillas personales, instantáneas) y las Supply Call Stations (llamada de evacuación compartida, requiere tiempo y puede atraer a otros jugadores). Para empezar, prioriza siempre los Raider Hatches: son más rápidos y seguros.',
      },
      {
        type: 'tip',
        title: 'No seas codicioso',
        content: 'Más vale extraer con poco loot que quedarte demasiado tiempo y morir con todo. Aprende cuándo es suficiente.',
      },
    ],
  },

  {
    slug:        'como-funcionan-las-extracciones',
    title:       'Cómo funcionan las extracciones',
    description: 'Raider Hatches, Supply Call Stations y cuándo usar cada una para maximizar tu seguridad y botín.',
    category:    'primeros-pasos',
    heroImage:   'https://sht-vod.dn.nexoncdn.co.kr/shpd-comm/Guide/AR/matriarch_thumbnail381ed3.jpg',
    readTime:    5,
    difficulty:  'Principiante',
    sections: [
      {
        type: 'text',
        content: 'Extraer correctamente es la diferencia entre llegar al hideout con loot o perderlo todo. En ARC Raiders existen dos métodos de extracción principales, cada uno con sus ventajas y riesgos.',
      },
      { type: 'h2', content: 'Raider Hatches (Escotillas)' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/9/92/Raider_Hatch.png', alt: 'Raider Hatch en Dam Battlegrounds', caption: 'Raider Hatch en Dam Battlegrounds — la escotilla personal de extracción instantánea.' },
      {
        type: 'text',
        content: 'Las escotillas son la forma más rápida y segura de salir del mapa. Son de uso personal, por lo que no pueden ser robadas ni bloqueadas por otros jugadores. Solo tú (y tu escuadrón) podéis usarlas.',
      },
      {
        type: 'list',
        items: [
          'Son instantáneas: interactúas y extraes sin tiempo de espera',
          'No avisan a nadie de tu posición al usarlas',
          'Están distribuidas por el mapa, aprende sus ubicaciones',
          'Son la mejor opción cuando vas cargado o hay PvP cerca',
        ],
      },
      { type: 'h2', content: 'Supply Call Stations (Estaciones de llamada)' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/a/a8/Supply_Station.png', alt: 'Supply Call Station en Dam Battlegrounds', caption: 'Supply Call Station — al activarla, todos los jugadores del mapa verán su posición.' },
      {
        type: 'text',
        content: 'Las Supply Call Stations son puntos de extracción compartidos. Activarlas envía una señal que todos los jugadores del mapa pueden ver. La evacuación tarda un tiempo (generalmente 60-90 segundos), durante el cual estás expuesto.',
      },
      {
        type: 'warning',
        title: 'Riesgo alto de PvP',
        content: 'Al activar una Supply Call Station, aparece en el mapa de todos los jugadores. Espera emboscadas. Cubre los ángulos mientras esperas la evacuación.',
      },
      {
        type: 'list',
        items: [
          'Generan más recompensas que los Raider Hatches',
          'Cualquier jugador puede usar la misma estación si llega a tiempo',
          'Son ideales para squads con capacidad de defender la zona',
          'Evítalas si estás solo y con poco loot de valor',
        ],
      },
      { type: 'h2', content: '¿Cuándo extraer?' },
      {
        type: 'text',
        content: 'La regla general: extrae cuando tengas suficiente loot para que valga la pena el riesgo que tomaste para conseguirlo. No esperes a llenar el inventario si ya tienes items buenos. Un raid mediocre completado vale más que uno épico perdido.',
      },
      {
        type: 'tip',
        title: 'La "regla del miedo"',
        content: 'Si empiezas a pensar "no quiero morir ahora", es la señal de que ya tienes suficiente loot. Extrae.',
      },
    ],
  },

  // ─── Táctica ──────────────────────────────────────────────────────────────

  {
    slug:        'movimiento-y-posicionamiento',
    title:       'Movimiento y posicionamiento',
    description: 'Cómo moverte por el mapa sin llamar la atención, usar la cobertura y tomar ventaja de posición en enfrentamientos.',
    category:    'tactica',
    heroImage:   'https://sht-vod.dn.nexoncdn.co.kr/shpd-comm/Media/AR/128_media_src.png',
    readTime:    6,
    difficulty:  'Intermedio',
    sections: [
      {
        type: 'text',
        content: 'En ARC Raiders, sobrevivir depende más de cómo te mueves que de tu puntería. Un jugador con buena posición gana casi siempre contra uno con mejor equipamiento pero mal posicionado.',
      },
      { type: 'h2', content: 'Moverse sin ser detectado' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/b/bc/Enelica_Dam_Generator_Hall.jpg', alt: 'Interior industrial oscuro', caption: 'Zonas industriales como la sala de generadores de Enelica Dam — ideales para moverse sin ser detectado.' },
      {
        type: 'text',
        content: 'Los ARCs tienen un radio de detección por visión y sonido. Agacharte reduce el ruido que haces al moverte. En zonas con alta densidad de ARCs, avanza agachado y evita correr cerca de patrullas.',
      },
      {
        type: 'list',
        title: 'Reglas básicas de sigilo',
        items: [
          'Agáchate cerca de ARCs que no te hayan detectado',
          'No corras entre coberturas si hay ARCs a menos de 30 metros',
          'Los disparos atraen ARCs de zonas adyacentes',
          'Usa la geometría del mapa para romper líneas de visión',
        ],
      },
      { type: 'h2', content: 'Posicionamiento en PvP' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/d/d3/Buried_City_Supracosta_Buried_Train.jpg', alt: 'Jugador agachado tras cobertura en Buried City', caption: 'Usar vehículos y escombros como cobertura es esencial para sobrevivir en enfrentamientos PvP.' },
      {
        type: 'text',
        content: 'Cuando hay jugadores enemigos cerca, la altura y la cobertura sólida son tus mejores aliados. Intenta siempre tener una salida antes de comprometerte en un tiroteo.',
      },
      {
        type: 'tip',
        title: 'La regla de la salida',
        content: 'Antes de entrar en un área, identifica cómo saldrías si las cosas van mal. Si no hay salida clara, busca otra ruta de entrada.',
      },
      {
        type: 'list',
        title: 'Ventajas de posición',
        items: [
          'Altura: ves más y eres más difícil de flanquear',
          'Cobertura dura: pilares, muros de hormigón, vehículos metálicos',
          'Ángulos inesperados: no te quedes donde te esperan',
          'Luz: posiciónate con el sol o la luz detrás si es posible',
        ],
      },
      { type: 'h2', content: 'Rotaciones seguras' },
      {
        type: 'text',
        content: 'Una rotación es el camino que usas para moverte de zona a zona. Las rotaciones seguras evitan zonas abiertas, pasan por coberturas y tienen alternativas si la ruta principal está comprometida. Aprende 2-3 rotaciones por mapa y úsalas por defecto.',
      },
    ],
  },

  {
    slug:        'jugar-en-squad',
    title:       'Jugar en squad',
    description: 'Comunicación, roles, revives y cómo coordinarse para dominar un mapa en equipo de hasta 3 jugadores.',
    category:    'tactica',
    heroImage:   'https://sht-vod.dn.nexoncdn.co.kr/shpd-comm/Media/AR/129_thumbnail_small.png',
    readTime:    5,
    difficulty:  'Intermedio',
    sections: [
      {
        type: 'text',
        content: 'ARC Raiders está diseñado para jugar en squads de hasta 3 personas. Un equipo bien coordinado puede limpiar zonas que serían imposibles en solitario y manejar el PvP con mucha más seguridad.',
      },
      { type: 'h2', content: 'Comunicación efectiva' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/b/bb/Spaceport_Control_Tower_Interior.jpg', alt: 'Torre de control del Spaceport', caption: 'Zonas abiertas de varios pisos como la torre de control del Spaceport requieren asignación de roles y comunicación constante.' },
      {
        type: 'text',
        content: 'Compartir información en tiempo real marca la diferencia. No hace falta un sistema complejo: basta con marcar enemigos, anunciar tu posición y coordinar antes de entrar en una zona caliente.',
      },
      {
        type: 'list',
        title: 'Qué comunicar siempre',
        items: [
          'Posición de ARCs o jugadores enemigos detectados',
          'Tu nivel de salud y munición (antes de un enfrentamiento)',
          'Si necesitas revive y desde dónde',
          'Cuando vas a activar una extracción',
        ],
      },
      { type: 'h2', content: 'Roles básicos en el equipo' },
      {
        type: 'text',
        content: 'No hace falta repartir roles formalmente, pero tener uno o dos jugadores que "pusheen" y uno que cubra mejora mucho la supervivencia del equipo.',
      },
      {
        type: 'list',
        items: [
          'Pusher: entra primero, despeja esquinas, detecta enemigos',
          'Support: cura compañeros caídos, cubre los flancos del pusher',
          'Overwatch: queda en posición elevada, info y fuego de supresión',
        ],
      },
      { type: 'h2', content: 'Revives y cómo no desperdiciarlos' },
      {
        type: 'text',
        content: 'Cuando un compañero cae, valora si el reavive es seguro antes de intentarlo. Un reavive mal ejecutado suele acabar en dos bajas en lugar de una. Limpia la zona o busca cobertura antes de interactuar con el compañero caído.',
      },
      {
        type: 'warning',
        title: 'El revive es lento',
        content: 'Reavivir a un compañero te deja expuesto durante varios segundos. Nunca lo hagas en campo abierto o con enemigos cerca sin cubrirte primero.',
      },
    ],
  },

  // ─── Combate ──────────────────────────────────────────────────────────────

  {
    slug:        'tipos-de-arc-y-como-eliminarlos',
    title:       'Tipos de ARC y cómo eliminarlos',
    description: 'Guía completa de los enemigos ARC: comportamiento, puntos débiles y la mejor estrategia para cada tipo.',
    category:    'combate',
    heroImage:   'https://arcraiders.wiki/w/images/d/da/Harvester_Rocket_Launch.png',
    readTime:    12,
    difficulty:  'Intermedio',
    sections: [
      {
        type: 'text',
        content: 'Los ARC (Autonomous Robotic Constructs) son los enemigos principales del mapa. Cada tipo tiene comportamientos, puntos débiles y amenazas distintas. Conocerlos te permite ahorrar munición, evitar daño innecesario y limpiar zonas mucho más rápido.',
      },

      // ── ARCs ligeros ───────────────────────────────────────────────────────
      { type: 'h2', content: 'ARCs ligeros' },

      { type: 'h3', content: 'Wasp' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/f/fe/Wasp_Codex.png', alt: 'Wasp ARC', caption: 'Wasp — dron volador de ametralladora rápida' },
      {
        type: 'text',
        content: 'La Wasp es el ARC más común del juego. Pequeña, ágil y voladora, dispara ráfagas rápidas que en solitario hacen poco daño pero en grupo se acumulan rápidamente. Detecta por visión y sonido.',
      },
      {
        type: 'list',
        items: [
          'Punto débil: núcleo de energía en el centro del cuerpo',
          'Efectiva contra ella: escopeta o SMG a corta distancia',
          'Si hay varias, busca cobertura y elimínalas de una en una',
          'Puede ser derribada interrumpiendo sus propulsores',
        ],
      },

      { type: 'h3', content: 'Hornet' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/f/f7/ARC_Hornet.png', alt: 'Hornet ARC', caption: 'Hornet — versión blindada de la Wasp con proyectil aturdidor' },
      {
        type: 'text',
        content: 'La Hornet es una Wasp con armadura adicional y un proyectil de aturdimiento lento que sigue un arco predecible. Si te alcanza, te inutiliza brevemente las armas y el movimiento, dejándote expuesto.',
      },
      {
        type: 'warning',
        title: 'Prioriza a la Hornet',
        content: 'Su proyectil aturdidor en medio de un grupo de ARCs puede ser mortal. Elimínala antes que a las Wasps normales.',
      },

      { type: 'h3', content: 'Tick' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/1/17/ARC_Tick.png', alt: 'Tick ARC', caption: 'Tick — araña explosiva que se adhiere al terreno' },
      {
        type: 'text',
        content: 'El Tick es una pequeña araña mecánica que se queda inmóvil esperando a que pases por encima. Cuando te detecta, salta y explota. Muy difícil de ver en entornos oscuros o con mucho detalle visual.',
      },
      {
        type: 'tip',
        title: 'Dispara desde lejos',
        content: 'Si ves un Tick en el suelo, actívalo desde distancia o rodéalo. Nunca te acerques a uno sin haber confirmado que está inactivo.',
      },

      { type: 'h3', content: 'Pop' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/f/ff/ARC_Pop.png', alt: 'Pop ARC', caption: 'Pop — unidad suicida que corre hacia el raider para explotar' },
      {
        type: 'text',
        content: 'El Pop es una unidad suicida que corre directamente hacia ti para explotar. Su sonido al correr (un zumbido mecánico acelerado) es inconfundible. Especialmente peligroso en pasillos y espacios cerrados.',
      },
      {
        type: 'warning',
        title: 'Máxima prioridad en espacios cerrados',
        content: 'Si un Pop te alcanza, la explosión puede tumbarte de golpe incluso con escudo. Dispara a la cabeza mientras retrocedes o aléjate corriendo.',
      },

      { type: 'h3', content: 'Snitch' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/c/c6/ARC_Snitch.png', alt: 'Snitch ARC', caption: 'Snitch — ARC de reconocimiento que llama refuerzos al detectarte' },
      {
        type: 'text',
        content: 'El Snitch no ataca directamente: su función es detectar Raiders y llamar refuerzos. Si te ve y no lo eliminas rápido, aparecerán más ARCs en tu posición en segundos. Es uno de los ARCs más peligrosos en términos de escalada.',
      },
      {
        type: 'tip',
        title: 'Silenciador o primera bala',
        content: 'El Snitch tiene poca vida. Elimínalo antes de que complete su alerta. Si tiene el efecto de "alerta" activo (animación visible), ya es tarde — prepárate para los refuerzos.',
      },

      // ── ARCs medianos ──────────────────────────────────────────────────────
      { type: 'h2', content: 'ARCs medianos' },

      { type: 'h3', content: 'Surveyor' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/d/de/ARC_Surveyor_-_Codex_Cropped.png', alt: 'Surveyor ARC', caption: 'Surveyor — unidad de patrulla rodante con cámara giratoria' },
      {
        type: 'text',
        content: 'El Surveyor es una unidad rodante de reconocimiento. Patrulla rutas fijas y tiene un campo de visión amplio. Si te detecta, alerta a los ARCs cercanos antes de atacar.',
      },
      {
        type: 'list',
        items: [
          'Aprende sus rutas de patrulla y actúa entre sus giros',
          'Si te detecta, elimínalo rápido antes de que llame refuerzos',
          'Su cuerpo cilíndrico lo hace fácil de flanquear por la espalda',
        ],
      },

      { type: 'h3', content: 'Rocketeer' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/5/57/ARC_Rocketeer.png', alt: 'Rocketeer ARC', caption: 'Rocketeer — ARC de cohetes teledirigidos a media-larga distancia' },
      {
        type: 'text',
        content: 'El Rocketeer dispara cohetes lentos pero con gran daño en área. Sus proyectiles son esquivables si los ves venir. Muy peligroso en campo abierto donde no hay cobertura que destruya los cohetes.',
      },
      {
        type: 'tip',
        title: 'Rompe la línea de visión',
        content: 'Los cohetes del Rocketeer se desactivan si pierdes su línea de visión. Entra en cobertura inmediatamente al ver el disparo y atácalo mientras recarga.',
      },

      { type: 'h3', content: 'Bombardier' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/7/76/ARC_Bombardier.png', alt: 'Bombardier ARC', caption: 'Bombardier — ARC de granadas en arco a media distancia' },
      {
        type: 'text',
        content: 'El Bombardier lanza granadas en arco que explotan al impacto. Ideal para sacarte de coberturas detrás de muros. Es más difícil de contrarrestar que el Rocketeer porque sus proyectiles pueden superar obstáculos.',
      },
      {
        type: 'list',
        items: [
          'No te quedes quieto detrás de la misma cobertura: ajusta la posición',
          'Su cadencia de disparo es lenta: aprovecha las pausas para avanzar',
          'A corta distancia pierde efectividad: cierra la distancia rápido',
        ],
      },

      { type: 'h3', content: 'Fireball' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/2/26/ARC_Fireball.png', alt: 'Fireball ARC', caption: 'Fireball — ARC que lanza proyectiles incendiarios y aplica quemadura' },
      {
        type: 'text',
        content: 'El Fireball dispara proyectiles incendiarios que aplican efecto de quemadura al impactar. El daño continuado puede ser letal si ya tienes la salud baja. Tiene alcance medio-alto.',
      },
      {
        type: 'warning',
        title: 'Usa el med kit antes que después',
        content: 'La quemadura hace daño continuo varios segundos. Si recibes un impacto del Fireball, cúrete inmediatamente, no esperes a estar en zona segura.',
      },

      // ── ARCs pesados ───────────────────────────────────────────────────────
      { type: 'h2', content: 'ARCs pesados' },

      { type: 'h3', content: 'Sentinel' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/f/f1/ARC_Sentinel.png', alt: 'Sentinel ARC', caption: 'Sentinel — torreta pesada de largo alcance con disparo de francotirador' },
      {
        type: 'text',
        content: 'El Sentinel es una torreta estacionaria de largo alcance. Su disparo es lento pero hace daño devastador, similar a un francotirador. Se encuentra principalmente en exteriores o zonas abiertas elevadas.',
      },
      {
        type: 'list',
        title: 'Cómo neutralizar un Sentinel',
        items: [
          'Flanquéalo usando el terreno: busca ángulos desde donde no pueda dispararte',
          'Ataca a los puntos de articulación (hombros/base giratoria) para más daño',
          'No avances en línea recta hacia él: zigzaguea entre coberturas',
          'En squad, uno distrae y otro flanquea por detrás',
        ],
      },

      { type: 'h3', content: 'Bastion' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/4/47/ARC_Bastion.png', alt: 'Bastion ARC', caption: 'Bastion — unidad pesada terrestre con armadura reforzada y ametralladora' },
      {
        type: 'text',
        content: 'El Bastion es la unidad terrestre más resistente. Armadura pesada en todo el cuerpo, ametralladora de alta cadencia y mucha vida. Enfrentarlo en campo abierto es casi una sentencia de muerte.',
      },
      {
        type: 'warning',
        title: 'No lo enfrentes solo sin preparación',
        content: 'El Bastion puede absorber un cargador completo con apenas daño visible. Necesitas armamento de alto daño, munición abundante y cobertura sólida. Si vas justo de recursos, evítalo.',
      },
      {
        type: 'list',
        title: 'Estrategia recomendada',
        items: [
          'Concentra el fuego en las partes sin armadura (articulaciones, espalda)',
          'Alterna entre cobertura y disparos cortos: nunca te expongas más de 2 segundos',
          'Si juegas en squad, dos jugadores atacan y uno cura/cubre',
          'Las granadas y explosivos son muy efectivos contra él',
        ],
      },

      { type: 'h3', content: 'Leaper' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/e/ed/Leaper_Codex.png', alt: 'Leaper ARC', caption: 'Leaper — unidad pesada de carga que aplasta al impactar' },
      {
        type: 'text',
        content: 'El Leaper es una unidad de asalto rápido que carga en línea recta hacia el jugador más cercano con un salto devastador. A pesar de su tamaño, es sorprendentemente rápido y puede cubrir grandes distancias en segundos.',
      },
      {
        type: 'tip',
        title: 'Esquiva lateral, no hacia atrás',
        content: 'Cuando el Leaper prepare el salto (agacha el cuerpo brevemente), esquiva lateralmente. Retroceder en línea recta no es suficiente para evitar el impacto.',
      },
    ],
  },

  {
    slug:        'duelos-pvp-supervivencia',
    title:       'Duelos PvP y supervivencia',
    description: 'Cómo detectar otros Raiders, cuándo pelear y cuándo evitar el conflicto para llegar vivo a la extracción.',
    category:    'combate',
    heroImage:   'https://sht-vod.dn.nexoncdn.co.kr/shpd-comm/Guide/AR/night_raid_thumbnaild19caa.jpg',
    readTime:    7,
    difficulty:  'Avanzado',
    sections: [
      {
        type: 'text',
        content: 'El PvP en ARC Raiders es opcional pero frecuente. Otros Raiders son a la vez una amenaza y una oportunidad: eliminándolos puedes quedarte con su loot. El problema es que también pueden eliminarte a ti y quedarse con el tuyo.',
      },
      { type: 'h2', content: 'Detectar a otros jugadores' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/a/a0/Mantikor_Monitoring_Room.jpg', alt: 'Sala de monitorización de Mantikor con iluminación roja de alerta', caption: 'La iluminación roja de alerta en instalaciones como Mantikor indica peligro activo — máxima precaución al entrar.' },
      {
        type: 'text',
        content: 'Los sonidos de pasos, disparos y puertas abiertas son tus mejores indicadores. A diferencia de los ARCs, los jugadores suelen moverse de forma más impredecible y rápida.',
      },
      {
        type: 'list',
        title: 'Señales de presencia enemiga',
        items: [
          'Sonido de pasos humanos (distinto al arrastre mecánico de los ARCs)',
          'Puertas abiertas o crates ya saqueados',
          'Disparos en zona sin ARCs activos cerca',
          'Supply Call Station activada por alguien más',
          'ARCs alertados moviéndose en una dirección fija',
        ],
      },
      { type: 'h2', content: '¿Pelear o evitar?' },
      {
        type: 'text',
        content: 'La decisión de pelear depende de tu inventario, tu salud actual, tu posición y la del enemigo. Un jugador con 30% de salud y poco loot no debería buscar PvP. Uno con full salud, buena posición y poco que perder puede aprovechar la ventaja.',
      },
      {
        type: 'tip',
        title: 'La regla de la iniciativa',
        content: 'El que dispara primero con buena puntería casi siempre gana en ARC Raiders. Si decides pelear, hazlo con toda la ventaja posible: posición, distancia, sorpresa.',
      },
      { type: 'h2', content: 'Durante el tiroteo' },
      {
        type: 'list',
        items: [
          'Nunca te quedes quieto en campo abierto',
          'Usa cobertura dura siempre que sea posible',
          'Dispara en ráfagas cortas para mantener la precisión',
          'Si estás perdiendo, rompe el contacto y reposiciónate',
          'Cuida los flancos: en squad, los enemigos intentarán rodearte',
        ],
      },
      { type: 'h2', content: 'Después del tiroteo' },
      {
        type: 'text',
        content: 'Si eliminas a un jugador, saquea rápido y muévete. El sonido de la pelea puede haber atraído a otros Raiders o a ARCs. Quédate el tiempo mínimo en la zona del encuentro.',
      },
      {
        type: 'warning',
        title: 'El rush de adrenalina',
        content: 'Ganar un 1vs1 da una falsa sensación de seguridad. Tus recursos habrán bajado y puede haber más jugadores cerca. Extrae si ya tienes loot suficiente.',
      },
    ],
  },

  // ─── Economía ─────────────────────────────────────────────────────────────

  {
    slug:        'gestion-del-inventario',
    title:       'Gestión del inventario y economía',
    description: 'Qué vale la pena quedarse, qué vender y cómo priorizar el loot para maximizar cada raid.',
    category:    'economia',
    heroImage:   'https://arcraiders.wiki/w/images/4/45/Dam_Battlegrounds_Field_Depot_Container.jpg',
    readTime:    6,
    difficulty:  'Principiante',
    sections: [
      {
        type: 'text',
        content: 'La economía de ARC Raiders gira alrededor de los recursos que traes del mapa. Saber qué llevarte y qué dejar atrás es tan importante como saber disparar.',
      },
      { type: 'h2', content: 'Prioridad de loot' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/d/d4/Dam_Battleground_Field_Crate.jpg', alt: 'Field Crate', caption: 'Field Crate — uno de los principales contenedores de loot del mapa. Siempre merece la pena abrirlos.' },
      {
        type: 'text',
        content: 'No todo lo que brilla vale el espacio. La prioridad general es: items de crafting raro > munición que necesitas > consumibles > materiales comunes. Nunca cojas algo pesado si tienes el inventario casi lleno y mejor loot disponible.',
      },
      {
        type: 'list',
        title: 'Orden de prioridad',
        items: [
          '1. Items de rareza épica o legendaria (siempre)',
          '2. Materiales de crafting que necesites para tus proyectos actuales',
          '3. Munición de tu arma principal',
          '4. Consumibles (meds, stims)',
          '5. Materiales comunes (solo si tienes espacio)',
        ],
      },
      { type: 'h2', content: 'Gestión del peso' },
      {
        type: 'text',
        content: 'Superar tu límite de carga te ralentiza. Esto puede ser mortal. Si vas sobrecargado, descarta los items de menor valor antes de que el combate lo decida por ti.',
      },
      {
        type: 'tip',
        title: 'Aprende el peso de los items clave',
        content: 'Con el tiempo sabrás de memoria cuánto pesa cada item importante. Empieza memorizando los que usas más en crafting.',
      },
      { type: 'h2', content: 'Qué vender, qué guardar' },
      {
        type: 'list',
        title: 'Guarda',
        items: [
          'Materiales de crafting para tu siguiente upgrade',
          'Munición (nunca tienes suficiente)',
          'Mods de arma que uses actualmente',
          'Items necesarios para quests activas',
        ],
      },
      {
        type: 'list',
        title: 'Vende o descarta',
        items: [
          'Duplicados de items que ya tienes en exceso',
          'Items comunes sin uso en crafting actual',
          'Equipamiento de armas que no usas',
        ],
      },
      { type: 'h2', content: 'Raider Caches y Field Depots' },
      {
        type: 'text',
        content: 'Los Raider Caches son cajas especiales protegidas que contienen los mejores drops del mapa. Suelen estar vigiladas por ARCs. Los Field Depots te permiten almacenar temporalmente items en el mapa para recuperarlos más tarde, aunque esto tiene riesgos.',
      },
      {
        type: 'tip',
        title: 'Localiza las Raider Caches',
        content: 'En cada sesión, prioriza al menos una Raider Cache. El loot que contienen suele valer el riesgo que implica abrirlas.',
      },
    ],
  },

  {
    slug:        'crafting-y-progresion',
    title:       'Crafting y progresión del hideout',
    description: 'Cómo priorizar las mejoras del hideout, qué craftear primero y cómo optimizar tu progresión a largo plazo.',
    category:    'economia',
    heroImage:   'https://arcraiders.wiki/w/images/4/49/Workshop.png',
    readTime:    7,
    difficulty:  'Intermedio',
    sections: [
      {
        type: 'text',
        content: 'El hideout es tu base de operaciones. Mejorarlo desbloquea nuevas capacidades de crafting, mejores armas y consumibles más potentes. Priorizarlo correctamente acelera enormemente tu progresión.',
      },
      { type: 'h2', content: 'Qué mejorar primero' },
      {
        type: 'text',
        content: 'Las primeras mejoras del hideout deben orientarse a aumentar tu capacidad de supervivencia en el mapa: mejor producción de consumibles médicos y acceso a munición de mayor calidad.',
      },
      {
        type: 'list',
        title: 'Orden recomendado (early game)',
        items: [
          '1. Mesa de crafting básica: acceso a consumibles esenciales',
          '2. Almacenamiento: más espacio = más loot por raid',
          '3. Banco de trabajo: upgrades de arma de nivel I a II',
          '4. Laboratorio médico: meds más potentes',
          '5. Mesa avanzada: crafting de items raros',
        ],
      },
      { type: 'h2', content: 'Blueprints y recetas' },
      {
        type: 'text',
        content: 'Para craftear items necesitas su blueprint (plano). Algunos se consiguen en el mapa, otros como recompensa de quests o en traders. Sin el blueprint, no puedes craftear el item aunque tengas los materiales.',
      },
      {
        type: 'tip',
        title: 'Prioriza los blueprints de consumibles',
        content: 'Los meds y consumibles de combate los usarás en cada raid. Tenerlos desbloqueados en crafting es más eficiente a largo plazo que comprarlos.',
      },
      { type: 'h2', content: 'Upgrades de arma' },
      {
        type: 'text',
        content: 'Las armas tienen varios niveles (I, II, III...). Cada nivel mejora las estadísticas base. Para subir de nivel necesitas el arma actual + materiales específicos + acceso al banco de trabajo correspondiente.',
      },
      {
        type: 'warning',
        title: 'No subas todo al mismo tiempo',
        content: 'Subir una arma de nivel requiere recursos significativos. Escoge tu arma principal y súbela de nivel antes de dispersar recursos en varias armas.',
      },
      { type: 'h2', content: 'Quests y progresión' },
      { type: 'image', src: 'https://arcraiders.wiki/w/images/4/4b/Milae_Analyz_Testing_Annex_Command_Center.jpg', alt: 'Centro de mando del Testing Annex de Milae Analyz', caption: 'Instalaciones como el Testing Annex contienen quests de alto valor — localízalas en el mapa antes de cada raid.' },
      {
        type: 'text',
        content: 'Las quests de los traders son la forma más eficiente de conseguir blueprints y materiales raros. Completa las quests de nivel bajo primero para desbloquear las de mayor recompensa.',
      },
      {
        type: 'list',
        title: 'Tips de progresión eficiente',
        items: [
          'Activa siempre todas las quests disponibles antes de entrar al mapa',
          'Si una quest pide "llevar X item al mapa", planifica la raid para completarla',
          'Los traders tienen stock limitado: revisa qué venden antes de craftear',
          'Vende a los traders antes que tirar items: siempre pagan algo',
        ],
      },
    ],
  },
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === category)
}
