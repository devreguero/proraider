import { LOOT_SECTIONS } from '@/lib/lootGuideData'
import type { Item } from '@/app/items/ItemsClient'
import LootGuideClient from './LootGuideClient'

export const metadata = {
  title: 'Guía de Loot · ProRaider',
  description: 'Qué items reciclar, vender, guardar para misiones o mejorar estaciones en ARC Raiders.',
}

async function fetchItemMap(): Promise<Map<string, Pick<Item, 'icon' | 'rarity' | 'item_type'>>> {
  const map = new Map<string, Pick<Item, 'icon' | 'rarity' | 'item_type'>>()
  try {
    const limit = 100
    let page = 1
    while (true) {
      const res = await fetch(
        `https://metaforge.app/api/arc-raiders/items?limit=${limit}&page=${page}`,
        { next: { revalidate: 3600 } },
      )
      if (!res.ok) break
      const json = await res.json()
      for (const item of (json.data ?? []) as Item[]) {
        if (item.name) map.set(item.name, { icon: item.icon, rarity: item.rarity ?? 'Common', item_type: item.item_type })
      }
      if (!json.pagination?.hasNextPage) break
      page++
    }
  } catch { /* return partial map */ }
  return map
}

export default async function LootPage() {
  const itemMap = await fetchItemMap()
  return <LootGuideClient sections={LOOT_SECTIONS} itemMap={itemMap} />
}
