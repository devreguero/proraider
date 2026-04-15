import { getListings } from '@/lib/db'
import { getSession } from '@/lib/session'
import MarketplaceClient from './MarketplaceClient'
import type { Item } from '@/app/items/ItemsClient'

export const metadata = {
  title: 'Marketplace · ProRaider',
  description: 'Compra, vende e intercambia items de ARC Raiders con otros jugadores.',
}

async function fetchItems(): Promise<Pick<Item, 'id' | 'name' | 'rarity' | 'icon' | 'item_type'>[]> {
  const EXCLUDED = ['Weapon', 'Emote', 'Skin', 'Face', 'Face Paint', 'Cosmetic', 'Misc']
  const limit = 100
  let page = 1
  const all: Pick<Item, 'id' | 'name' | 'rarity' | 'icon' | 'item_type'>[] = []

  try {
    while (true) {
      const res = await fetch(
        `https://metaforge.app/api/arc-raiders/items?limit=${limit}&page=${page}`,
        { next: { revalidate: 3600 } },
      )
      if (!res.ok) break
      const json = await res.json()
      const items = (json.data ?? []) as Item[]
      for (const item of items) {
        if (!EXCLUDED.includes(item.item_type ?? '')) {
          all.push({ id: item.id, name: item.name, rarity: item.rarity ?? 'Common', icon: item.icon, item_type: item.item_type })
        }
      }
      if (!json.pagination?.hasNextPage) break
      page++
    }
  } catch {
    // return whatever we have so far
  }

  return all
}

export default async function MarketplacePage() {
  const [listings, session, items] = await Promise.all([
    getListings(),
    getSession(),
    fetchItems(),
  ])

  return <MarketplaceClient initialListings={listings} session={session} items={items} />
}
