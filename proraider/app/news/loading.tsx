export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-8 w-20 animate-pulse rounded-lg bg-white/6" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-white/4" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02]"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="h-44 w-full animate-pulse bg-white/5" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-white/6" />
              <div className="h-4 w-full animate-pulse rounded bg-white/6" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/4" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
