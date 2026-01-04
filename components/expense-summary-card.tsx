"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PieChart, ChevronRight } from "lucide-react"

interface ExpenseSummaryCardProps {
  totalAmount: number
  onClick: () => void
}

export function ExpenseSummaryCard({ totalAmount, onClick }: ExpenseSummaryCardProps) {
  return (
    <Card
      onClick={onClick}
      className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 active:scale-95"
    >
      <CardContent className="p-4 flex items-center justify-between">
        {/* Left: View Analytics Text */}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">View Analytics</p>
          <p className="text-xs text-muted-foreground mt-1">See spending breakdown</p>
        </div>

        {/* Center: Donut Chart Icon */}
        <div className="flex-shrink-0 mx-3">
          <PieChart className="w-5 h-5 text-primary" />
        </div>

        {/* Right: Chevron Right Icon */}
        <div className="flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
