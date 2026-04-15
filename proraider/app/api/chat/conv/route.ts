import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getMessagesForConversation, conversationBelongsToUser } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const convId = parseInt(req.nextUrl.searchParams.get('id') ?? '', 10)
  if (!convId || !await conversationBelongsToUser(convId, session.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const messages = await getMessagesForConversation(convId, session.userId)
  return NextResponse.json({ messages })
}
