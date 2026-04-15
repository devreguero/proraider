import Link from 'next/link'
import { MAPS } from '@/lib/mapsData'

export default function MapasPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Mapas</h1>
        <p className="mt-1 text-sm text-white/50">
          {MAPS.filter((m) => m.tileId).length} mapas interactivos disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAPS.map((map) => (
          <Link
            key={map.id}
            href={`/mapas/${map.id}`}
            className="loot-card group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition duration-200 hover:border-[var(--app-accent)]/30 hover:shadow-[0_0_30px_rgba(79,195,255,0.08)]"
          >
            {/* Hero image */}
            <div className="relative h-48 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={map.heroImage}
                alt={map.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

              {/* Interactive badge */}
              {map.tileId ? (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--app-accent)]/40 bg-[var(--app-accent)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--app-accent)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--app-accent)]" />
                  Interactivo
                </span>
              ) : (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white/40">
                  Próximamente
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h2 className="text-lg font-bold text-white transition group-hover:text-[var(--app-accent)]">
                {map.name}
              </h2>
              <p className="mt-1 text-sm text-white/45 leading-relaxed">{map.description}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/30 transition group-hover:text-[var(--app-accent)]/70">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Abrir mapa
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
