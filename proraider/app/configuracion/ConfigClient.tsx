'use client'

import { useActionState } from 'react'
import { changeUsername, changeEmail, changePassword, type ProfileState } from '@/app/actions/profile'

const initialState: ProfileState = {}

function StatusMsg({ state }: { state: ProfileState }) {
  if (state.error) return (
    <p className="mt-2 text-xs text-red-400">{state.error}</p>
  )
  if (state.success) return (
    <p className="mt-2 text-xs text-emerald-400">{state.success}</p>
  )
  return null
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
      <h2 className="mb-5 text-sm font-bold text-white/70">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white/40">{label}</span>
      {children}
    </label>
  )
}

const inputCls = "rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--app-accent)]/50 focus:ring-1 focus:ring-[var(--app-accent)]/20"
const btnCls = "mt-4 w-full rounded-xl bg-[var(--app-accent)]/15 border border-[var(--app-accent)]/25 px-4 py-2.5 text-sm font-semibold text-[var(--app-accent)] transition hover:bg-[var(--app-accent)]/25 hover:border-[var(--app-accent)]/40"

export default function ConfigClient({ username, email }: { username: string; email: string }) {
  const [usernameState, usernameAction, pendingUsername] = useActionState(changeUsername, initialState)
  const [emailState, emailAction, pendingEmail] = useActionState(changeEmail, initialState)
  const [passwordState, passwordAction, pendingPassword] = useActionState(changePassword, initialState)

  return (
    <div className="flex flex-col gap-6">

      {/* Nombre de usuario */}
      <Section title="Nombre de usuario">
        <form action={usernameAction}>
          <Field label="Nuevo nombre">
            <input
              name="username"
              type="text"
              defaultValue={username}
              placeholder={username}
              maxLength={24}
              className={inputCls}
            />
          </Field>
          <StatusMsg state={usernameState} />
          <button type="submit" disabled={pendingUsername} className={btnCls}>
            {pendingUsername ? 'Guardando...' : 'Guardar nombre'}
          </button>
        </form>
      </Section>

      {/* Email */}
      <Section title="Correo electrónico">
        <form action={emailAction}>
          <Field label="Nuevo email">
            <input
              name="email"
              type="email"
              defaultValue={email}
              placeholder={email}
              className={inputCls}
            />
          </Field>
          <StatusMsg state={emailState} />
          <button type="submit" disabled={pendingEmail} className={btnCls}>
            {pendingEmail ? 'Guardando...' : 'Guardar email'}
          </button>
        </form>
      </Section>

      {/* Contraseña */}
      <Section title="Cambiar contraseña">
        <form action={passwordAction}>
          <div className="flex flex-col gap-3">
            <Field label="Contraseña actual">
              <input name="current_password" type="password" placeholder="••••••••" className={inputCls} />
            </Field>
            <Field label="Nueva contraseña">
              <input name="new_password" type="password" placeholder="Mín. 8 caracteres" className={inputCls} />
            </Field>
            <Field label="Confirmar nueva contraseña">
              <input name="confirm_password" type="password" placeholder="Repite la contraseña" className={inputCls} />
            </Field>
          </div>
          <StatusMsg state={passwordState} />
          <button type="submit" disabled={pendingPassword} className={btnCls}>
            {pendingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </Section>

    </div>
  )
}
