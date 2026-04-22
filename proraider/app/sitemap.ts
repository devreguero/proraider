import type { MetadataRoute } from 'next'
import { GUIDES } from '@/lib/guidesData'
import { MAPS } from '@/lib/mapsData'

const BASE = 'https://proraider.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                         priority: 1.0, changeFrequency: 'daily'   },
    { url: `${BASE}/guias`,              priority: 0.9, changeFrequency: 'weekly'  },
    { url: `${BASE}/armas`,              priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/mapas`,              priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/builds`,             priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/news`,               priority: 0.8, changeFrequency: 'daily'   },
    { url: `${BASE}/eventos`,            priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/meta`,               priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/loot`,               priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/items`,              priority: 0.6, changeFrequency: 'weekly'  },
    { url: `${BASE}/skill-tree`,         priority: 0.6, changeFrequency: 'weekly'  },
    { url: `${BASE}/marketplace`,        priority: 0.6, changeFrequency: 'daily'   },
  ]

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${BASE}/guias/${g.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }))

  const mapPages: MetadataRoute.Sitemap = MAPS.map((m) => ({
    url: `${BASE}/mapas/${m.id}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  return [...staticPages, ...guidePages, ...mapPages]
}
