'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { createUser, getUserByEmail } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import { SignupSchema, LoginSchema, FormState } from '@/lib/definitions'

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = SignupSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { username, email, password } = result.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return { errors: { email: ['Este email ya está en uso.'] } }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const row = await createUser(username, email, hashedPassword)
    await createSession({ userId: Number(row.lastInsertRowid), email, username })
  } catch {
    return { message: 'Error al crear la cuenta. Inténtalo de nuevo.' }
  }

  redirect('/')
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = LoginSchema.safeParse(raw)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const user = await getUserByEmail(email)
  if (!user) {
    return { message: 'Email o contraseña incorrectos.' }
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return { message: 'Email o contraseña incorrectos.' }
  }

  await createSession({ userId: user.id, email: user.email, username: user.username })

  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
