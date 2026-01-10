"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExpensePriority, PRIORITY_LABELS, ALL_PRIORITIES } from "@/lib/constants/expense-priority"
import { PaymentType, PAYMENT_TYPE_LABELS, ALL_PAYMENT_TYPES } from "@/lib/constants/payment-type"

const CATEGORIES = ["Food", "Shopping", "Travel", "Entertainment", "Health", "Utilities", "Other"]

const SUB_CATEGORIES = {
  Food: ["Groceries", "Dining Out", "Coffee", "Online Order"],
  Shopping: ["Clothes", "Electronics", "Home"],
  Travel: ["Transport", "Fuel", "Accommodation"],
  Entertainment: ["Movies", "Games", "Events"],
  Health: ["Medicine", "Gym", "Checkup"],
  Utilities: ["Electricity", "Water", "Internet"],
  Other: ["Misc"],
}

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
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>(PaymentType.UPI)
  const [subCategory, setSubCategory] = useState(SUB_CATEGORIES["Food"][0])
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [priority, setPriority] = useState<ExpensePriority>(ExpensePriority.NEED)
  const [isVacation, setIsVacation] = useState(false)
  const [isEMI, setIsEMI] = useState(false)

  useEffect(() => {
    amountInputRef.current?.focus()
  }, [])

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    setSubCategory(SUB_CATEGORIES[newCategory as keyof typeof SUB_CATEGORIES][0])
  }

  const getDescriptionPlaceholder = (): string => {
    return PLACEHOLDER_MAP[category]?.[subCategory] || "Add notes about this expense..."
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Add Supabase POST call here to save the expense
    console.log("Expense to be saved:", {
      amount,
      category,
      subCategory,
      priority,
      paymentMethod,
      description,
      date,
      isVacation,
      isEMI,
    })
    
    // Navigate back to home after saving
    router.push("/")
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
        {/* Row 1: Category and Sub-category on one line */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-card-foreground block mb-1">Category</label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full h-10 px-2.5 bg-secondary text-card-foreground border-border text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto" sideOffset={0}>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-category */}
          <div>
            <label className="text-xs font-semibold text-card-foreground block mb-1">Sub-category</label>
            <Select value={subCategory} onValueChange={setSubCategory}>
              <SelectTrigger className="w-full h-10 px-2.5 bg-secondary text-card-foreground border-border text-sm">
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto" sideOffset={0}>
                {SUB_CATEGORIES[category as keyof typeof SUB_CATEGORIES].map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
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
            className="flex-1 py-3 sm:py-2.5 px-4 bg-secondary text-card-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors text-sm min-h-12 border border-border"
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
            disabled={!amount}
            className="flex-1 py-3 sm:py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm min-h-12"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  )
}
