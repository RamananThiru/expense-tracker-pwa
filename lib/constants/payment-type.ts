// Payment Type Enum - matches Supabase enum type
export enum PaymentType {
  UPI = 'upi',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash'
}

// Display labels for payment types
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  [PaymentType.UPI]: 'UPI',
  [PaymentType.CREDIT_CARD]: 'Credit Card',
  [PaymentType.DEBIT_CARD]: 'Debit Card',
  [PaymentType.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentType.CASH]: 'Cash'
}

// Array of all payment types for iteration
export const ALL_PAYMENT_TYPES = Object.values(PaymentType)
