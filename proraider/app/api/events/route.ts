import { NextResponse } from 'next/server'

export const revalidate = 1800 // 30 min

export async function GET() {
  try {
    const res = await fetch('https://arcraidershub.com/data/events.json', {
      next: { revalidate: 1800 },
    })
    if (!res.ok) throw new Error('upstream error')
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener el horario' }, { status: 502 })
  }
}
