import { notFound } from 'next/navigation'
import WeaponDetail from './WeaponDetail'

type RawWeapon = {
  id: string
  name: string
  icon: string
  rarity: string
  value: number
  ammo_type: string | null
  subcategory: string | null
  description: string | null
  flavor_text: string | null
  stat_block: Record<string, number | null>
}

function toSlug(name: string) {
  return name
    .replace(/\s+[IVXLCDM]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

async function fetchWeaponLevels(slug: string): Promise<RawWeapon[]> {
  const limit = 100
  let page = 1
  const matched: RawWeapon[] = []

  while (true) {
    const res = await fetch(
      `https://metaforge.app/api/arc-raiders/items?limit=${limit}&page=${page}&item_type=Weapon`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) break
    const json = await res.json()
    const items: RawWeapon[] = json.data ?? []

    for (const item of items) {
      if (toSlug(item.name) === slug) {
        matched.push(item)
      }
    }

    if (!json.pagination?.hasNextPage) break
    page++
  }

  return matched
}

export default async function WeaponPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const levels = await fetchWeaponLevels(slug)

  if (levels.length === 0) notFound()

  return <WeaponDetail levels={levels} />
}
