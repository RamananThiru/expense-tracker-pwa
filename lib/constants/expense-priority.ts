// Expense Priority Enum - matches Supabase enum type
export enum ExpensePriority {
  NEED = 'need',
  WANT = 'want',
  UNWANTED = 'unwanted',
  PLANNED = 'planned',
  CAPEX = 'capex'
}

// Display labels for priorities
export const PRIORITY_LABELS: Record<ExpensePriority, string> = {
  [ExpensePriority.NEED]: 'Need',
  [ExpensePriority.WANT]: 'Want',
  [ExpensePriority.UNWANTED]: 'Unwanted',
  [ExpensePriority.PLANNED]: 'Planned',
  [ExpensePriority.CAPEX]: 'CAPEX'
}

// Array of all priorities for iteration
export const ALL_PRIORITIES = Object.values(ExpensePriority)
