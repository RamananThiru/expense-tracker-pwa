"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES_DATA: Record<string, { label: string; subcategories: string[] }> = {
  Food: {
    label: "Food",
    subcategories: ["Groceries", "Dining Out", "Coffee"],
  },
  Transport: {
    label: "Transport",
    subcategories: ["Fuel", "Public Transit", "Taxi"],
  },
  Housing: {
    label: "Housing",
    subcategories: ["Rent", "Utilities", "Maintenance"],
  },
  Entertainment: {
    label: "Entertainment",
    subcategories: ["Movies", "Games", "Events"],
  },
  Health: {
    label: "Health",
    subcategories: ["Medicine", "Doctor", "Fitness"],
  },
  Shopping: {
    label: "Shopping",
    subcategories: ["Clothing", "Electronics", "Home"],
  },
  Bills: {
    label: "Bills",
    subcategories: ["Internet", "Phone", "Insurance"],
  },
  Other: {
    label: "Other",
    subcategories: ["Miscellaneous"],
  },
}

interface FormErrors {
  amount?: string
  category?: string
  subcategory?: string
  date?: string
}

export default function AddExpensePage() {
  const router = useRouter()
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    subcategory: "Groceries",
    description: "",
  })

  const subcategories = CATEGORIES_DATA[formData.category]?.subcategories || []

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    if (!formData.subcategory) {
      newErrors.subcategory = "Please select a subcategory"
    }
    if (!formData.date) {
      newErrors.date = "Please select a date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value
    const firstSubcategory = CATEGORIES_DATA[newCategory]?.subcategories[0] || ""
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      subcategory: firstSubcategory,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("Expense added:", formData)
    // Reset form
    setFormData({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "Food",
      subcategory: "Groceries",
      description: "",
    })
    setErrors({})
    // Navigate back to home
    router.push("/")
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background overflow-auto pb-20">
        <div className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-end">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form container */}
        <div className="flex-1 w-full max-w-lg mx-auto px-4 py-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Expense</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your spending</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount - Large & Prominent */}
            <div className="space-y-3">
              <label htmlFor="amount" className="text-sm font-semibold text-foreground">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-foreground">₹</span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-4 text-3xl font-bold border-2 rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.amount ? "border-red-500 bg-red-50/30" : "border-border"
                  }`}
                />
              </div>
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>

            {/* Date Picker */}
            <div className="space-y-3">
              <label htmlFor="date" className="text-sm font-semibold text-foreground">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer ${
                  errors.date ? "border-red-500 bg-red-50/30" : "border-border"
                }`}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Category Select */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  const firstSubcategory = CATEGORIES_DATA[value]?.subcategories[0] || ""
                  setFormData(prev => ({
                    ...prev,
                    category: value,
                    subcategory: firstSubcategory
                  }))
                }}
              >
                <SelectTrigger className={`w-full h-12 px-4 text-base bg-muted/50 border-2 ${errors.category ? "border-red-500" : "border-border"}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES_DATA).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>

            {/* Subcategory Select */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Subcategory
              </label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    subcategory: value
                  }))
                }}
              >
                <SelectTrigger className={`w-full h-12 px-4 text-base bg-muted/50 border-2 ${errors.subcategory ? "border-red-500" : "border-border"}`}>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory}</p>}
            </div>

            {/* Description Textarea - Optional */}
            <div className="space-y-3">
              <label htmlFor="description" className="text-sm font-semibold text-foreground">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Add note..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            {/* Submit Button - Full Width at Bottom */}
            <button
              type="submit"
              className="w-full py-4 mt-8 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 active:scale-95 transition-all touch-target"
            >
              Save Expense
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
