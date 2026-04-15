import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getGuideBySlug, GUIDES,
  CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS, GUIDE_ICONS,
  type GuideSection,
} from '@/lib/guidesData'

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

// Icons for tip / warning callouts
const TIP_ICON = 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
const WARN_ICON = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'

function renderSection(section: GuideSection, i: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2 key={i} className="mt-10 flex items-center gap-2.5 text-xl font-bold text-white">
          <span className="h-5 w-0.5 rounded-full bg-[var(--app-accent)]" />
          {section.content}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={i} className="mt-7 flex items-center gap-2 text-base font-bold text-white/85">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-accent)]/60" />
          {section.content}
        </h3>
      )
    case 'text':
      return (
        <p key={i} className="mt-4 text-sm leading-7 text-white/60">
          {section.content}
        </p>
      )
    case 'tip':
      return (
        <div
          key={i}
          className="mt-6 flex gap-4 rounded-xl border border-[var(--app-accent)]/20 bg-[var(--app-accent)]/5 p-4"
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--app-accent)]/25 bg-[var(--app-accent)]/10">
            <svg className="h-4 w-4 text-[var(--app-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={TIP_ICON} />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--app-accent)]">
              {section.title}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-white/60">{section.content}</p>
          </div>
        </div>
      )
    case 'warning':
      return (
        <div
          key={i}
          className="mt-6 flex gap-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4"
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-400/10">
            <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={WARN_ICON} />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-400">
              {section.title}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-white/60">{section.content}</p>
          </div>
        </div>
      )
    case 'list':
      return (
        <div key={i} className="mt-5">
          {section.title && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/35">
              {section.title}
            </p>
          )}
          <ul className="space-y-2.5">
            {section.items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--app-accent)]/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    case 'image':
      return (
        <div key={i} className="mt-6 overflow-hidden rounded-xl border border-white/8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.src}
            alt={section.alt}
            className="w-full object-cover"
          />
          {section.caption && (
            <p className="border-t border-white/8 px-4 py-2.5 text-xs text-white/35">
              {section.caption}
            </p>
          )}
        </div>
      )
  }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  'Principiante': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  'Intermedio':   'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'Avanzado':     'text-red-400 border-red-400/30 bg-red-400/10',
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const color     = CATEGORY_COLORS[guide.category]
  const catIcon   = CATEGORY_ICONS[guide.category]
  const guideIcon = GUIDE_ICONS[guide.slug]

  const related = GUIDES.filter(
    (g) => g.category === guide.category && g.slug !== guide.slug
  ).slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Back + Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/guias"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white/80"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <div className="flex items-center gap-2 text-xs text-white/25">
          <span>Guías</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span style={{ color }}>{CATEGORY_LABELS[guide.category]}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl border border-white/8 sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/60 to-transparent" />

        {/* Bottom-left content over image */}
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm"
              style={{ color, borderColor: `${color}50`, background: `${color}20` }}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={catIcon} />
              </svg>
              {CATEGORY_LABELS[guide.category]}
            </span>
            {/* Difficulty */}
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${DIFFICULTY_COLORS[guide.difficulty]}`}
            >
              {guide.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="mb-2">
        <div className="flex items-start gap-4">
          {guideIcon && (
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <svg className="h-5 w-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d={guideIcon} />
              </svg>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {guide.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/50">{guide.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/25">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {guide.readTime} min de lectura
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>ARC Raiders</span>
        </div>
      </header>

      {/* Divider */}
      <div className="my-8 h-px bg-white/8" />

      {/* Content */}
      <article>
        {guide.sections.map((section, i) => renderSection(section, i))}
      </article>

      {/* Related guides */}
      {related.length > 0 && (
        <>
          <div className="my-12 h-px bg-white/8" />
          <section>
            <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/30">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              Más guías
            </h2>
            <div className="space-y-3">
              {related.map((g) => {
                const c  = CATEGORY_COLORS[g.category]
                const gi = GUIDE_ICONS[g.slug]
                return (
                  <Link
                    key={g.slug}
                    href={`/guias/${g.slug}`}
                    className="group flex items-center gap-4 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] transition hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.heroImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0e0e0e]/50" />
                      {gi && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                            <path d={gi} />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col py-3">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: c }}
                      >
                        {CATEGORY_LABELS[g.category]}
                      </span>
                      <span className="mt-0.5 truncate text-sm font-medium text-white/70 transition group-hover:text-white">
                        {g.title}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 pr-4 text-xs text-white/25">
                      <span>{g.readTime} min</span>
                      <svg className="h-4 w-4 transition group-hover:text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>

            <Link
              href="/guias"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/30 transition hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Ver todas las guías
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
