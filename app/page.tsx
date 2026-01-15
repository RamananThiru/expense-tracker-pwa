"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ExpenseListItem } from "@/components/home/expense-list-item"
import { ExpenseTrackerHeader } from "@/components/home/expense-tracker-header"
import { ExpenseActionsCard } from "@/components/home/expense-actions-card"
import { getCategoryColor } from "@/lib/constants/category-colors"
import { useExpenses } from "@/hooks/use-expenses"
import { useReferenceData } from "@/hooks/use-reference-data"
import { useSync } from "@/hooks/use-sync"

export default function HomePage() {
  const router = useRouter()
  
  // Hooks
  const { expenses, isLoading: loadingExpenses, refreshExpenses } = useExpenses()
  const { categories, isLoading: loadingCategories } = useReferenceData()
  const { sync, isSyncing, lastSyncTime, error: syncError } = useSync()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-sync only once on mount
  // TEMPORARILY DISABLED: To stop loop/crash. Manual sync only.
  /*
  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const hasSynced = localStorage.getItem("expense_tracker_last_sync")
    if (hasSynced) {
        sync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  */

  // Derived state to map category names
  const expensesWithDetails = useMemo(() => {
    return expenses.map(e => {
       const cat = categories.find(c => c.id === e.category_id)
       return {
         ...e,
         categoryName: cat?.code || "Other",
       }
    })
  }, [expenses, categories])

  const monthlyTotal = expensesWithDetails.reduce((sum, exp) => sum + exp.amount, 0)

 

  return (
    <AppLayout>
      <div className="w-full h-full bg-background pb-24">
        <div className="px-4 pt-4 space-y-3">
          {/* Card 1: Expense Tracker Info & Sync */}
          <ExpenseTrackerHeader 
            monthlyTotal={monthlyTotal}
            sync={sync}
            isSyncing={isSyncing}
            syncError={syncError}
            lastSyncTime={lastSyncTime}
            mounted={mounted}
          />

          {/* Actions Card */}
          <ExpenseActionsCard onSync={sync} isSyncing={isSyncing} />

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h2>

            {loadingExpenses ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                <p>No expenses yet.</p>
                <p className="text-xs mt-1">Add one to get started.</p>
              </div>
            ) : mounted ? (
              <div className="space-y-3">
                <div className="max-h-80 overflow-y-auto p-2 border border-border rounded-md">
                  <div className="space-y-3">
                    {expensesWithDetails.slice(0, 10).map((expense) => {
                      const colors = getCategoryColor(expense.categoryName)

                      return (
                        <ExpenseListItem
                          key={expense.local_id}
                          category={expense.categoryName}
                          subcategory={expense.description || ""}
                          date={new Date(expense.expense_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          amount={expense.amount}
                          categoryColor={colors}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
