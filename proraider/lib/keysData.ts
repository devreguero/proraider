// Key room coordinates converted from jakebry/arc-raiders-map pixel space to Leaflet CRS.Simple.
//
// Source: github.com/jakebry/arc-raiders-map (open-source, MIT)
// Original pixel coords: [y, x] relative to full image (with border).
//
// Conversion per map:
//   Buried City   — 4896×4896, border 400 → effective 4096×4096 → scale 1024/4096 = 0.25
//   Dam           — 4896×4540, border 400 → effective 4096×3740 → lat_scale 1024/3740 ≈ 0.2738, lng_scale 0.25
//   Spaceport     — 4896×4896, border 400 → effective 4096×4096 → scale 0.25
//   Blue Gate     — 4896×3872, border 400 → effective 4096×3072 → lat_scale 1024/3072 ≈ 0.3333, lng_scale 0.25
//
//   leaflet_lat = -Math.round((pixel_y - border) * lat_scale)
//   leaflet_lng =  Math.round((pixel_x - border) * lng_scale)

export type Rarity = 'uncommon' | 'rare' | 'epic' | 'power-rod' | 'fuel-cell'

export type KeyPoint = {
  id: string
  name: string
  rarity: Rarity
  lat: number
  lng: number
  location: string
  description: string
}

export const KEYS_DATA: Record<string, KeyPoint[]> = {
  'buried-city': [
    {
      id: 'bc_residential',
      name: 'Buried City Residential Master Key',
      rarity: 'uncommon',
      lat: -642, lng: 305,
      location: 'Plaza Rosa / Grandioso Apartments',
      description: 'Unlocks apartment doors in the Plaza Rosa area and Grandioso Apartments. Good medical loot.',
    },
    {
      id: 'bc_jkv',
      name: 'Buried City JKV Employee Card',
      rarity: 'uncommon',
      lat: -416, lng: 584,
      location: 'Space Travel Building — NE Section (4th Floor)',
      description: 'Unlocks a room in the J Kozma Ventures building. Reliable electrical loot.',
    },
    {
      id: 'bc_hospital',
      name: 'Buried City Hospital Key',
      rarity: 'rare',
      lat: -288, lng: 511,
      location: 'Hospital — Third Floor NW',
      description: 'Great room for medical upgrades. Often guarded by a Turret outside the door.',
    },
    {
      id: 'bc_town_hall',
      name: 'Buried City Town Hall Key',
      rarity: 'epic',
      lat: -545, lng: 538,
      location: 'Town Hall — Northern Side Ground Level',
      description: 'Unlocks the entire Town Hall building. One of the best keys in the game — high PvP risk.',
    },
  ],

  'dam-battleground': [
    {
      id: 'dam_surveillance',
      name: 'Dam Surveillance Key',
      rarity: 'uncommon',
      lat: -511, lng: 410,
      location: 'Water Treatment Control — SW Hallway',
      description: 'Room in the Water Treatment Control building. Decent loot, chance for weapon crate.',
    },
    {
      id: 'dam_staff_room',
      name: 'Dam Staff Room Key',
      rarity: 'uncommon',
      lat: -544, lng: 530,
      location: 'Research & Administration — First Floor',
      description: 'Subpar room but the floor above has great trinket and medical spawns.',
    },
    {
      id: 'dam_testing_annex_1',
      name: 'Dam Testing Annex Key',
      rarity: 'rare',
      lat: -637, lng: 617,
      location: 'Testing Annex — Ground Floor (Door 1)',
      description: 'One of two doors in Testing Annex. Popular PvP zone — campers often wait on the roof.',
    },
    {
      id: 'dam_testing_annex_2',
      name: 'Dam Testing Annex Key',
      rarity: 'rare',
      lat: -636, lng: 625,
      location: 'Testing Annex — Ground Floor (Door 2)',
      description: 'Second door in Testing Annex. Same key opens both doors.',
    },
    {
      id: 'dam_control_tower',
      name: 'Dam Control Tower Key',
      rarity: 'epic',
      lat: -525, lng: 547,
      location: 'Control Tower — Top Floor',
      description: 'One of the deadliest rooms on Dam. High-value loot but only one exit — bring mines.',
    },
    {
      id: 'dam_power_rod',
      name: 'Power Rod Door',
      rarity: 'power-rod',
      lat: -345, lng: 652,
      location: 'Testing Annex — Power Rod Room',
      description: 'Requires a Power Rod to open. Contains high-value electrical and crafting loot.',
    },
    {
      id: 'dam_fuel_cell',
      name: 'Fuel Cell Door',
      rarity: 'fuel-cell',
      lat: -356, lng: 582,
      location: 'Research & Administration — Fuel Cell Room',
      description: 'Requires a Fuel Cell to open. Good source of energy components and rare materials.',
    },
  ],
  'the-spaceport': [
    {
      id: 'sp_trench_tower',
      name: 'Spaceport Trench Tower Key',
      rarity: 'uncommon',
      lat: -294, lng: 546,
      location: 'North/South Trench Tower',
      description: 'Accesses towers overlooking the trench. Strong positional advantage, heavily contested.',
    },
    {
      id: 'sp_warehouse',
      name: 'Spaceport Warehouse Key',
      rarity: 'uncommon',
      lat: -283, lng: 450,
      location: 'Shipping Warehouse — Top of Catwalk',
      description: 'Large indoor loot zone. Warehouses are noisy and frequently patrolled by ARC.',
    },
    {
      id: 'sp_ground_control',
      name: 'Spaceport Control Tower Key',
      rarity: 'uncommon',
      lat: -535, lng: 498,
      location: 'Ground Control Tower — Upper Level',
      description: 'High-ground interior with valuable loot. High visibility makes prolonged looting risky.',
    },
    {
      id: 'sp_container_storage',
      name: 'Spaceport Container Storage Key',
      rarity: 'rare',
      lat: -543, lng: 590,
      location: 'Container Storage — Top Floor Red Door',
      description: 'Shipping containers with loot caches. Exposed position, easy to third-party.',
    },
  ],
  'blue-gate': [
    {
      id: 'bg_village',
      name: 'Blue Gate Village Key',
      rarity: 'uncommon',
      lat: -334, lng: 357,
      location: 'Village — House with Barred Front Door',
      description: 'Poor loot even during Night Raids. Very safe room, few players contest it.',
    },
    {
      id: 'bg_patrol_car',
      name: 'Blue Gate Patrol Car Key',
      rarity: 'uncommon',
      lat: -470, lng: 521,
      location: 'Traffic Tunnel — Armored Patrol Car',
      description: 'Unlocks armored patrol cars inside the tunnel. Good for weapon farming.',
    },
    {
      id: 'bg_cellar_trappers',
      name: 'Blue Gate Cellar Key',
      rarity: 'rare',
      lat: -458, lng: 316,
      location: 'Cellar — Trappers Glade',
      description: 'Locked cellar in the Trappers Glade area. Weapons, blueprints and crafting materials.',
    },
    {
      id: 'bg_cellar',
      name: 'Blue Gate Cellar Key',
      rarity: 'rare',
      lat: -672, lng: 420,
      location: 'Cellar — South of Ruined Homestead',
      description: 'Locked cellar near the Olive Grove. Weapons, blueprints, grenades. Quiet area.',
    },
    {
      id: 'bg_comm_tower',
      name: 'Blue Gate Communication Tower Key',
      rarity: 'rare',
      lat: -357, lng: 713,
      location: 'Communication Tower — Underground Storage',
      description: 'Reliable electrical loot on Pilgrim\'s Peak. No big drops but consistent.',
    },
  ],
}
