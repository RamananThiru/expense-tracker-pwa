"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { SyncEngine } from "@/lib/sync/engine"

export default function SyncReferenceCard() {
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
    <div id="sync-reference-card" className="mb-6 p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-semibold text-foreground">Sync Reference Data</h3>
          <p className="text-sm text-muted-foreground mt-1">Sync categories and subcategories from Supabase to IndexedDB.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncCategories}
            disabled={isSyncingCategories}
            className="px-3 py-1 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncingCategories ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm">Categories</span>
          </button>

          <button
            onClick={handleSyncSubcategories}
            disabled={isSyncingSubcategories}
            className="px-3 py-1 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncingSubcategories ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm">Subcategories</span>
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground flex gap-4">
        <div>Categories: {categoriesStatus ?? "—"}</div>
        <div>Subcategories: {subcategoriesStatus ?? "—"}</div>
      </div>
    </div>
  )
}
