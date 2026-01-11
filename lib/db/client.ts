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

let _db: ExpenseTrackerDB | null = null

function createDB() {
  return new ExpenseTrackerDB()
}

// Helper for hooks to ensure DB is open. Handles VersionError by deleting and recreating the DB.
export const getDB = async () => {
  if (!_db) {
    _db = createDB()
  }

  try {
    await _db.open()
    return _db
  } catch (err: any) {
    // Handle Dexie VersionError: existing DB has higher version than current schema
    if (err && err.name === 'VersionError') {
      console.warn('IndexedDB version mismatch detected, deleting DB and recreating...', err)
      try {
        await Dexie.delete('expense-tracker-db')
      } catch (delErr) {
        console.error('Failed to delete old IndexedDB:', delErr)
      }

      _db = createDB()
      await _db.open()
      return _db
    }

    throw err
  }
}

