import WeaponsClient, { type WeaponGroup } from './WeaponsClient'

type RawWeapon = {
  id: string
  name: string
  icon: string
  rarity: string
  value: number
  ammo_type: string | null
  subcategory: string | null
  stat_block: Record<string, number | null>
}

function toSlug(baseName: string) {
  return baseName.toLowerCase().replace(/\s+/g, '-')
}

function baseName(name: string) {
  // Trim first so trailing spaces don't break the $ anchor
  return name.trim().replace(/\s+(I{1,3}V?|IV|V?I{1,3}|IX|X{1,3}|\d+)$/i, '').trim()
}

async function fetchWeapons(): Promise<RawWeapon[]> {
  const limit = 100
  let page = 1
  let all: RawWeapon[] = []

  while (true) {
    const res = await fetch(
      `https://metaforge.app/api/arc-raiders/items?limit=${limit}&page=${page}&item_type=Weapon`,
      { cache: 'no-store' }
    )
    if (!res.ok) break
    const json = await res.json()
    all = [...all, ...(json.data ?? [])]
    if (!json.pagination?.hasNextPage) break
    page++
  }

  return all
}

export default async function ArmasPage() {
  const weapons = await fetchWeapons()

  // Agrupar por nombre base (sin el nivel romano)
  const grouped = new Map<string, { weapons: RawWeapon[]; slug: string }>()

  for (const w of weapons) {
    const base = baseName(w.name)
    const slug = toSlug(base)
    if (!grouped.has(slug)) {
      grouped.set(slug, { weapons: [], slug })
    }
    grouped.get(slug)!.weapons.push(w)
  }

  // Segunda pasada: fusionar grupos cuyo nombre base coincida
  // (cubre casos donde el regex no eliminó el sufijo y se creó un slug distinto)
  const mergedMap = new Map<string, { weapons: RawWeapon[]; slug: string }>()
  for (const entry of grouped.values()) {
    const canonicalName = baseName(entry.weapons[0].name)
    const canonicalSlug = toSlug(canonicalName)
    if (!mergedMap.has(canonicalSlug)) {
      mergedMap.set(canonicalSlug, { weapons: [], slug: canonicalSlug })
    }
    mergedMap.get(canonicalSlug)!.weapons.push(...entry.weapons)
  }

  const weaponGroups: WeaponGroup[] = [...mergedMap.values()].map(({ weapons: group, slug }) => {
    // Representante: nivel I si existe, si no el de menor nivel
    const sorted = [...group].sort((a, b) => a.name.localeCompare(b.name))
    const representative = sorted.find((w) => /\sI$/i.test(w.name.trim())) ?? sorted[0]
    return {
      slug,
      name: baseName(representative.name),
      icon: representative.icon,
      ammo_type: representative.ammo_type,
      subcategory: representative.subcategory,
      levelsCount: group.length,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))

  return <WeaponsClient weapons={weaponGroups} />
}
