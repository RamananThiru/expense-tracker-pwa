import { useState, useCallback, useEffect } from "react"
import { SyncEngine } from "@/lib/sync/engine"
import { useRouter } from "next/navigation"

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const refreshLastSync = useCallback(async () => {
    const time = await SyncEngine.getLastSyncTime()
    setLastSyncTime(time)
  }, [])

  useEffect(() => {
    refreshLastSync()
  }, [refreshLastSync])

  const sync = useCallback(async () => {
    if (isSyncing) return
    try {
      setIsSyncing(true)
      setError(null)

      console.log("Triggering sync...")
      // 1. Push local changes
      await SyncEngine.pushChanges()

      // 2. No pulling in V1

      // 3. Update status (just time)
      await refreshLastSync()

      // 4. Notify UI
      window.dispatchEvent(new Event('expense-tracker-db-change'))

    } catch (err) {
      console.error("Sync failed:", err)
      setError(err instanceof Error ? err : new Error('Sync failed'))
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, refreshLastSync])

  const bootstrap = useCallback(async () => {
    if (isSyncing) return
    try {
      setIsSyncing(true)
      await SyncEngine.bootstrap()
      await refreshLastSync()
      window.dispatchEvent(new Event('expense-tracker-db-change'))
    } catch (err) {
      console.error("Bootstrap failed:", err)
      setError(err instanceof Error ? err : new Error('Bootstrap failed'))
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, refreshLastSync])

  return {
    sync,
    bootstrap,
    isSyncing,
    lastSyncTime,
    error
  }
}
