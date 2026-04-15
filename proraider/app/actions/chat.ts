'use server'

import { getSession } from '@/lib/session'
import { getOrCreateConversation, insertMessage, conversationBelongsToUser } from '@/lib/db'

export async function startConversation(otherUserId: number): Promise<{ convId?: number; error?: string }> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }
  if (otherUserId === session.userId) return { error: 'No puedes chatear contigo mismo.' }
  const convId = await getOrCreateConversation(session.userId, otherUserId)
  return { convId }
}

export async function sendMessage(convId: number, content: string): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }

  const trimmed = content.trim()
  if (!trimmed || trimmed.length > 1000) return { error: 'Mensaje inválido.' }

  if (!await conversationBelongsToUser(convId, session.userId)) return { error: 'Sin permiso.' }

  await insertMessage(convId, session.userId, trimmed)
  return {}
}
