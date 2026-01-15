"use client"

interface ExpenseListItemProps {
  category: string
  subcategory: string
  date: string
  amount: number
  categoryColor: {
    bg: string
    text: string
  }
}

export function ExpenseListItem({ category, subcategory, date, amount, categoryColor }: ExpenseListItemProps) {
  // Get first letter of category in uppercase
  const categoryLetter = category.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3 p-3 bg-transparent border-b border-border/50 hover:bg-accent/5 transition-colors duration-150 cursor-pointer">
      {/* Left: Circular Category Indicator */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${categoryColor.bg} ${categoryColor.text}`}
      >
        {categoryLetter}
      </div>

      {/* Middle: Category Details */}
      <div className="flex-1 min-w-0">
        {/* Category Name */}
        <p className="font-semibold text-sm text-foreground truncate">{category}</p>
        {/* Subcategory and Date */}
        <p className="text-xs text-muted-foreground opacity-70 mt-0.5">
          {subcategory} • {date}
        </p>
      </div>

      {/* Right: Amount */}
      <div className="shrink-0">
        <p className="text-base font-semibold text-foreground text-right">₹{amount.toLocaleString()}</p>
      </div>
    </div>
  )
}
