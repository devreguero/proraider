import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getConversationsForUser, getTotalUnread } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [conversations, unreadTotal] = await Promise.all([
    getConversationsForUser(session.userId),
    getTotalUnread(session.userId),
  ])

  return NextResponse.json({ conversations, unreadTotal })
}
