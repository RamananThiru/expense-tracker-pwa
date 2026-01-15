"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

type Props = {
  variant?: 'card' | 'icon'
}

export default function SyncLinkCard({ variant = 'card' }: Props) {
  const router = useRouter()

  if (variant === 'icon') {
    return (
      <button
        onClick={() => router.push('/sync')}
        className="ml-2 p-2 rounded-full hover:bg-secondary/10 transition-colors"
        aria-label="Open reference data sync"
        title="Supabase Import"
      >
        <RefreshCw className="h-5 w-5 text-muted-foreground" />
      </button>
    )
  }

  return (
    <button
      onClick={() => router.push('/sync')}
      className="mt-2 inline-flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card hover:bg-hover transition-colors shadow-sm"
      aria-label="Supabase Import"
    >
      <RefreshCw className="h-4 w-4 text-foreground" />
      <div className="text-left">
        <div className="text-sm font-semibold text-foreground">Supabase Import</div>
        <div className="text-xs text-muted-foreground">Sync reference tables</div>
      </div>
    </button>
  )
}
