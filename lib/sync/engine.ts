import { createClient } from "@/utils/supabase/client"
import { getDB } from "@/lib/db/client"
import type { LocalExpense } from "./types"

const SYNC_KEY = "expense_tracker_last_sync"

export const SyncEngine = {
  async getLastSyncTime(): Promise<string | null> {
    if (typeof window === "undefined") return null
    return localStorage.getItem(SYNC_KEY)
  },

  async setLastSyncTime(isoString: string) {
    if (typeof window === "undefined") return
    localStorage.setItem(SYNC_KEY, isoString)
  },

  async bootstrap() {
    console.log("Starting bootstrap...")
    const db = await getDB()
    const supabase = createClient()

    // Check if we already have data
    const catCount = await db.count("categories")
    if (catCount > 0) {
      console.log("Bootstrap skipped: Data exists.")
      return
    }

    // 1. Fetch Categories
    const { data: categories, error: catError } = await supabase.from("categories").select("*")
    if (catError) throw catError
    if (categories) {
      const tx = db.transaction("categories", "readwrite")
      await Promise.all(categories.map(c => tx.store.put(c)))
      await tx.done
    }

    // 2. Fetch SubCategories
    const { data: subCategories, error: subError } = await supabase.from("sub_categories").select("*")
    if (subError) throw subError
    if (subCategories) {
      const tx = db.transaction("subcategories", "readwrite")
      await Promise.all(subCategories.map(s => tx.store.put(s)))
      await tx.done
    }

    // 3. Fetch All Expenses (One-time download)
    const { data: expenses, error: expError } = await supabase.from("expenses").select("*")
    if (expError) throw expError

    if (expenses) {
      const tx = db.transaction("expenses", "readwrite")
      for (const exp of expenses) {
        const localExp: LocalExpense = {
          ...exp,
          // id is present (server ID)
          // local_id will be auto-generated
          synced: 1 // 1 = true (from server)
        }
        await tx.store.put(localExp)
      }
      await tx.done
    }

    await this.setLastSyncTime(new Date().toISOString())
    console.log("Bootstrap completed.")
  },

  async pushChanges() {
    console.log("[SyncEngine] Pushing changes...")
    const db = await getDB()
    const supabase = createClient()

    // 1. Get unsynced items
    const allExpenses = await db.getAll("expenses")
    const pending = allExpenses.filter(e => e.synced === false)

    console.log(`[SyncEngine] Found ${pending.length} unsynced items.`)

    if (pending.length === 0) return

    console.log(`[SyncEngine] Pushing ${pending.length} new expenses...`)

    for (const item of pending) {

      const { local_id, synced, id, ...payload } = item

      if (id) {
        // UPDATE
        const { error } = await supabase
          .from('expenses')
          .update(payload)
          .eq('id', id)

        if (!error) {
          // Mark synced
          const updated = { ...item, synced: true }
          await db.put("expenses", updated)
        } else {
          console.error("Failed to update", item, error)
        }
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('expenses')
          .insert(payload)
          .select('id')
          .single()

        if (!error && data) {
          // Update local with server ID and synced=true
          const updated = { ...item, id: data.id, synced: true }
          await db.put("expenses", updated)
        } else {
          console.error("Failed to insert", item, error)
        }
      }
    }
  }
}
