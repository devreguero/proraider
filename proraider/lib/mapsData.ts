export type MapDef = {
  id: string
  tileId: string | null  // null = no interactive tiles yet
  name: string
  description: string
  heroImage: string
}

export const MAPS: MapDef[] = [
  {
    id: 'buried-city',
    tileId: 'buried-city',
    name: 'Buried City',
    description: 'Una ciudad subterránea sepultada bajo escombros y ruinas. Rica en loot de alto valor.',
    heroImage: 'https://cdn.arctracker.io/maps/buried_city_hero.png',
  },
  {
    id: 'dam-battleground',
    tileId: 'dam-battleground',
    name: 'Dam Battleground',
    description: 'Complejo de presas industriales con múltiples niveles de combate y recursos escasos.',
    heroImage: 'https://cdn.arctracker.io/maps/dam_battleground_hero.png',
  },
  {
    id: 'the-spaceport',
    tileId: 'the-spaceport',
    name: 'The Spaceport',
    description: 'Puerto espacial abandonado. Zona de alta tecnología con enemigos ARC de élite.',
    heroImage: 'https://cdn.arctracker.io/maps/spaceport_hero.png',
  },
  {
    id: 'blue-gate',
    tileId: 'blue-gate',
    name: 'Blue Gate',
    description: 'Instalación de investigación con accesos restringidos y botín de rareza elevada.',
    heroImage: 'https://cdn.arctracker.io/maps/bluegate_hero.png',
  },
  {
    id: 'stella-montis',
    tileId: null,
    name: 'Stella Montis',
    description: 'Asentamiento en la montaña con dos zonas: nivel superior e inferior.',
    heroImage: 'https://cdn.arctracker.io/maps/stella_montis_hero.png',
  },
]

export function getMapById(id: string): MapDef | undefined {
  return MAPS.find((m) => m.id === id)
}
