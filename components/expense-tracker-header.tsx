import { RefreshCw } from "lucide-react"

interface ExpenseTrackerHeaderProps {
  monthlyTotal: number
  sync: () => void
  isSyncing: boolean
  syncError: Error | string | null
  lastSyncTime: string | null
  mounted: boolean
}

export function ExpenseTrackerHeader({
  monthlyTotal,
  sync,
  isSyncing,
  syncError,  
  lastSyncTime,
  mounted,
}: ExpenseTrackerHeaderProps) {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Expense Tracker</h2>
        </div>

        {/* Amount Section */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Spent this month</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-light text-muted-foreground">₹</span>
            <p className="text-5xl font-bold text-foreground">{monthlyTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Sync Status */}
        {mounted && (syncError || lastSyncTime) && (
          <div className="flex items-center justify-end gap-1 pt-3 border-t border-border">
            {syncError ? (
              <p className="text-xs text-red-500">Sync failed</p>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">Synced</span>
                <p className="text-xs text-muted-foreground font-medium">{lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
