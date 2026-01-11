import Dexie, { type Table } from 'dexie';
import type { Category, SubCategory } from '@/lib/types/database.types';
import type { LocalExpense } from '@/lib/sync/types';

export class ExpenseTrackerDB extends Dexie {
  categories!: Table<Category>;
  subcategories!: Table<SubCategory>;
  expenses!: Table<LocalExpense>;

  constructor() {
    super('expense-tracker-db');

    // Schema definition
    // Note: IndexedDB is robust, but changing schema requires version bump.
    // keys: 
    // - categories: id
    // - subcategories: id, category_id
    // - expenses: ++local_id (auto-inc), synced, expense_date
    this.version(4).stores({
      categories: 'id',
      subcategories: 'id, category_id', // category_id index
      expenses: '++local_id, synced, expense_date'
    });
  }
}

export const db = new ExpenseTrackerDB();

// Helper for hooks to ensure DB is open (Dexie auto-opens, but for consistency if needed)
export const getDB = async () => {
  return db;
}

