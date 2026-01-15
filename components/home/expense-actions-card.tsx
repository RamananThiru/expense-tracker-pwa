import { RefreshCw, Cloud, Upload } from "lucide-react"
import Link from "next/link"

interface ExpenseActionsCardProps {
  onSync: () => void
  isSyncing: boolean
}

export function ExpenseActionsCard({ onSync, isSyncing }: ExpenseActionsCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
      <div className="p-2">
        <div className="flex items-center justify-center gap-8">
          {/* Export Action */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex flex-col items-center gap-0.5 px-3 py-2"
            aria-label="Export to Supabase"
          >
            <Upload
              size={24}
              className={`text-purple-600 ${isSyncing ? "animate-bounce" : ""}`}
            />
            <span className="text-xs font-medium text-foreground">Export</span>
          </button>

          {/* Import Action */}
          <Link href="/sync" className="flex flex-col items-center gap-0.5 px-3 py-2">
            <Cloud size={24} className="text-green-600" />
            <span className="text-xs font-medium text-foreground">Import</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
