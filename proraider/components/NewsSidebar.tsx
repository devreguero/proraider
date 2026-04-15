import Link from 'next/link'

const NEWS = [
  {
    date: '14 abr 2026',
    tag: 'Parche',
    tagColor: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
    title: 'Patch 1.24.0',
    desc: 'Correcciones de crashes, audio en Stella Montis y visulaes AMD FSR. Sin cambios de balance.',
    href: 'https://arcraiders.com/news/patch-notes-1-24-0',
  },
  {
    date: '08 abr 2026',
    tag: 'Parche',
    tagColor: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
    title: 'Patch 1.23.0',
    desc: 'Fix del bug de Trigger\'Nade (3× daño). Exploit del Anvil Splitter eliminado. Items se despliegan más rápido.',
    href: 'https://arcraiders.com/news/patch-notes-1-23-0',
  },
  {
    date: '31 mar 2026',
    tag: 'Actualización',
    tagColor: 'text-violet-400 bg-violet-400/10 border-violet-400/25',
    title: 'Flashpoint · 1.22.0',
    desc: 'Nuevas armas Dolabra y Canto, enemigo Vaporizer, operación Close Scrutiny y ajustes de ARC.',
    href: 'https://arcraiders.com/news/patch-notes-1-22-0',
  },
  {
    date: 'Próximamente',
    tag: 'Mapa',
    tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    title: 'Riven Tides',
    desc: 'Nuevo mapa costero con dunas, acantilados y ruinas inundadas. Nuevo enemigo ARC grande.',
    href: 'https://arcraiders.com/news',
  },
  {
    date: 'Expira pronto',
    tag: 'Evento',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    title: 'High-Gain Antenna',
    desc: 'El proyecto High-Gain Antenna expira antes de Riven Tides. Complétalo antes de finales de abril.',
    href: 'https://arcraiders.com/news',
  },
]

export default function NewsSidebar() {
  return (
    <aside className="fixed bottom-0 left-16 top-0 z-30 hidden w-56 flex-col border-r border-white/6 bg-[#0e0e0e] xl:flex">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/6 px-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--app-accent)] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--app-accent)]" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-white/40">Noticias</span>
      </div>

      {/* News list */}
      <div className="flex flex-1 flex-col gap-px overflow-y-auto py-2 scrollbar-thin">
        {NEWS.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-white/[0.03]"
          >
            {/* Date + tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25">{item.date}</span>
              <span className={`rounded border px-1.5 py-px text-[9px] font-bold ${item.tagColor}`}>
                {item.tag}
              </span>
            </div>
            {/* Title */}
            <p className="text-xs font-semibold leading-tight text-white/70 transition group-hover:text-white">
              {item.title}
            </p>
            {/* Desc */}
            <p className="text-[11px] leading-relaxed text-white/30">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/6 px-4 py-3">
        <Link
          href="https://arcraiders.com/news"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-white/25 transition hover:text-white/50"
        >
          Ver todas en arcraiders.com
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>
      </div>
    </aside>
  )
}
