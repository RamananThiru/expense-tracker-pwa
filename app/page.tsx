"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ExpenseListItem } from "@/components/expense-list-item"
import { getCategoryColor } from "@/lib/constants/category-colors"
import { getRecentExpenses, type ExpenseWithCategory } from "@/lib/api/expenses"

export default function HomePage() {
  const router = useRouter()

  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await getRecentExpenses()
        setExpenses(data)
      } catch (error) {
        console.error("Failed to load expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [])

  const monthlyTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <AppLayout>
      <div className="w-full h-full bg-background pb-24">
          {/* Header Section */}
          <div className="sticky top-0 bg-background z-10 border-b border-border">
            <div className="px-6 py-4">
              <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
              <p className="text-lg font-semibold text-muted-foreground mt-2">
                ₹{monthlyTotal.toLocaleString()} spent this month
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 pt-4">

            {/* Recent Expenses Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h2>

              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No recent expenses found.
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense) => {
                    const categoryName = expense.categories?.code || expense.categories?.description || "Other"
                    const colors = getCategoryColor(categoryName)
                    
                    return (
                      <ExpenseListItem
                        key={expense.id}
                        category={categoryName}
                        subcategory={expense.sub_categories?.description || ""}
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
              )}
            </div>
          </div>
      </div>
    </AppLayout>
  )
}
