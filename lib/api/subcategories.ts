/**
 * SubCategories API
 * 
 * Functions for fetching subcategory data from Supabase.
 */

import { createClient } from "@/utils/supabase/server"
import type { SubCategory } from "@/lib/types/database.types"

/**
 * Fetch all active subcategories for a specific category
 * @param categoryId - The category ID to filter by
 * @returns Array of active subcategories for the given category
 */
export async function fetchSubcategoriesByCategoryId(categoryId: number): Promise<SubCategory[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("sub_categories")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("description", { ascending: true })

    if (error) {
      console.error("Error fetching subcategories:", error)
      throw new Error(`Failed to fetch subcategories: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchSubcategoriesByCategoryId:", error)
    throw error
  }
}
