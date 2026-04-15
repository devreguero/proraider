import EventosClient from './EventosClient'

export const metadata = {
  title: 'Eventos en Vivo · ProRaider',
  description: 'Eventos activos ahora mismo en cada mapa de ARC Raiders con timers en tiempo real.',
}

async function fetchEventData() {
  try {
    const res = await fetch('https://arcraidershub.com/data/events.json', {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function EventosPage() {
  const data = await fetchEventData()
  return <EventosClient initialData={data} />
}
