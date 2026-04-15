import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getUserById, getListingsByUser } from '@/lib/db'
import { logout } from '@/app/actions/auth'

export const metadata = { title: 'Mi perfil · ProRaider' }

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await getUserById(session.userId)
  if (!user) redirect('/login')

  const listings = await getListingsByUser(session.userId)
  const initial = user.username[0].toUpperCase()

  const joinedDate = new Date(user.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">

      {/* Header */}
      <h1 className="mb-8 text-2xl font-black text-white">Mi perfil</h1>

      {/* Avatar + info */}
      <div className="mb-8 flex items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/15 text-2xl font-black text-[var(--app-accent)]">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-white truncate">{user.username}</p>
          <p className="text-sm text-white/45 truncate">{user.email}</p>
          <p className="mt-1 text-xs text-white/25">Miembro desde {joinedDate}</p>
        </div>
        <Link
          href="/configuracion"
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          Editar
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: 'Anuncios activos', value: listings.length },
          { label: 'Miembro desde', value: new Date(user.created_at).getFullYear() },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-white/35">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Marketplace listings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white/70">Mis anuncios en Marketplace</h2>
          <Link href="/marketplace" className="text-xs text-[var(--app-accent)] transition hover:text-white">
            Ver marketplace →
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] py-12 text-center">
            <p className="text-sm text-white/30">No tienes anuncios activos.</p>
            <Link href="/marketplace" className="mt-2 inline-block text-xs text-[var(--app-accent)] underline">
              Crear anuncio
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {listings.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/85 truncate">
                    {l.offer_item_name} → {l.want_item_name}
                  </p>
                  <p className="text-xs text-white/30">
                    {new Date(l.created_at).toLocaleDateString('es-ES')}
                    {l.note && ` · ${l.note}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-10 border-t border-white/6 pt-6">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-red-400/70 transition hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </form>
      </div>

    </div>
  )
}
