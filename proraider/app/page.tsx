import Image from 'next/image'
import Link from 'next/link'

const FEATURE_CARDS = [
  {
    title: 'Guías',
    description: 'Mecánicas, extracciones, builds y economía.',
    href: '/guias',
    color: '#4fc3ff',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    title: 'Armas y builds',
    description: 'Tier list, setups y sinergias de perks.',
    href: '/armas',
    color: '#f87171',
    icon: 'M4 20l6-6M14 4l6 6M10 14l4-4M6 18l4 2 2-4',
  },
  {
    title: 'Mapas interactivos',
    description: 'Spawns, extracciones y puntos de interés.',
    href: '/mapas',
    color: '#4ade80',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
]

export default function Home() {
  return (
    <div
      className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 sm:px-10"
      style={{ height: '100dvh' }}
    >

      {/* Luces de fondo */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="anim-glow absolute left-[5%] top-[8%] h-[600px] w-[600px] rounded-full bg-[color:var(--app-accent)]/8 blur-3xl" />
        <div className="anim-glow absolute bottom-[10%] left-[20%] h-[400px] w-[500px] rounded-full bg-[color:var(--app-accent-2)]/6 blur-3xl" style={{ animationDelay: '3s' }} />
      </div>

      {/* Glow detrás del personaje */}
      <div className="pointer-events-none absolute bottom-0 right-[2%] hidden h-[75%] w-[44%] lg:block">
        <div className="anim-glow absolute inset-x-[15%] bottom-0 top-[15%] rounded-full bg-[color:var(--app-accent)]/12 blur-3xl" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Personaje */}
      <div
        className="hero-fade anim-float pointer-events-none absolute bottom-[100px] right-0 hidden h-[calc(100%-100px)] w-[58%] select-none lg:block"
        style={{
          animationDelay: '0.3s',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 72%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 72%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <Image
          src="/hero-raider.png"
          alt="ARC Raiders Raider"
          fill
          priority
          quality={95}
          className="object-contain object-bottom [filter:drop-shadow(0_0_48px_rgba(79,195,255,0.25))_drop-shadow(0_0_16px_rgba(79,195,255,0.15))]"
          sizes="58vw"
        />
      </div>

      {/* Texto hero — centrado verticalmente en el espacio sobre las tarjetas */}
      <div className="relative z-10 flex h-full flex-col justify-center pb-52 pt-8">
        <div className="max-w-xl lg:max-w-[46%]">

          {/* Badge */}
          <div
            className="hero-appear inline-flex items-center gap-2 rounded-full border border-[var(--app-accent)]/20 bg-[var(--app-accent)]/8 px-3 py-1 text-xs font-medium text-[var(--app-accent)]"
            style={{ animationDelay: '100ms' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--app-accent)]" />
            ARC Raiders · guías y recursos
          </div>

          {/* Título */}
          <h1 className="mt-5 font-bold tracking-tight">
            <span className="hero-appear block text-5xl text-white/90 sm:text-6xl xl:text-7xl" style={{ animationDelay: '220ms' }}>
              Entra al raid.
            </span>
            <span className="hero-appear block text-5xl text-white/90 sm:text-6xl xl:text-7xl" style={{ animationDelay: '370ms' }}>
              Saquea el loot.
            </span>
            <span
              className="hero-appear gradient-animate block bg-gradient-to-r from-[color:var(--app-accent-2)] to-[color:var(--app-accent)] bg-clip-text text-5xl text-transparent sm:text-6xl xl:text-7xl"
              style={{ animationDelay: '520ms' }}
            >
              Extrae con vida.
            </span>
          </h1>

          {/* Descripción */}
          <p className="hero-fade mt-5 max-w-sm text-sm leading-7 text-white/50 sm:text-base" style={{ animationDelay: '650ms' }}>
            Guías, builds, rutas de loot y mapas interactivos
            para dominar cada raid en ARC Raiders.
          </p>

          {/* CTAs */}
          <div className="hero-appear mt-8 flex flex-wrap gap-3" style={{ animationDelay: '780ms' }}>
            <Link
              href="/guias"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--app-accent)] px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(79,195,255,0.3)] transition hover:shadow-[0_0_36px_rgba(79,195,255,0.5)]"
            >
              Empezar a leer
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
            <Link
              href="/mapas"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Mapas interactivos
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-fade mt-10 flex gap-8" style={{ animationDelay: '950ms' }}>
            {[
              { value: '5',   label: 'Mapas' },
              { value: '20+', label: 'Armas' },
              { value: '8',   label: 'Guías' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[var(--app-accent)]">{s.value}</div>
                <div className="text-xs text-white/35">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature cards — ancladas al fondo ───────────────────────────── */}
      <div
        className="hero-fade absolute bottom-6 left-6 right-6 z-10 grid gap-4 sm:left-10 sm:right-10 md:grid-cols-3"
        style={{ animationDelay: '1100ms' }}
      >
        {FEATURE_CARDS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="loot-card group flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#161718] p-6 transition hover:border-[var(--app-accent)]/25 hover:bg-[#1c1e20]"
          >
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{ borderColor: `${item.color}30`, background: `${item.color}12`, color: item.color }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white transition group-hover:text-[var(--app-accent)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/45">{item.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: item.color }}>
                Abrir
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
