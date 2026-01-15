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
          <button
            onClick={sync}
            disabled={isSyncing}
            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
            aria-label="Refresh"
          >
            <RefreshCw
              size={20}
              className={`text-primary transition-colors duration-200 ${
                isSyncing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Amount Section */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Spent this month</p>
          <p className="text-4xl font-bold text-foreground">₹{monthlyTotal.toLocaleString()}</p>
        </div>

        {/* Sync Status */}
        {mounted && (syncError || lastSyncTime) && (
          <div className="flex justify-end pt-2 border-t border-border">
            {syncError ? (
              <p className="text-xs text-red-500">Sync failed</p>
            ) : (
              <p className="text-xs text-muted-foreground">Synced {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
