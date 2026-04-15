import Image from 'next/image'
import Link from 'next/link'
import { fetchArcRaidersNews } from '@/lib/news'

export const metadata = {
  title: 'News · ProRaider',
  description: 'Últimas noticias, parches y actualizaciones de ARC Raiders.',
}

// Revalidate every hour so new posts appear automatically
export const revalidate = 3600

const CATEGORY_COLORS: Record<string, string> = {
  'Patch Notes':      'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'Content Update':   'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Update':           'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Community':        'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  'Developer Blog':   'text-amber-400 bg-amber-400/10 border-amber-400/25',
  'News':             'text-sky-400 bg-sky-400/10 border-sky-400/25',
  'Event':            'text-orange-400 bg-orange-400/10 border-orange-400/25',
}

function categoryColor(cat: string) {
  return (
    CATEGORY_COLORS[cat] ??
    Object.entries(CATEGORY_COLORS).find(([k]) =>
      cat.toLowerCase().includes(k.toLowerCase())
    )?.[1] ??
    'text-white/40 bg-white/5 border-white/10'
  )
}

export default async function NewsPage() {
  const items = await fetchArcRaidersNews()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">News</h1>
          <p className="mt-1.5 text-sm text-white/35">
            Noticias oficiales de ARC Raiders · Actualización automática
          </p>
        </div>
        <Link
          href="https://arcraiders.com/news"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/25 transition hover:text-white/50"
        >
          arcraiders.com
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>
      </div>

      {/* No results fallback */}
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] py-16 text-center">
          <svg className="h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-white/30">No se pudo conectar con arcraiders.com</p>
          <Link
            href="https://arcraiders.com/news"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--app-accent)] underline"
          >
            Ver noticias en la web oficial
          </Link>
        </div>
      )}

      {/* Grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-white/[0.03]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-10 w-10 text-white/10" fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                    </svg>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 via-transparent to-transparent" />
                {/* Category badge */}
                {item.category && (
                  <span className={`absolute left-3 top-3 rounded border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${categoryColor(item.category)}`}>
                    {item.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="text-sm font-bold leading-snug text-white/85 transition group-hover:text-white">
                  {item.title}
                </h2>
                {item.date && (
                  <p className="mt-auto text-[11px] text-white/25">{item.date}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
