"use client"

import { useState } from "react"
import { SyncEngine } from "@/lib/sync/engine"
import { RefreshCw } from "lucide-react"

export default function SyncPageComponent() {
  const [isSyncingCategories, setIsSyncingCategories] = useState(false)
  const [isSyncingSubcategories, setIsSyncingSubcategories] = useState(false)
  const [categoriesStatus, setCategoriesStatus] = useState<string | null>(null)
  const [subcategoriesStatus, setSubcategoriesStatus] = useState<string | null>(null)

  async function handleSyncCategories() {
    try {
      setCategoriesStatus(null)
      setIsSyncingCategories(true)
      await SyncEngine.syncCategories()
      setCategoriesStatus("Synced")
    } catch (err) {
      console.error(err)
      setCategoriesStatus("Failed")
    } finally {
      setIsSyncingCategories(false)
    }
  }

  async function handleSyncSubcategories() {
    try {
      setSubcategoriesStatus(null)
      setIsSyncingSubcategories(true)
      await SyncEngine.syncSubcategories()
      setSubcategoriesStatus("Synced")
    } catch (err) {
      console.error(err)
      setSubcategoriesStatus("Failed")
    } finally {
      setIsSyncingSubcategories(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sync / Import from Supabase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-border rounded-md bg-card">
          <h2 className="font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground mb-3">Download categories from Supabase into IndexedDB.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncCategories}
              disabled={isSyncingCategories}
              className="px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncingCategories ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
              <span>Sync Categories</span>
            </button>

            <div className="text-sm text-muted-foreground">{categoriesStatus ?? '—'}</div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-md bg-card">
          <h2 className="font-semibold">Subcategories</h2>
          <p className="text-sm text-muted-foreground mb-3">Download subcategories from Supabase into IndexedDB.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncSubcategories}
              disabled={isSyncingSubcategories}
              className="px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncingSubcategories ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
              <span>Sync Subcategories</span>
            </button>

            <div className="text-sm text-muted-foreground">{subcategoriesStatus ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
