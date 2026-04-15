export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-[60vh]">
      <div className="relative h-10 w-10">
        {/* Outer ring */}
        <span className="absolute inset-0 rounded-full border-2 border-white/8" />
        {/* Spinning arc */}
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[var(--app-accent)]" />
      </div>
      <p className="text-xs font-medium text-white/25 tracking-widest uppercase">Cargando</p>
    </div>
  )
}
