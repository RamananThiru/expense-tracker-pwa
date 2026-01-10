/**
 * Expenses API
 * 
 * Functions for creating and managing expense records in Supabase.
 */

import { createClient } from "@/utils/supabase/client"

import type { ExpenseInsert, Expense, Category, SubCategory } from "@/lib/types/database.types"

export interface ExpenseWithCategory extends Expense {
  categories: Category | null
  sub_categories: SubCategory | null
}

/**
 * Create a new expense record in the database
 * @param expense - The expense data to insert
 * @returns The created expense record with ID
 */
export async function createExpense(expense: ExpenseInsert): Promise<Expense> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single()

    if (error) {
      console.error("Error creating expense:", error)
      throw new Error(`Failed to create expense: ${error.message}`)
    }

    if (!data) {
      throw new Error("No data returned after creating expense")
    }

    return data as Expense
  } catch (error) {
    console.error("Error in createExpense:", error)
    throw error
  }
}

/**
 * Get recent expenses ordered by date
 * @param limit - Number of expenses to fetch (default: 5)
 * @returns List of expenses with category details
 */
export async function getRecentExpenses(limit: number = 20): Promise<ExpenseWithCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("expenses")
    .select("*, categories(*), sub_categories(*)")
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent expenses:", error)
    return []
  }

  return data as ExpenseWithCategory[]
}
