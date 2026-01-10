import type { Expense, Category, SubCategory, ExpenseInsert } from '@/lib/types/database.types';

export type { Expense, Category, SubCategory, ExpenseInsert };

/**
 * Simplified V1 Local Expense
 * - local_id: IDB Primary Key (Auto-inc)
 * - id: Server ID (Nullable until synced)
 * - synced: Simple boolean flag
 */
export interface LocalExpense extends ExpenseInsert {
  local_id?: number;
  id?: number;       // Server ID (optional until synced)
  synced: boolean;   // boolean is fine, we filter in JS

  updated_at: string;
  created_at: string;
}

export interface SyncResult {
  pushed: number;
  errors: any[];
}
