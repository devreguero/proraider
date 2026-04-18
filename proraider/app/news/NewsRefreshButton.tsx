'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function NewsRefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    await fetch('/api/revalidate-news', { method: 'POST' })
    startTransition(() => {
      router.refresh()
    })
  }

  const spinning = refreshing || isPending

  return (
    <button
      onClick={handleRefresh}
      disabled={spinning}
      title="Actualizar noticias"
      className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/40 transition hover:border-white/20 hover:bg-white/10 hover:text-white/80 disabled:opacity-40"
      onTransitionEnd={() => { if (!isPending) setRefreshing(false) }}
    >
      <svg
        className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
      </svg>
    </button>
  )
}
