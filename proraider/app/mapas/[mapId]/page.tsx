import { notFound } from 'next/navigation'
import { getMapById, MAPS } from '@/lib/mapsData'
import MapLayout from './MapLayout'

export function generateStaticParams() {
  return MAPS.map((m) => ({ mapId: m.id }))
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ mapId: string }>
}) {
  const { mapId } = await params
  const map = getMapById(mapId)
  if (!map) notFound()

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: 'calc(100dvh - var(--navbar-h, 9.5rem))' }}
    >
      <MapLayout map={map} />
    </div>
  )
}
