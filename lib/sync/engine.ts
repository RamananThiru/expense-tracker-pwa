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

    if ((await db.categories.count()) > 0) {
      console.log("Bootstrap skipped: Data exists.")
      return
    }

    await fetchAndStore(supabase, db, "categories")
    await fetchAndStore(supabase, db, "sub_categories", "subcategories")
    await downloadInitialExpenses(supabase, db)

    await this.setLastSyncTime(new Date().toISOString())
    console.log("Bootstrap completed.")
  },

  async pushChanges() {
    console.log("[SyncEngine] Pushing changes...")
    const db = await getDB()
    const supabase = createClient()

    const allExpenses = await db.expenses.toArray()
    const pending = allExpenses.filter(e => e.synced === false)

    console.log(`[SyncEngine] Found ${pending.length} unsynced items.`)
    if (pending.length === 0) return

    console.log(`[SyncEngine] Pushing ${pending.length} expenses...`)
    for (const item of pending) {
      await syncSingleExpense(item, supabase, db)
    }
  },

  async syncCategories() {
    console.log("[SyncEngine] Syncing categories...")
    const db = await getDB()
    const supabase = createClient()
    await fetchAndStore(supabase, db, "categories")
    await this.setLastSyncTime(new Date().toISOString())
    console.log("[SyncEngine] Categories synced.")
  },

  async syncSubcategories() {
    console.log("[SyncEngine] Syncing subcategories...")
    const db = await getDB()
    const supabase = createClient()
    // table name in supabase is 'sub_categories', local store is 'subcategories'
    await fetchAndStore(supabase, db, "sub_categories", "subcategories")
    await this.setLastSyncTime(new Date().toISOString())
    console.log("[SyncEngine] Subcategories synced.")
  }
}

// --- Helpers ---

async function fetchAndStore(
  supabase: any,
  db: any,
  tableName: string,
  storeName: string = tableName
) {
  const { data, error } = await supabase.from(tableName).select("*")
  if (error) throw error
  if (data) {
    // Dexie bulkPut
    await db.table(storeName).bulkPut(data)
  }
}

async function downloadInitialExpenses(supabase: any, db: any) {
  const { data, error } = await supabase.from("expenses").select("*")
  if (error) throw error
  if (data) {
    const expenses = data.map((exp: any) => ({ ...exp, synced: true }))
    await db.expenses.bulkPut(expenses)
  }
}

async function syncSingleExpense(item: LocalExpense, supabase: any, db: any) {
  const { local_id, synced, id, ...payload } = item

  if (id) {
    // Update existing
    const { error } = await supabase
      .from('expenses')
      .update(payload)
      .eq('id', id)

    if (!error) {
      await db.expenses.put({ ...item, synced: true })
    } else {
      console.error("Failed to update", item, error)
    }
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('expenses')
      .insert(payload)
      .select('id')
      .single()

    if (!error && data) {
      await db.expenses.put({ ...item, id: data.id, synced: true })
    } else {
      console.error("Failed to insert", item, error)
    }
  }
}
