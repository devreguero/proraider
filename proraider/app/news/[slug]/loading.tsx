export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Back link */}
      <div className="mb-8 h-4 w-28 animate-pulse rounded bg-white/5" />
      {/* Category + date */}
      <div className="mb-4 flex gap-2">
        <div className="h-5 w-20 animate-pulse rounded bg-white/6" />
        <div className="h-5 w-24 animate-pulse rounded bg-white/4" />
      </div>
      {/* Title */}
      <div className="mb-2 h-9 w-3/4 animate-pulse rounded-lg bg-white/6" />
      <div className="mb-6 h-9 w-1/2 animate-pulse rounded-lg bg-white/5" />
      {/* Hero image */}
      <div className="mb-8 h-72 w-full animate-pulse rounded-2xl bg-white/5" />
      {/* Body paragraphs */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-white/5" style={{ width: `${75 + Math.sin(i) * 20}%`, animationDelay: `${i * 40}ms` }} />
        ))}
        <div className="pt-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-white/4" style={{ width: `${60 + Math.cos(i) * 25}%`, animationDelay: `${i * 40}ms` }} />
        ))}
      </div>
    </div>
  )
}
