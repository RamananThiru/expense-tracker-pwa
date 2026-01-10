/**
 * Database Type Definitions
 * 
 * TypeScript interfaces matching the Supabase database schema.
 * See docs/DB_SCHEMA.md for the complete database schema.
 */

// Category from database
export interface Category {
  id: number
  code: string           // Matches CategoryType (Food, Transport, etc.)
  description: string    // Display name
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// SubCategory from database
export interface SubCategory {
  id: number
  category_id: number
  code: string
  description: string    // Display name
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Expense record for database insertion
export interface ExpenseInsert {
  amount: number
  expense_date: string   // YYYY-MM-DD format
  category_id: number
  sub_category_id: number | null
  description?: string | null
  item_name?: string | null
  notes?: string | null
  priority: string       // ExpensePriority enum value
  payment_type: string   // PaymentType enum value
  is_emi: boolean
  is_vacation: boolean
}

// Complete expense record from database
export interface Expense extends ExpenseInsert {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}
