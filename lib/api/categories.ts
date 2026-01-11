/**
 * Categories API
 * 
 * Functions for fetching category data from Supabase.
 */

import { createClient } from "@/utils/supabase/server"
import type { Category } from "@/lib/types/database.types"

/**
 * Fetch all active categories ordered by sort_order
 * @returns Array of active categories
*/
export async function fetchCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("description", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchCategories:", error)
    throw error
  }
}
