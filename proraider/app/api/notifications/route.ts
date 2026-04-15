import { NextResponse } from 'next/server'
import { fetchArcRaidersNews } from '@/lib/news'

export const revalidate = 3600

export async function GET() {
  const items = await fetchArcRaidersNews()
  return NextResponse.json(
    items.map((item) => ({
      id: item.slug,
      title: item.title,
      category: item.category,
      date: item.date,
      href: `/news/${item.slug}`,
    }))
  )
}
