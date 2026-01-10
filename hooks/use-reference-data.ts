import { useState, useEffect } from "react"
import { getDB } from "@/lib/db/client"
import type { Category, SubCategory } from "@/lib/types/database.types"

// Event to listen for
const DB_CHANGE_EVENT = 'expense-tracker-db-change'

export function useReferenceData() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const db = await getDB()
      if (!db) return

      const all = await db.getAll("categories")
      // Sort by sort_order
      all.sort((a: Category, b: Category) => (a.sort_order || 0) - (b.sort_order || 0))

      setCategories(all)
    } catch (error) {
      console.error("Failed to load categories from IDB:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()

    // Listen for global DB changes (e.g. after sync/bootstrap)
    window.addEventListener(DB_CHANGE_EVENT, fetchCategories)
    return () => window.removeEventListener(DB_CHANGE_EVENT, fetchCategories)
  }, [])

  return {
    categories,
    isLoading,
    refreshReferenceData: fetchCategories
  }
}

export function useSubCategories(categoryId: number | null) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [isLoading, setIsLoading] = useState(false) // Not loading initially if no cat selected

  useEffect(() => {
    if (!categoryId) {
      setSubCategories([])
      return
    }

    const fetchSub = async () => {
      setIsLoading(true)
      try {
        const db = await getDB()
        if (!db) return

        const all = await db.getAllFromIndex("subcategories", "by-category", categoryId)
        // Sort by sort_order
        all.sort((a: SubCategory, b: SubCategory) => (a.sort_order || 0) - (b.sort_order || 0))

        setSubCategories(all)
      } catch (err) {
        console.error("Failed to fetch subcategories:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSub()

    // Only re-fetch if DB changed globally and we have a category selected
    const handler = () => { if (categoryId) fetchSub() }
    window.addEventListener(DB_CHANGE_EVENT, handler)
    return () => window.removeEventListener(DB_CHANGE_EVENT, handler)

  }, [categoryId])

  return {
    subCategories,
    isLoading
  }
}
