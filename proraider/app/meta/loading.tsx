export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="h-8 w-32 animate-pulse rounded-lg bg-white/6" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/4" />
      </div>
      {/* Section */}
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s}>
          <div className="mb-4 h-5 w-40 animate-pulse rounded bg-white/6" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] p-3">
                <div className="h-10 w-14 animate-pulse rounded-lg bg-white/6 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-28 animate-pulse rounded bg-white/6" />
                  <div className="h-3 w-48 animate-pulse rounded bg-white/4" />
                </div>
                <div className="flex gap-1">
                  <div className="h-5 w-8 animate-pulse rounded bg-white/5" />
                  <div className="h-5 w-8 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
