"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

export default function SyncLinkCard() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/sync')}
      className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/5 hover:bg-secondary/10 transition-colors text-sm"
      aria-label="Open reference data sync"
    >
      <RefreshCw className="h-4 w-4 text-muted-foreground" />
      <span>Import from Supabase</span>
    </button>
  )
}
