"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucidePieChart, BarChart, TrendingDown } from "lucide-react"
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { getCategoryHexColor } from "@/lib/constants/category-colors"

export function AnalyticsPage() {
  const [dateFilter, setDateFilter] = useState<"month" | "last-month" | "six-months">("month")

  const categoryBreakdown = [
    { category: "Food", amount: 3200, percentage: 28, fill: getCategoryHexColor("Food") },
    { category: "Transport", amount: 2100, percentage: 18, fill: getCategoryHexColor("Transport") },
    { category: "Entertainment", amount: 2400, percentage: 21, fill: getCategoryHexColor("Entertainment") },
    { category: "Shopping", amount: 2000, percentage: 17, fill: getCategoryHexColor("Shopping") },
    { category: "Bills", amount: 1100, percentage: 10, fill: getCategoryHexColor("Bills") },
    { category: "Health", amount: 800, percentage: 6, fill: getCategoryHexColor("Health") },
  ]

  const weeklyData = [
    { week: "Week 1", amount: 185 },
    { week: "Week 2", amount: 245 },
    { week: "Week 3", amount: 198 },
    { week: "Week 4", amount: 190 },
  ]

  const totalSpent = categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0)
  const avgPerDay = (totalSpent / 28).toFixed(2)
  const largestCategory = categoryBreakdown[0]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm font-bold text-primary">₹{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-balance">Analytics</h1>
        <p className="text-muted-foreground mt-1">Understand your spending patterns</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: "month", label: "This Month" },
          { id: "last-month", label: "Last Month" },
          { id: "six-months", label: "Last 6 Months" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setDateFilter(filter.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateFilter === filter.id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-sm mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-2">Total Spent</p>
          <p className="text-4xl font-bold text-primary">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Average ₹{avgPerDay}/day</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LucidePieChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart data={categoryBreakdown}>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      style={{ outline: "none" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 space-y-3">
            {categoryBreakdown.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-sm font-semibold text-primary">₹{item.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground w-8">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg/Day</span>
            </div>
            <p className="text-2xl font-bold">₹{avgPerDay}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Spending */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Weekly Spending</CardTitle>
          <CardDescription className="text-xs">This month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((week) => {
              const maxAmount = Math.max(...weeklyData.map((w) => w.amount))
              const percentage = (week.amount / maxAmount) * 100

              return (
                <div key={week.week}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{week.week}</span>
                    <span className="text-sm font-semibold">₹{week.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary/60 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-0 shadow-sm mt-6 bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">💡 Insights</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Your biggest expense category is <strong>{largestCategory.category}</strong> at{" "}
                {largestCategory.percentage}%
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>You're spending an average of ₹{avgPerDay} per day</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Week 2 was your highest spending week this month</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
