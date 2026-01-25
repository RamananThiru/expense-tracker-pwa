import { useState, useEffect } from "react"
import { getDB } from "@/lib/db/client"
import type { LocalExpense } from "@/lib/sync/types"
import type { ExpenseInsert } from "@/lib/types/database.types"

const DB_CHANGE_EVENT = 'expense-tracker-db-change'

export function useExpenses() {
  const [expenses, setExpenses] = useState<LocalExpense[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const db = await getDB()
      if (!db) return

      // 1. Get last 10 expenses ordered by expense_date (newest first)
      const all = await db.expenses.orderBy('expense_date').reverse().limit(10).toArray()
      setExpenses(all)

      // 2. Calculate current month total
      const now = new Date()
      // YYYY-MM-DD format
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0]

      const monthExpenses = await db.expenses
        .where('expense_date')
        .between(startOfMonth, startOfNextMonth, true, false)
        .toArray()

      const total = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      setMonthlyTotal(total)

    } catch (err) {
      console.error("Failed to fetch expenses:", err)
      // TODO: Show error to user
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    window.addEventListener(DB_CHANGE_EVENT, fetchExpenses)
    return () => window.removeEventListener(DB_CHANGE_EVENT, fetchExpenses)
  }, [])

  const addExpense = async (data: ExpenseInsert) => {
    const db = await getDB()
    if (!db) throw new Error("Database not ready")

    const newExpense: LocalExpense = {
      ...data,
      synced: false,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    await db.expenses.add(newExpense)
    window.dispatchEvent(new Event(DB_CHANGE_EVENT))
  }

  // Optional: Local only delete (if mistake)
  const deleteExpense = async (localId: number | undefined) => {
    // V1: just local delete
    if (!localId) return
    const db = await getDB()
    if (!db) return
    await db.expenses.delete(localId)
    window.dispatchEvent(new Event(DB_CHANGE_EVENT))
  }

  return {
    expenses,
    monthlyTotal,
    isLoading,
    addExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses
  }
}
