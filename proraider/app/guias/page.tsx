import Link from 'next/link'
import {
  GUIDES, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS, GUIDE_ICONS,
  type GuideCategory,
} from '@/lib/guidesData'

const DIFFICULTY_COLORS: Record<string, string> = {
  'Principiante': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  'Intermedio':   'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'Avanzado':     'text-red-400 border-red-400/30 bg-red-400/10',
}

const CATEGORY_ORDER: GuideCategory[] = ['primeros-pasos', 'tactica', 'combate', 'economia']

export default function GuiasPage() {
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    guides: GUIDES.filter((g) => g.category === cat),
  }))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Guías</h1>
        <p className="mt-1 text-sm text-white/50">
          {GUIDES.length} guías sobre mecánicas, combate y economía de ARC Raiders
        </p>
      </div>

      {/* Categorías */}
      <div className="space-y-14">
        {byCategory.map(({ cat, guides }) => {
          if (guides.length === 0) return null
          const color = CATEGORY_COLORS[cat]
          const iconPath = CATEGORY_ICONS[cat]
          return (
            <section key={cat}>
              {/* Category header */}
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{ borderColor: `${color}40`, background: `${color}15` }}
                >
                  <svg className="h-4 w-4" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                  </svg>
                </div>
                <h2 className="text-lg font-bold" style={{ color }}>
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs text-white/25">{guides.length} guías</span>
              </div>

              {/* Guide cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => {
                  const guideIcon = GUIDE_ICONS[guide.slug]
                  return (
                    <Link
                      key={guide.slug}
                      href={`/guias/${guide.slug}`}
                      className="loot-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 transition duration-200 hover:border-[var(--app-accent)]/30 hover:shadow-[0_0_30px_rgba(79,195,255,0.08)]"
                    >
                      {/* Hero image */}
                      <div className="relative h-36 w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={guide.heroImage}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />

                        {/* Category badge top-left */}
                        <span
                          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                          style={{ color, borderColor: `${color}40`, background: `${color}18` }}
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                          </svg>
                          {CATEGORY_LABELS[cat]}
                        </span>

                        {/* Difficulty badge top-right */}
                        <span
                          className={`absolute right-3 top-3 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${DIFFICULTY_COLORS[guide.difficulty]}`}
                        >
                          {guide.difficulty}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col bg-[#141414] p-5">
                        {/* Guide icon + title */}
                        <div className="flex items-start gap-3">
                          {guideIcon && (
                            <div
                              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                            >
                              <svg className="h-4 w-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                                <path d={guideIcon} />
                              </svg>
                            </div>
                          )}
                          <h3 className="text-sm font-bold leading-snug text-white transition group-hover:text-[var(--app-accent)]">
                            {guide.title}
                          </h3>
                        </div>

                        <p className="mt-3 flex-1 text-xs leading-relaxed text-white/45">
                          {guide.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3">
                          <span className="flex items-center gap-1.5 text-xs text-white/25">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {guide.readTime} min
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-white/25 transition group-hover:text-[var(--app-accent)]/70">
                            Leer guía
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
