export type LootEntry = {
  name: string
  tip: string
  tags?: string[]   // e.g. ["Mesa de Armas", "Armero"] or ["Zona: Presa"]
}

export type LootSection = {
  id: 'recycle' | 'station' | 'quests' | 'keep'
  title: string
  subtitle: string
  tip: string
  color: string
  textClass: string
  borderClass: string
  bgClass: string
  fillClass: string
  items: LootEntry[]
}

export const LOOT_SECTIONS: LootSection[] = [
  {
    id: 'recycle',
    title: 'Reciclar o Vender',
    subtitle: 'Sin uso real — no merece la pena guardarlos',
    tip: 'Recicla primero en la Recycling Station para recuperar materiales básicos. Si la mesa está llena, véndelos al comerciante.',
    color: '#f87171',
    textClass: 'text-red-400',
    borderClass: 'border-red-400/25',
    bgClass: 'bg-red-400/8',
    fillClass: 'bg-red-400',
    items: [
      // Common junk
      { name: 'Damaged ARC Powercell',      tip: 'Versión deteriorada del ARC Powercell. Sin uso en crafting.' },
      { name: 'Damaged Fireball Burner',     tip: 'Quemador dañado. Sin uso, recicla para materiales básicos.' },
      { name: 'Damaged Hornet Driver',       tip: 'Componente dañado de Hornet. Recicla siempre.' },
      { name: 'Damaged Rocketeer Driver',    tip: 'Componente dañado de Rocketeer. Recicla siempre.' },
      { name: 'Damaged Tick Pod',            tip: 'Cápsula dañada de Tick. Sin uso, recicla.' },
      { name: 'Damaged Wasp Driver',         tip: 'Componente dañado de Wasp. Recicla siempre.' },
      // Uncommon junk
      { name: 'Candle Holder',               tip: 'Sin uso en ninguna receta. Recicla o vende.' },
      { name: 'Crumpled Plastic Bottle',     tip: 'Da Plastic Parts al reciclar. No acumules stacks.' },
      { name: 'Damaged ARC Motion Core',     tip: 'Versión dañada del ARC Motion Core. No sirve para upgrades.' },
      { name: 'Deflated Football',           tip: 'Sin uso. Recicla para materiales básicos.' },
      { name: 'Degraded ARC Rubber',         tip: 'Forma degradada del ARC Flex Rubber. Recicla sin dudarlo.' },
      { name: 'Dried-Out ARC Resin',         tip: 'Forma seca del ARC Synthetic Resin. Sin uso, recicla.' },
      { name: 'Fireball Burner',             tip: 'Quemador sin uso de crafting. Recicla.' },
      { name: 'Garlic Press',                tip: 'Objeto de cocina sin uso. Recicla o vende.' },
      { name: 'Household Cleaner',           tip: 'Sin uso de crafting. Vende o recicla.' },
      { name: 'Ice Cream Scooper',           tip: 'Sin uso en ninguna receta. Recicla.' },
      { name: 'Impure ARC Coolant',          tip: 'Versión impura del ARC Coolant. No entra en recetas.' },
      { name: 'Metal Brackets',              tip: 'Reciclable muy común. Da Metal Parts básicos.' },
      { name: 'Number Plate',                tip: 'Sin uso. Recicla para materiales básicos.' },
      { name: 'Ruined Tactical Vest',        tip: 'Armadura inutilizable. Recicla para recuperar materiales.' },
      { name: 'Rusted Bolts',               tip: 'Da Metal Parts al reciclar. Sin valor real.' },
      { name: 'Rusty ARC Steel',             tip: 'Da Metal Parts al reciclar. Ocupa inventario sin uso.' },
      { name: 'Snitch Scanner',              tip: 'Componente roto. Recicla para Electronic Components.' },
      { name: 'Spotter Relay',               tip: 'Componente electrónico roto. Recicla.' },
      // Rare junk
      { name: 'Alarm Clock',                 tip: 'Sin uso en crafting. Recicla para materiales básicos.' },
      { name: 'ARC Coolant',                 tip: 'Coolant estándar sin recetas importantes. Recicla.' },
      { name: 'ARC Flex Rubber',             tip: 'Goma ARC sin uso de crafting avanzado. Recicla.' },
      { name: 'ARC Performance Steel',       tip: 'Acero ARC sin recetas asociadas. Recicla.' },
      { name: 'ARC Synthetic Resin',         tip: 'Resina sintética sin uso de crafting. Recicla.' },
      { name: 'ARC Thermo Lining',           tip: 'Forro térmico sin uso en recetas. Recicla.' },
      { name: 'Bicycle Pump',                tip: 'Sin uso en crafting. Recicla o vende.' },
      { name: 'Bison Driver',                tip: 'Componente de Bison sin uso. Recicla.' },
      { name: 'Comet Igniter',               tip: 'Sin uso en ninguna receta conocida. Recicla.' },
      { name: 'Coolant',                     tip: 'Refrigerante sin uso de crafting. Recicla.' },
      { name: 'Cooling Coil',                tip: 'Bobina de refrigeración sin uso. Recicla.' },
      { name: 'Cooling Fan',                 tip: 'Ventilador de refrigeración. Sin uso, recicla.' },
      { name: 'Cracked Bioscanner',          tip: 'Bioscáner roto. Recicla para Electronic Components.' },
      { name: 'Damaged Heat Sink',           tip: 'Disipador dañado. Sin uso en crafting.' },
      { name: 'Diving Goggles',              tip: 'Gafas de buceo. Sin uso en ninguna receta.' },
      { name: 'Dog Collar',                  tip: 'Sin uso en ninguna receta. Recicla o vende.' },
      { name: 'Firefly Burner',              tip: 'Quemador raro sin uso de crafting. Recicla.' },
      { name: 'Flow Controller',             tip: 'Controlador de flujo sin recetas. Recicla.' },
      { name: 'Fried Motherboard',           tip: 'Placa quemada. Sin uso, recicla para componentes.' },
      { name: 'Frying Pan',                  tip: 'Cacharro de cocina. Recicla para Metal Parts.' },
      { name: 'Headphones',                  tip: 'Sin uso en crafting. Recicla o vende.' },
      { name: 'Humidifier',                  tip: 'Sin uso en ninguna receta. Recicla.' },
      { name: 'Industrial Battery',          tip: 'Batería industrial sin uso en crafting. Recicla.' },
      { name: 'Industrial Charger',          tip: 'Cargador industrial sin recetas. Recicla.' },
      { name: 'Industrial Magnet',           tip: 'Imán industrial sin uso de crafting. Recicla.' },
      { name: 'Rusted Gear',                 tip: 'Engranaje oxidado. Recicla para Metal Parts.' },
      { name: 'Rusted Shut Medical Kit',     tip: 'Botiquín sellado por óxido. Sin uso, recicla.' },
      { name: 'Rusted Tools',                tip: 'Herramientas inservibles. Recicla para Metal Parts.' },
      { name: 'Sample Cleaner',              tip: 'Sin uso en ninguna receta. Recicla.' },
      { name: 'Sentinel Firing Core',        tip: 'Núcleo de Sentinel sin uso de crafting. Recicla.' },
      { name: 'Shredder Gyro',               tip: 'Giroscopio de Shredder. Sin uso, recicla.' },
      { name: 'Signal Amplifier',            tip: 'Amplificador de señal sin recetas. Recicla.' },
      { name: 'Spectrometer',                tip: 'Sin uso de crafting. Recicla.' },
      { name: 'Spring Cushion',              tip: 'Sin uso en ninguna receta conocida. Recicla.' },
      { name: 'Turbo Pump',                  tip: 'Bomba turbo sin uso. Recicla o vende.' },
      { name: 'Unusable Weapon',             tip: 'Arma inutilizable. Recicla para Simple/Medium Gun Parts.' },
      { name: 'Wasp Driver',                 tip: 'Componente de Wasp sin uso. Recicla.' },
    ],
  },
  {
    id: 'station',
    title: 'Materiales para Mesas y Crafting',
    subtitle: 'Guárdalos — son los inputs de todas las mesas de la base',
    tip: 'Cada banco de trabajo necesita materiales específicos. No recicles ninguno de estos — siempre hacen falta más.',
    color: '#a78bfa',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-400/25',
    bgClass: 'bg-violet-400/8',
    fillClass: 'bg-violet-400',
    items: [
      // Basic raw materials
      { name: 'Metal Parts',                  tip: 'Material base para casi todo. Nunca tendrás demasiados.',                 tags: ['Mesa Básica', 'Mesa de Armas', 'Mesa de Munición'] },
      { name: 'Plastic Parts',                tip: 'Necesario para armaduras ligeras y explosivos básicos.',                  tags: ['Mesa Básica', 'Mesa de Equipamiento', 'Mesa de Explosivos'] },
      { name: 'Chemicals',                    tip: 'Input principal de la Refinería y la Mesa de Explosivos.',               tags: ['Refinería', 'Mesa de Explosivos'] },
      // Core topside materials
      { name: 'ARC Powercell',                tip: 'El material más demandado del juego. Nunca lo recicles ni vendas.',     tags: ['Refinería', 'Mesa de Equipamiento'] },
      { name: 'Advanced ARC Powercell',       tip: 'Versión avanzada del ARC Powercell. Para upgrades de nivel alto.',       tags: ['Refinería', 'Mesa de Equipamiento'] },
      { name: 'Wires',                        tip: 'Necesario para refinar componentes eléctricos.',                         tags: ['Refinería', 'Mesa de Utilidades'] },
      { name: 'Battery',                      tip: 'Input para componentes eléctricos y escudos.',                           tags: ['Refinería', 'Mesa de Equipamiento'] },
      { name: 'Oil',                          tip: 'Necesario en la Refinería para componentes mecánicos.',                  tags: ['Refinería'] },
      { name: 'ARC Alloy',                    tip: 'Aleación para armas de nivel medio y equipo.',                           tags: ['Mesa de Armas Niv. 2', 'Mesa de Equipamiento'] },
      { name: 'Duct Tape',                    tip: 'Se usa en recetas de mejoras básicas y utilidades.',                    tags: ['Mesa Básica', 'Mesa de Armas'] },
      { name: 'Magnet',                       tip: 'Componente para modificaciones y recetas de la Refinería.',             tags: ['Refinería', 'Mesa de Armas'] },
      { name: 'Steel Spring',                 tip: 'Necesario en armas y modificaciones de tipo escopeta.',                 tags: ['Mesa de Armas', 'Armero'] },
      { name: 'Canister',                     tip: 'Recipiente usado en recetas de utilidades y explosivos.',               tags: ['Mesa de Utilidades', 'Mesa de Explosivos'] },
      { name: 'Motor',                        tip: 'Necesario para mejorar ciertas mesas de la base.',                      tags: ['Mejora de Mesa'] },
      // Refined materials (crafted at Refiner — keep if you find them in world)
      { name: 'Electrical Components',        tip: 'Componente refinado clave. Se fabrica en Refinería o se encuentra en el mundo.', tags: ['Refinería', 'Mesa de Armas'] },
      { name: 'Mechanical Components',        tip: 'Componente mecánico refinado. Esencial para armas y equipo.',            tags: ['Refinería', 'Mesa de Armas'] },
      { name: 'Durable Cloth',               tip: 'Tela resistente para armaduras y equipo de supervivencia.',              tags: ['Refinería', 'Mesa de Equipamiento'] },
      { name: 'Crude Explosives',             tip: 'Explosivos básicos para crafting de granadas.',                          tags: ['Refinería', 'Mesa de Explosivos'] },
      { name: 'Antiseptic',                   tip: 'Necesario para fabricar items médicos en la Mesa Médica.',               tags: ['Refinería', 'Mesa Médica'] },
      // Gun parts
      { name: 'Simple Gun Parts',             tip: 'Crafting de armas básicas: Arpeggio I, Hairpin I, Il Toro I.',           tags: ['Mesa de Armas Niv. 1'] },
      { name: 'Medium Gun Parts',             tip: 'Para armas de nivel medio: Ferro, Canto. Guarda siempre.',              tags: ['Mesa de Armas', 'Armero'] },
      { name: 'Heavy Gun Parts',              tip: 'Para armas pesadas: Jupiter, Torrente. Muy valioso.',                   tags: ['Refinería Niv. 2', 'Armero III'] },
      { name: 'Mod Components',               tip: 'Necesario para fabricar todas las modificaciones de armas.',            tags: ['Refinería', 'Armero'] },
      // Advanced electronics
      { name: 'Processor',                    tip: 'Componente electrónico avanzado para upgrades de nivel alto.',          tags: ['Mesa de Equipamiento', 'Mesa de Utilidades'] },
      { name: 'Sensors',                      tip: 'Para items de reconocimiento y equipamiento avanzado.',                 tags: ['Mesa de Equipamiento', 'Mesa de Utilidades'] },
      { name: 'Voltage Converter',            tip: 'Componente eléctrico raro para equipamiento avanzado.',                tags: ['Refinería', 'Mesa de Equipamiento'] },
      { name: 'Speaker Component',            tip: 'Se usa en utilidades avanzadas y modificaciones.',                     tags: ['Mesa de Utilidades', 'Refinería'] },
      { name: 'ARC Circuitry',                tip: 'Circuitería avanzada para upgrades de último nivel.',                   tags: ['Refinería Niv. 2'] },
      { name: 'ARC Motion Core',              tip: 'Núcleo de movimiento ARC. Necesario para upgrades de nivel alto.',      tags: ['Refinería Niv. 2'] },
      // High-end crafting materials
      { name: 'Complex Gun Parts',            tip: 'Para las armas más avanzadas del juego. Muy raro.',                     tags: ['Refinería', 'Armero III'] },
      { name: 'Advanced Electrical Components', tip: 'Versión avanzada de Electrical Components. Crafting de tier alto.',  tags: ['Refinería', 'Mesa de Armas'] },
      { name: 'Advanced Mechanical Components',tip: 'Versión avanzada de Mechanical Components. Crafting de tier alto.',   tags: ['Refinería', 'Mesa de Armas'] },
      { name: 'Magnetic Accelerator',         tip: 'Componente épico para las recetas más avanzadas.',                      tags: ['Refinería'] },
      { name: 'Power Rod',                    tip: 'Material avanzado para crafting de tier épico.',                        tags: ['Refinería'] },
    ],
  },
  {
    id: 'quests',
    title: 'Misiones y Acceso a Zonas',
    subtitle: 'Llaves y objetos necesarios para misiones o zonas bloqueadas',
    tip: 'Guarda las llaves en el stash hasta que tengas la misión activa. No recicles objetos de misión aunque parezcan basura.',
    color: '#fbbf24',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-400/25',
    bgClass: 'bg-amber-400/8',
    fillClass: 'bg-amber-400',
    items: [
      // Dam keys
      { name: 'Dam Control Center Tower Key',   tip: 'Abre la torre del centro de control de la Presa.',                    tags: ['Zona: Presa'] },
      { name: 'Dam Surveillance Key',           tip: 'Acceso a la sala de vigilancia de la Presa.',                        tags: ['Zona: Presa'] },
      { name: 'Dam Controlled Access Zone Key', tip: 'Zona de acceso restringido en la Presa.',                            tags: ['Zona: Presa'] },
      { name: 'Dam Staff Room Key',             tip: 'Sala de personal de la Presa. Suele tener buen loot.',                tags: ['Zona: Presa'] },
      { name: 'Dam Testing Annex Key',          tip: 'Anexo de pruebas en la Presa. Área de loot especial.',                tags: ['Zona: Presa'] },
      { name: 'Dam Utility Key',                tip: 'Acceso a zona de utilidades de la Presa.',                            tags: ['Zona: Presa'] },
      // Spaceport keys
      { name: 'Spaceport Control Tower Key',    tip: 'Torre de control del Puerto Espacial.',                               tags: ['Zona: Puerto Espacial'] },
      { name: 'Spaceport Warehouse Key',        tip: 'Almacén del Puerto Espacial. Contiene materiales Topside.',          tags: ['Zona: Puerto Espacial'] },
      { name: 'Spaceport Container Storage Key',tip: 'Almacén de contenedores del Puerto Espacial.',                       tags: ['Zona: Puerto Espacial'] },
      { name: 'Spaceport Trench Tower Key',     tip: 'Torre de trinchera del Puerto Espacial.',                             tags: ['Zona: Puerto Espacial'] },
      // Stella Montis keys
      { name: 'Stella Montis Archives Key',            tip: 'Archivos de Stella Montis. Objetos de misión de lore.',       tags: ['Zona: Stella Montis'] },
      { name: 'Stella Montis Security Checkpoint Key', tip: 'Puesto de seguridad de Stella Montis.',                       tags: ['Zona: Stella Montis'] },
      { name: 'Stella Montis Assembly Admin Key',      tip: 'Área administrativa de ensamblaje de Stella Montis.',         tags: ['Zona: Stella Montis'] },
      { name: 'Stella Montis Medical Storage Key',     tip: 'Almacén médico de Stella Montis. Materiales médicos.',        tags: ['Zona: Stella Montis'] },
      // Other zone keys / codes
      { name: 'Ancient Fort Security Code',     tip: 'Código de acceso al Fuerte Antiguo. Necesario para zonas bloqueadas.', tags: ['Zona: Fuerte Antiguo'] },
      { name: 'Blue Gate Cellar Key',           tip: 'Abre el sótano en la zona Blue Gate.',                               tags: ['Zona: Blue Gate'] },
      { name: 'Blue Gate Communication Tower Key', tip: 'Torre de comunicaciones de Blue Gate.',                           tags: ['Zona: Blue Gate'] },
      { name: 'Pilgrim\'s Peak Security Code',  tip: 'Acceso a Pilgrim\'s Peak. Zona de alto riesgo.',                     tags: ['Zona: Pilgrim\'s Peak'] },
      { name: 'Raider Hatch Key',               tip: 'Acceso a la guarida de raiders.',                                    tags: ['Base Raider'] },
      { name: 'Raider\'s Refuge Security Code', tip: 'Código del refugio de raiders. Zona con objetos especiales.',        tags: ['Base Raider'] },
      { name: 'Patrol Car Key',                 tip: 'Llave del coche de patrulla. Objeto de misión de recuperación.',     tags: ['Misión: Patrulla'] },
      // Expedition / boss drops
      { name: 'Assessor Matrix',                tip: 'Drop épico de bosses. Se pide en expediciones avanzadas.',            tags: ['Expedición', 'Drop de Boss'] },
      { name: 'Bastion Cell',                   tip: 'Drop épico de bosses. Requerido en expediciones de nivel alto.',     tags: ['Expedición', 'Drop de Boss'] },
      { name: 'Geiger Counter',                 tip: 'Instrumento épico de medición. Se usa en expediciones científicas.', tags: ['Expedición'] },
      { name: 'Magnetron',                      tip: 'Componente épico. Se pide en expediciones de electrónica.',          tags: ['Expedición', 'Drop de Boss'] },
      { name: 'Spectrum Analyzer',              tip: 'Analizador épico. Objeto de expedición de alto valor.',              tags: ['Expedición'] },
      { name: 'Vaporizer Regulator',            tip: 'Regulador épico. Requerido en expediciones avanzadas.',              tags: ['Expedición'] },
      { name: 'Queen Reactor',                  tip: 'Drop legendario de la Queen ARC. Entrega antes de la siguiente raid.', tags: ['Expedición', 'Drop de Boss'] },
      { name: 'Matriarch Reactor',              tip: 'Drop legendario de la Matriarch ARC. Objeto de misión de alto valor.', tags: ['Expedición', 'Drop de Boss'] },
    ],
  },
  {
    id: 'keep',
    title: 'Guardar Siempre',
    subtitle: 'Consumibles de combate que nunca te sobran',
    tip: 'Mantén un stack de cada uno en el stash. En cada raid lleva mínimo 2 Bandage, 1 Vita Shot y un escudo de repuesto.',
    color: '#34d399',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-400/25',
    bgClass: 'bg-emerald-400/8',
    fillClass: 'bg-emerald-400',
    items: [
      // Healing
      { name: 'Bandage',             tip: 'Curación básica ligera. Rellena todos los huecos libres antes de salir.', tags: ['Curación', 'Mesa Básica'] },
      { name: 'Adrenaline Shot',     tip: 'Curación rápida. Lleva siempre 2 como mínimo en cada raid.',              tags: ['Curación', 'Mesa Médica Niv. 1'] },
      { name: 'Herbal Bandage',      tip: 'Mejor que el Bandage estándar. Úsalo en combate intenso.',                tags: ['Curación', 'Mesa Médica'] },
      { name: 'Vita Shot',           tip: 'Restaura una gran cantidad de salud. Imprescindible en raids largas.',    tags: ['Curación', 'Raro'] },
      { name: 'Sterilized Bandage',  tip: 'El mejor bandage del juego. Guarda todos los que encuentres.',            tags: ['Curación', 'Mesa Médica Niv. 2'] },
      { name: 'Defibrillator',       tip: 'Revive compañeros caídos. En equipo, lleva siempre 1.',                   tags: ['Curación', 'Mesa Médica Niv. 3'] },
      // Defense
      { name: 'Barricade Kit',       tip: 'Crea cobertura física en segundos. Decisivo en zonas calientes.',        tags: ['Defensa', 'Mesa de Utilidades'] },
      { name: 'Shield Recharger',    tip: 'Recarga el escudo instantáneamente. Esencial entre enfrentamientos.',    tags: ['Defensa', 'Mesa de Equipamiento'] },
      // Mobility
      { name: 'Zipline',             tip: 'Movilidad vertical inmediata. Muy útil para escapar y flanquear.',       tags: ['Movilidad', 'Raro'] },
      // Tactical
      { name: 'Photoelectric Cloak', tip: 'Invisibilidad temporal. Ventaja táctica enorme en PvP.',                 tags: ['Táctica', 'Épico'] },
      { name: 'Deadline',            tip: 'Utilidad de combate avanzada. Guarda todos los que encuentres.',         tags: ['Táctica', 'Épico'] },
      { name: 'Blaze Grenade',       tip: 'Granada de fuego. Muy efectiva para controlar zonas y cortar flancos.',  tags: ['Combate', 'Mesa de Explosivos'] },
      { name: 'Shrapnel Grenade',    tip: 'Granada de metralla. Alta presión en combate cuerpo a cuerpo.',          tags: ['Combate', 'Mesa de Explosivos'] },
      { name: 'Snap Blast Grenade',  tip: 'Granada de onda expansiva. Útil para despejar zonas cerradas.',         tags: ['Combate', 'Mesa de Explosivos'] },
    ],
  },
]
