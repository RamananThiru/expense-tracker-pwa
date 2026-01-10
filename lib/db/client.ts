import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Category, SubCategory } from '@/lib/types/database.types';
import type { LocalExpense } from '@/lib/sync/types';

// Define the IDB Schema
export interface ExpenseTrackerDB extends DBSchema {
  categories: {
    key: number;
    value: Category;
    indexes: {};
  };
  subcategories: {
    key: number;
    value: SubCategory;
    indexes: { 'by-category': number };
  };
  expenses: {
    key: number; // local_id (Auto-inc)
    value: LocalExpense;
    indexes: {
      'by-synced': boolean;
      'by-date': string;
    };
  };
}

const DB_NAME = 'expense-tracker-db';
const DB_VERSION = 3; // Bump to v3 for numeric index

let dbPromise: Promise<IDBPDatabase<ExpenseTrackerDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return Promise.resolve(null as any);

  if (!dbPromise) {
    dbPromise = openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`[DB] Upgrading from ${oldVersion} to ${newVersion}`);
        // Categories
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }

        // Subcategories
        if (!db.objectStoreNames.contains('subcategories')) {
          const subStore = db.createObjectStore('subcategories', { keyPath: 'id' });
          subStore.createIndex('by-category', 'category_id');
        }

        // Expenses
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', {
            keyPath: 'local_id',
            autoIncrement: true
          });
          expenseStore.createIndex('by-synced', 'synced');
          expenseStore.createIndex('by-date', 'expense_date');
        } else {
          // Upgrade logic for existing store if needed
          const store = transaction.objectStore('expenses');
          if (!store.indexNames.contains('by-synced')) {
            store.createIndex('by-synced', 'synced');
          }
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.error(`[DB] Database upgrade blocked! Current: ${currentVersion}, Blocked: ${blockedVersion}. Please close other tabs.`)
        alert("Database update blocked. Please reload the page or close other tabs.")
      },
      blocking(currentVersion, blockedVersion, event) {
        console.warn(`[DB] This connection is blocking a version upgrade. Closing...`)
        dbPromise = null
      },
      terminated() {
        console.error("[DB] Connection terminated abnormally")
        dbPromise = null
      }
    });
  }
  return dbPromise;
};
