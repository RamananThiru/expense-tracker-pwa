"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { ExpenseListItem } from "@/components/expense-list-item"
import { getCategoryColor } from "@/lib/constants/category-colors"
import { useExpenses } from "@/hooks/use-expenses"
import { useReferenceData } from "@/hooks/use-reference-data"
import { useSync } from "@/hooks/use-sync"
import SyncLinkCard from "@/components/sync-link-card"

export default function HomePage() {
  const router = useRouter()
  
  // Hooks
  const { expenses, isLoading: loadingExpenses, refreshExpenses } = useExpenses()
  const { categories, isLoading: loadingCategories } = useReferenceData()
  const { sync, isSyncing, lastSyncTime, error: syncError } = useSync()

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
          {/* Header Section */}
          <div className="sticky top-0 bg-background z-10 border-b border-border">
            <div className="px-6 py-4 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
                <p className="text-lg font-semibold text-muted-foreground mt-2">
                  ₹{monthlyTotal.toLocaleString()} spent this month
                </p>
              </div>
              
              {/* Sync Button */}
              <button 
                onClick={sync} 
                disabled={isSyncing}
                className="p-2 rounded-full hover:bg-secondary transition-colors relative"
                aria-label="Sync now"
              >
                <RefreshCw className={`h-5 w-5 ${isSyncing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
                {syncError && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <SyncLinkCard />
            </div>
            {/* Minimal Sync Status */}
            {(syncError || lastSyncTime) && (
              <div className="px-6 pb-2 text-xs text-muted-foreground flex items-center justify-end gap-1">
                 {syncError ? (
                   <span className="text-red-500">Sync failed</span>
                 ) : (
                   <span>Synced {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                 )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="px-4 pt-4">

            <SyncLinkCard />

            {/* Recent Expenses Section */}
            <div className="mb-8">
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
              ) : (
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
              )}
            </div>
          </div>
      </div>
    </AppLayout>
  )
}
