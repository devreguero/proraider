export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-white/6" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-white/4" />
      </div>
      {/* Filter bar skeleton */}
      <div className="mb-6 flex gap-3">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-white/5" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] p-4"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="h-16 w-16 animate-pulse rounded-xl bg-white/6" />
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div className="h-3.5 w-20 animate-pulse rounded bg-white/6" />
              <div className="h-3 w-14 animate-pulse rounded bg-white/4" />
              <div className="h-3 w-10 animate-pulse rounded bg-white/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
