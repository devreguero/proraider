import ItemsClient, { type Item } from './ItemsClient'
import { fetchRecycleMap } from '@/lib/recycleData'

async function fetchAllItems(): Promise<Item[]> {
  const limit = 100
  let page = 1
  let all: Item[] = []

  while (true) {
    const res = await fetch(
      `https://metaforge.app/api/arc-raiders/items?limit=${limit}&page=${page}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) break

    const json = await res.json()
    const items: Item[] = (json.data ?? []).map((item: Item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      item_type: item.item_type ?? 'Unknown',
      rarity: item.rarity ?? 'Common',
      icon: item.icon,
      value: item.value ?? 0,
      weight: item.weight ?? 0,
      stackSize: item.stackSize ?? 1,
      loot_area: item.loot_area ?? null,
      subcategory: item.subcategory ?? null,
      flavor_text: item.flavor_text ?? null,
    }))

    const EXCLUDED = ['Weapon', 'Emote', 'Skin', 'Face', 'Face Paint', 'Cosmetic', 'Misc']
    all = [...all, ...items.filter((i) => !EXCLUDED.includes(i.item_type))]

    if (!json.pagination?.hasNextPage) break
    page++
  }

  return all
}

export default async function ItemsPage() {
  const items = await fetchAllItems()
  const types = [...new Set(items.map((i) => i.item_type).filter(Boolean))].sort()

  const detailMap = await fetchRecycleMap(items.map((i) => i.name))
  const enrichedItems: Item[] = items.map((item) => {
    const d = detailMap.get(item.name)
    if (!d) return item
    return {
      ...item,
      recyclesInto: d.recyclesInto,
      salvagesInto: d.salvagesInto,
      recipe: d.recipe,
      craftBench: d.craftBench,
      stationLevelRequired: d.stationLevelRequired,
      blueprintLocked: d.blueprintLocked,
      effects: d.effects,
      vendors: d.vendors,
    }
  })

  return <ItemsClient items={enrichedItems} types={types} />
}
