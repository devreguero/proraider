'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { getSession, createSession } from '@/lib/session'
import { getUserById, getUserByEmail, updateUsername, updateEmail, updatePassword } from '@/lib/db'

export type ProfileState = { error?: string; success?: string }

export async function changeUsername(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }

  const username = (formData.get('username') as string)?.trim()
  if (!username || username.length < 3) return { error: 'El nombre debe tener al menos 3 caracteres.' }
  if (username.length > 24) return { error: 'El nombre no puede tener más de 24 caracteres.' }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { error: 'Solo letras, números, guiones y guiones bajos.' }

  await updateUsername(session.userId, username)
  await createSession({ ...session, username })
  revalidatePath('/configuracion')
  return { success: 'Nombre actualizado.' }
}

export async function changeEmail(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email || !email.includes('@')) return { error: 'Email no válido.' }

  const existing = await getUserByEmail(email)
  if (existing && existing.id !== session.userId) return { error: 'Ese email ya está en uso.' }

  await updateEmail(session.userId, email)
  await createSession({ ...session, email })
  revalidatePath('/configuracion')
  return { success: 'Email actualizado.' }
}

export async function changePassword(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }

  const current = formData.get('current_password') as string
  const newPass = formData.get('new_password') as string
  const confirm = formData.get('confirm_password') as string

  if (!current || !newPass || !confirm) return { error: 'Rellena todos los campos.' }
  if (newPass.length < 8) return { error: 'La nueva contraseña debe tener al menos 8 caracteres.' }
  if (newPass !== confirm) return { error: 'Las contraseñas no coinciden.' }

  const user = await getUserById(session.userId)
  if (!user) return { error: 'Usuario no encontrado.' }

  const match = await bcrypt.compare(current, user.password)
  if (!match) return { error: 'Contraseña actual incorrecta.' }

  const hashed = await bcrypt.hash(newPass, 12)
  await updatePassword(session.userId, hashed)
  return { success: 'Contraseña cambiada correctamente.' }
}
