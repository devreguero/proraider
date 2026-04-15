'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-white/55">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[var(--app-accent)] hover:text-white transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[var(--app-accent)]/50 focus:bg-white/8 focus:ring-1 focus:ring-[var(--app-accent)]/30"
            />
            {state?.errors?.email && (
              <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[var(--app-accent)]/50 focus:bg-white/8 focus:ring-1 focus:ring-[var(--app-accent)]/30"
            />
            {state?.errors?.password && (
              <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
