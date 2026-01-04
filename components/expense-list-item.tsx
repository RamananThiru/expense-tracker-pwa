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
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md active:scale-98 transition-all duration-150 ease-out cursor-pointer">
      {/* Left: Circular Category Indicator */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${categoryColor.bg} ${categoryColor.text}`}
      >
        {categoryLetter}
      </div>

      {/* Middle: Category Details */}
      <div className="flex-1 min-w-0">
        {/* Category Name */}
        <p className="font-semibold text-base text-foreground truncate">{category}</p>
        {/* Subcategory and Date */}
        <p className="text-sm text-muted-foreground mt-1">
          {subcategory} • {date}
        </p>
      </div>

      {/* Right: Amount */}
      <div className="flex-shrink-0">
        <p className="text-lg font-bold text-foreground text-right">₹{amount.toLocaleString()}</p>
      </div>
    </div>
  )
}
