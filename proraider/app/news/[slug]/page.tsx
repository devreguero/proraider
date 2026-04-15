import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchArticleContent } from '@/lib/news'

export const revalidate = 3600

const CATEGORY_COLORS: Record<string, string> = {
  'Patch Notes':    'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'Content Update': 'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Update':         'text-violet-400 bg-violet-400/10 border-violet-400/25',
  'Community':      'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  'Developer Blog': 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  'News':           'text-sky-400 bg-sky-400/10 border-sky-400/25',
  'Event':          'text-orange-400 bg-orange-400/10 border-orange-400/25',
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

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleContent(slug)
  return {
    title: article ? `${article.title} · ProRaider` : 'Noticia · ProRaider',
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleContent(slug)

  if (!article) notFound()

  const hasContent = article.html.trim().length > 200

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">

      {/* Back */}
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-white/30 transition hover:text-white/60"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver a News
      </Link>

      {/* Category + date */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {article.category && (
          <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${categoryColor(article.category)}`}>
            {article.category}
          </span>
        )}
        {article.date && (
          <span className="text-xs text-white/30">{article.date}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="mb-6 text-3xl font-black leading-tight text-white">
        {article.title}
      </h1>

      {/* Hero image */}
      {article.image && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/40 to-transparent" />
        </div>
      )}

      {/* Article body */}
      {hasContent ? (
        <div
          className="article-body prose-invert"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      ) : (
        /* Fallback when we couldn't parse the content */
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] py-16 text-center">
          <svg className="h-8 w-8 text-white/15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <p className="text-sm text-white/40">No se pudo cargar el contenido del artículo.</p>
          <Link
            href={`https://arcraiders.com/news/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60 transition hover:bg-white/[0.08] hover:text-white/90"
          >
            Leer en arcraiders.com
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>
      )}

      {/* Attribution footer */}
      <div className="mt-10 flex items-center justify-between border-t border-white/6 pt-6">
        <span className="text-xs text-white/20">Contenido de arcraiders.com</span>
        <Link
          href={`https://arcraiders.com/news/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-white/25 transition hover:text-white/50"
        >
          Ver original
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
