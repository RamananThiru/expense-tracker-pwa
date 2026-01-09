"use client"
import { useRouter } from "next/navigation"
import { ExpenseSummaryCard } from "@/components/expense-summary-card"
import { ExpenseListItem } from "@/components/expense-list-item"
import { getCategoryColor } from "@/lib/constants/category-colors"

export function HomePage() {
  const router = useRouter()

  // Mock expense data
  const recentExpenses = [
    {
      id: 1,
      category: "Food",
      subcategory: "Groceries",
      date: "Jan 15",
      amount: 450,
    },
    {
      id: 2,
      category: "Transport",
      subcategory: "Uber",
      date: "Jan 14",
      amount: 320,
    },
    {
      id: 3,
      category: "Entertainment",
      subcategory: "Movie Tickets",
      date: "Jan 13",
      amount: 800,
    },
    {
      id: 4,
      category: "Shopping",
      subcategory: "Clothes",
      date: "Jan 12",
      amount: 2150,
    },
    {
      id: 5,
      category: "Food",
      subcategory: "Restaurant",
      date: "Jan 11",
      amount: 1280,
    },
    {
      id: 6,
      category: "Bills",
      subcategory: "Electricity",
      date: "Jan 10",
      amount: 1500,
    },
    {
      id: 7,
      category: "Health",
      subcategory: "Pharmacy",
      date: "Jan 9",
      amount: 520,
    },
  ]

  const monthlyTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="w-full min-h-screen bg-background pb-24">
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
          {/* Analytics Preview Card */}
          <ExpenseSummaryCard totalAmount={monthlyTotal} onClick={() => router.push("/analytics")} />

          {/* Recent Expenses Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h2>

            <div className="space-y-3">
              {recentExpenses.map((expense) => {
                const colors = getCategoryColor(expense.category)
                return (
                  <ExpenseListItem
                    key={expense.id}
                    category={expense.category}
                    subcategory={expense.subcategory}
                    date={expense.date}
                    amount={expense.amount}
                    categoryColor={colors}
                  />
                )
              })}
            </div>
          </div>
        </div>
    </div>
  )
}
