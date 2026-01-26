/**
 * Summary Statistics Analytics API
 *
 * Function for calculating summary statistics from Supabase data.
 */

import type { CategoryBreakdown } from "./category-breakdown";

// Define the return type for summary stats
export interface SummaryStats {
  totalSpent: number;
  avgPerDay: number;
  largestCategory: {
    category: string;
    amount: number;
    percentage: number;
  };
}

/**
 * Get summary statistics for a given date range
 */
export async function getSummaryStats(
  startDate: string,
  endDate: string,
  categoryBreakdown: CategoryBreakdown[]
): Promise<SummaryStats> {
  try {
    // Calculate total spent
    const totalSpent = categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);

    // Calculate date difference for average per day
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil(Math.abs((end.getTime() - start.getTime()) / (1000 * 3600 * 24))) + 1; // +1 to include both start and end dates

    const avgPerDay = totalSpent / daysDiff;

    // Find the largest category
    const largestCategory = categoryBreakdown.length > 0
      ? categoryBreakdown.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)
      : { category: "N/A", amount: 0, percentage: 0 };

    return {
      totalSpent,
      avgPerDay: parseFloat(avgPerDay.toFixed(2)),
      largestCategory
    };
  } catch (error) {
    console.error("Error in getSummaryStats:", error);
    throw error;
  }
}