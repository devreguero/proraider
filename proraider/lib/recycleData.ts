export type RecycleYield = Record<string, number>

export type ItemDetailFromRT = {
  recyclesInto?: RecycleYield
  salvagesInto?: RecycleYield
  recipe?: RecycleYield
  craftBench?: string | string[]
  stationLevelRequired?: number
  blueprintLocked?: boolean
  effects?: Record<string, { value: string | number }>
  vendors?: { trader: string; cost: Record<string, number>; limit?: number }[]
}

type RawRaidTheoryItem = ItemDetailFromRT & { id: string }

/** Convert a MetaForge item name to the expected RaidTheory filename ID */
export function toRaidTheoryId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

/** Convert a RaidTheory item/material ID to a display name */
export function formatMaterialName(id: string): string {
  return id
    .split('_')
    .map((w) => (w === 'arc' ? 'ARC' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

const BENCH_NAMES: Record<string, string> = {
  in_raid: 'En Incursión',
  med_station: 'Estación Médica',
  utility_bench: 'Mesa de Utilidades',
  workbench: 'Banco de Trabajo',
  refiner: 'Refinería',
  gear_station: 'Estación de Equipo',
  electronics_bench: 'Banco Electrónico',
}

export function formatBenchName(id: string): string {
  return BENCH_NAMES[id] ?? formatMaterialName(id)
}

const BASE = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items'

/** Fetch detail data for all given item names, returning a map of name → ItemDetailFromRT */
export async function fetchRecycleMap(
  names: string[]
): Promise<Map<string, ItemDetailFromRT>> {
  const unique = [...new Set(names)]
  const map = new Map<string, ItemDetailFromRT>()

  const settled = await Promise.allSettled(
    unique.map(async (name) => {
      const id = toRaidTheoryId(name)
      const res = await fetch(`${BASE}/${id}.json`, {
        next: { revalidate: 3600 },
      })
      if (!res.ok) return null
      const data: RawRaidTheoryItem = await res.json()

      const info: ItemDetailFromRT = {}
      if (data.recyclesInto) info.recyclesInto = data.recyclesInto
      if (data.salvagesInto) info.salvagesInto = data.salvagesInto
      if (data.recipe) info.recipe = data.recipe
      if (data.craftBench) info.craftBench = data.craftBench
      if (data.stationLevelRequired) info.stationLevelRequired = data.stationLevelRequired
      if (data.blueprintLocked) info.blueprintLocked = data.blueprintLocked
      if (data.effects) {
        // Flatten: keep only { effectKey: { value } } to avoid huge multilingual payloads
        info.effects = Object.fromEntries(
          Object.entries(data.effects).map(([k, v]: [string, { value: string | number }]) => [k, { value: v.value }])
        )
      }
      if (data.vendors) info.vendors = data.vendors

      const hasData = Object.keys(info).length > 0
      return hasData ? { name, info } : null
    })
  )

  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) {
      map.set(result.value.name, result.value.info)
    }
  }

  return map
}
