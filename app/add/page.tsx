"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExpensePriority, PRIORITY_LABELS, ALL_PRIORITIES } from "@/lib/constants/expense-priority"
import { PaymentType, PAYMENT_TYPE_LABELS, ALL_PAYMENT_TYPES } from "@/lib/constants/payment-type"
import { useReferenceData, useSubCategories } from "@/hooks/use-reference-data"
import { useExpenses } from "@/hooks/use-expenses"
import type { Category, SubCategory, ExpenseInsert } from "@/lib/types/database.types"

const PLACEHOLDER_MAP: Record<string, Record<string, string>> = {
  Food: {
    Groceries: "Items purchased (e.g., milk, vegetables, rice)",
    "Dining Out": "Restaurant name, dishes ordered",
    Coffee: "Cafe name, drink type",
    "Online Order": "Merchant name, dishes/items ordered",
  },
  Shopping: {
    Clothes: "Brand, type of clothing, size",
    Electronics: "Device name, brand, specifications",
    Home: "Item name, room, purpose",
  },
  Travel: {
    Transport: "Route, vehicle type, distance",
    Fuel: "Fuel type, quantity, liters",
    Accommodation: "Hotel/place name, location, nights",
  },
  Entertainment: {
    Movies: "Movie name, theater, number of tickets",
    Games: "Game name, platform",
    Events: "Event name, venue, type",
  },
  Health: {
    Medicine: "Medicine names, dosage, quantity",
    Gym: "Gym name, membership type, duration",
    Checkup: "Doctor name, clinic, test type",
  },
  Utilities: {
    Electricity: "Bill period, units consumed",
    Water: "Bill period, units consumed",
    Internet: "Provider name, plan type, speed",
  },
  Other: {
    Misc: "Details about the expense",
  },
}

export default function AddExpensePage() {
  const router = useRouter()
  const amountInputRef = useRef<HTMLInputElement>(null)
  
  // Hooks
  const { categories, isLoading: isLoadingCategories, refreshReferenceData } = useReferenceData()
  const { addExpense } = useExpenses()
  
  // Form state
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>(PaymentType.UPI)
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [priority, setPriority] = useState<ExpensePriority>(ExpensePriority.NEED)
  const [isVacation, setIsVacation] = useState(false)
  const [isEMI, setIsEMI] = useState(false)

  // Derived state from hooks
  const { subCategories, isLoading: isLoadingSubCategories } = useSubCategories(selectedCategory?.id || null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Focus input on mount
  useEffect(() => {
    amountInputRef.current?.focus()
  }, [])
  
  // Auto-select first category if available and none selected
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])
  
  // Auto-select first subcategory
  useEffect(() => {
    if (subCategories.length > 0) {
       setSelectedSubCategory(subCategories[0])
    } else {
       setSelectedSubCategory(null)
    }
  }, [subCategories])

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === Number(categoryId))
    if (category) {
      setSelectedCategory(category)
      // Reset subcategory will be handled by auto-select effect or manually here?
      // Better to clear it immediately to avoid mismatched state
      setSelectedSubCategory(null)
    }
  }

  const handleSubCategoryChange = (subCategoryId: string) => {
    const subCategory = subCategories.find(sc => sc.id === Number(subCategoryId))
    if (subCategory) {
      setSelectedSubCategory(subCategory)
    }
  }

  const getDescriptionPlaceholder = (): string => {
    if (!selectedCategory || !selectedSubCategory) {
      return "Add notes about this expense..."
    }
    
    const categoryCode = selectedCategory.code
    const subCategoryCode = selectedSubCategory.code
    
    return PLACEHOLDER_MAP[categoryCode]?.[subCategoryCode] || "Add notes about this expense..."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCategory || !selectedSubCategory) {
      setSubmitError("Please select a category and subcategory")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const expenseData: ExpenseInsert = {
        amount: parseFloat(amount),
        expense_date: date,
        category_id: selectedCategory.id,
        sub_category_id: selectedSubCategory.id,
        description: description.trim() || null,
        item_name: null,
        notes: null,
        priority: priority,
        payment_type: paymentMethod,
        is_emi: isEMI,
        is_vacation: isVacation,
      }

      await addExpense(expenseData)
      
      // Navigate back to home after successful save (local save is instant)
      router.push("/")
    } catch (error) {
      console.error("Error saving expense:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to save expense. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Cancel button */}
      <div className="bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">Add Expense</h1>
          <p className="text-sm text-muted-foreground mt-1">Quick and easy expense tracking</p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Cancel"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form - Scrollable main content */}
      <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
        {/* Error Messages */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        {/* Categories Refresh Hint (Optional) */}
        {categories.length === 0 && !isLoadingCategories && (
             <div className="text-xs text-center text-muted-foreground p-2">
                 No categories found. Sync the app to download them.
             </div>
        )}

        {/* Row 1: Category and Sub-category on one line */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-card-foreground block mb-1">Category</label>
            <Select 
              value={selectedCategory?.id.toString()} 
              onValueChange={handleCategoryChange}
              disabled={isLoadingCategories}
            >
              <SelectTrigger className="w-full h-10 px-2.5 bg-secondary text-card-foreground border-border text-sm">
                {isLoadingCategories ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <SelectValue placeholder="Select category" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto" sideOffset={0}>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-category */}
          <div>
            <label className="text-xs font-semibold text-card-foreground block mb-1">Sub-category</label>
            <Select 
              value={selectedSubCategory?.id.toString()} 
              onValueChange={handleSubCategoryChange}
              disabled={isLoadingSubCategories || !selectedCategory}
            >
              <SelectTrigger className="w-full h-10 px-2.5 bg-secondary text-card-foreground border-border text-sm">
                {isLoadingSubCategories ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <SelectValue placeholder="Select sub-category" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto" sideOffset={0}>
                {subCategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id.toString()}>
                    {sub.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Amount (40%) and Description (60%) on same line */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* Amount - 40% (2 of 5 cols) */}
          <div className="col-span-2">
            <label className="text-xs font-semibold text-card-foreground block mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                ₹
              </span>
              <input
                ref={amountInputRef}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-2 py-2.5 sm:py-2 bg-secondary text-card-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold min-h-10"
                inputMode="decimal"
                required
              />
            </div>
          </div>

          {/* Description - 60% (3 of 5 cols) */}
          <div className="col-span-3">
            <label className="text-xs font-semibold text-card-foreground block mb-1">Description / Merchant</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={getDescriptionPlaceholder()}
              className="w-full px-3 py-2.5 sm:py-2 bg-secondary text-card-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-h-10"
            />
          </div>
        </div>

        {/* Row 3: Priority */}
        <div>
          <label className="text-xs font-semibold text-card-foreground block mb-2">Priority</label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {ALL_PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-2.5 sm:py-2 px-1 rounded-lg text-xs font-medium transition-all min-h-10 flex items-center justify-center ${
                  priority === p
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-card-foreground border border-border hover:border-primary"
                }`}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Payment Methods */}
        <div>
          <label className="text-xs font-semibold text-card-foreground block mb-1">Payment Method</label>
          <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentType)}>
            <SelectTrigger className="w-full h-10 px-2.5 bg-secondary text-card-foreground border-border text-sm">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto" sideOffset={0}>
              {ALL_PAYMENT_TYPES.map((method) => (
                <SelectItem key={method} value={method}>
                  {PAYMENT_TYPE_LABELS[method]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 5: Date */}
        <div>
          <label className="text-xs font-semibold text-card-foreground block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2.5 py-2.5 bg-secondary text-card-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs min-h-10"
          />
        </div>

        {/* Row 6: Checkboxes - EMI and Vacation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isVacation}
              onChange={(e) => setIsVacation(e.target.checked)}
              className="w-5 h-5 rounded bg-secondary border border-border accent-primary cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-card-foreground">Vacation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isEMI}
              onChange={(e) => setIsEMI(e.target.checked)}
              className="w-5 h-5 rounded bg-secondary border border-border accent-primary cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-card-foreground">EMI</span>
          </label>
        </div>
      </form>

      {/* Action Buttons - Fixed at bottom */}
      <div className="bg-card border-t border-border p-4 sm:p-6">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 sm:py-2.5 px-4 bg-secondary text-card-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors text-sm min-h-12 border border-border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              const form = document.querySelector("form") as HTMLFormElement
              form?.requestSubmit()
            }}
            disabled={!amount || isSubmitting || isLoadingCategories || !selectedCategory || !selectedSubCategory}
            className="flex-1 py-3 sm:py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm min-h-12 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Expense"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
