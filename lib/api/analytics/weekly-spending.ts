/**
 * Weekly Spending Analytics API
 *
 * Function for calculating weekly spending data from Supabase.
 */

import { createClient } from "@/utils/supabase/server";
import type { Expense } from "@/lib/types/database.types";

// Define the return type for weekly spending
export interface WeeklySpending {
  week: string;
  amount: number;
}

/**
 * Get weekly spending for a given date range
 */
export async function getWeeklySpending(
  startDate: string,
  endDate: string
): Promise<WeeklySpending[]> {
  try {
    const supabase = await createClient();

    // Get expenses within the date range
    const { data, error } = await supabase
      .from("expenses")
      .select("expense_date, amount")
      .gte("expense_date", startDate)
      .lte("expense_date", endDate)
      .is("deleted_at", null) // Only include non-deleted expenses
      .order("expense_date", { ascending: true });

    if (error) {
      console.error("Error fetching weekly spending:", error);
      throw new Error(`Failed to fetch weekly spending: ${error.message}`);
    }

    // Group expenses by week
    const weeks: Record<string, number> = {};

    data?.forEach(expense => {
      const expenseDate = new Date(expense.expense_date);
      const weekNumber = getWeekNumber(expenseDate, new Date(startDate));
      const weekLabel = `Week ${weekNumber}`;

      if (!weeks[weekLabel]) {
        weeks[weekLabel] = 0;
      }
      weeks[weekLabel] += parseFloat(expense.amount.toString());
    });

    // Convert to array format
    return Object.entries(weeks).map(([week, amount]) => ({
      week,
      amount: parseFloat(amount.toFixed(2))
    })).sort((a, b) => {
      // Sort by week number
      const numA = parseInt(a.week.split(' ')[1]);
      const numB = parseInt(b.week.split(' ')[1]);
      return numA - numB;
    });
  } catch (error) {
    console.error("Error in getWeeklySpending:", error);
    throw error;
  }
}

/**
 * Helper function to get week number for a date
 * This calculates the week number within the date range, not the calendar week
 */
function getWeekNumber(date: Date, startDate: Date): number {
  // Calculate the number of days from the start date
  const timeDifference = date.getTime() - startDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate the week number (starting from 1)
  // Use Math.max to ensure we always return at least week 1
  return Math.max(1, Math.floor(daysDifference / 7) + 1);
}