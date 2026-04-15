// Spawn coordinates converted from wand.com GeoJSON data to Leaflet CRS.Simple space.
// Source: wand.com/maps/arc-raiders/{map}/checklist/places-of-interest/player-spawn
//
// Wand format: [longitude, latitude]  (GeoJSON order, centered at 0,0)
// Conversion:
//   leaflet_lat = round(-512 + wand_lat  × scale)
//   leaflet_lng = round( 512 + wand_lng  × scale)
//
// Scales used: Buried City & Dam = 7.0 | Spaceport & Blue Gate = 4.0
// (Larger maps have larger wand coordinate values; scale keeps them within [0,1024])
//
// To fine-tune positions, enable DEV_MODE in MapViewer.tsx and click the map.

export type SpawnPoint = {
  lat: number
  lng: number
  label?: string
}

export const SPAWN_DATA: Record<string, SpawnPoint[]> = {
  'buried-city': [
    { lat: -116, lng: 299,  label: 'Spawn 1'  },
    { lat:  -68, lng: 495,  label: 'Spawn 2'  },
    { lat: -127, lng: 753,  label: 'Spawn 3'  },
    { lat: -197, lng: 910,  label: 'Spawn 4'  },
    { lat: -263, lng: 708,  label: 'Spawn 5'  },
    { lat: -257, lng: 404,  label: 'Spawn 6'  },
    { lat: -533, lng: 648,  label: 'Spawn 7'  },
    { lat: -908, lng: 973,  label: 'Spawn 8'  },
    { lat: -882, lng: 790,  label: 'Spawn 9'  },
    { lat: -784, lng: 771,  label: 'Spawn 10' },
    { lat: -720, lng: 473,  label: 'Spawn 11' },
    { lat: -721, lng: 317,  label: 'Spawn 12' },
    { lat: -908, lng: 389,  label: 'Spawn 13' },
    { lat: -800, lng: 303,  label: 'Spawn 14' },
    { lat: -600, lng: 636,  label: 'Spawn 15' },
    { lat: -145, lng: 572,  label: 'Spawn 16' },
    { lat: -855, lng: 426,  label: 'Spawn 17' },
    { lat: -572, lng: 974,  label: 'Spawn 18' },
    { lat: -853, lng: 603,  label: 'Spawn 19' },
  ],

  'dam-battleground': [
    { lat: -379, lng: 919,  label: 'Spawn 1'  },
    { lat: -784, lng: 411,  label: 'Spawn 2'  },
    { lat: -812, lng: 504,  label: 'Spawn 3'  },
    { lat: -397, lng: 183,  label: 'Spawn 4'  },
    { lat: -241, lng: 260,  label: 'Spawn 5'  },
    { lat: -185, lng: 515,  label: 'Spawn 6'  },
    { lat: -144, lng: 625,  label: 'Spawn 7'  },
    { lat: -162, lng: 731,  label: 'Spawn 8'  },
    { lat: -252, lng: 906,  label: 'Spawn 9'  },
    { lat: -741, lng: 293,  label: 'Spawn 10' },
    { lat: -214, lng: 820,  label: 'Spawn 11' },
    { lat: -711, lng: 877,  label: 'Spawn 12' },
    { lat: -534, lng: 179,  label: 'Spawn 13' },
    { lat: -652, lng: 260,  label: 'Spawn 14' },
    { lat: -802, lng: 823,  label: 'Spawn 15' },
    { lat: -341, lng: 758,  label: 'Spawn 16' },
    { lat: -389, lng: 801,  label: 'Spawn 17' },
    { lat: -381, lng: 931,  label: 'Spawn 18' },
    { lat: -566, lng: 806,  label: 'Spawn 19' },
    { lat: -359, lng: 793,  label: 'Spawn 20' },
    { lat: -294, lng: 932,  label: 'Spawn 21' },
    { lat: -730, lng: 338,  label: 'Spawn 22' },
  ],

  // Spaceport — 9 of 21 spawns recovered from wand.com (scale 4.0)
  'the-spaceport': [
    { lat: -183, lng: 216,  label: 'Spawn 1'  },
    { lat: -251, lng: 437,  label: 'Spawn 2'  },
    { lat: -383, lng: 608,  label: 'Spawn 3'  },
    { lat: -206, lng:  39,  label: 'Spawn 4'  },
    { lat: -777, lng: 615,  label: 'Spawn 5'  },
    { lat: -369, lng: 997,  label: 'Spawn 6'  },
    { lat: -745, lng: 958,  label: 'Spawn 7'  },
    { lat: -654, lng: 345,  label: 'Spawn 8'  },
    { lat: -775, lng: 424,  label: 'Spawn 9'  },
  ],

  // Blue Gate — 9 of 20 spawns recovered from wand.com (scale 4.0)
  'blue-gate': [
    { lat: -247, lng: 655,  label: 'Spawn 1'  },
    { lat: -381, lng:  50,  label: 'Spawn 2'  },
    { lat: -684, lng: 876,  label: 'Spawn 3'  },
    { lat: -419, lng: 225,  label: 'Spawn 4'  },
    { lat: -236, lng: 196,  label: 'Spawn 5'  },
    { lat: -241, lng: 770,  label: 'Spawn 6'  },
    { lat: -233, lng: 310,  label: 'Spawn 7'  },
    { lat: -808, lng: 484,  label: 'Spawn 8'  },
    { lat: -361, lng: 927,  label: 'Spawn 9'  },
  ],
}
