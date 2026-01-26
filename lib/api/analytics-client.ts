/**
 * Analytics API Client
 *
 * Client-side functions for retrieving expense analytics from the API.
 */

import type {
  CategoryBreakdown,
  WeeklySpending,
  SummaryStats
} from "./analytics";

export interface AnalyticsData {
  categoryBreakdown: CategoryBreakdown[];
  weeklySpending: WeeklySpending[];
  summaryStats: SummaryStats;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Fetch analytics data for a given time period
 */
export async function fetchAnalyticsData(
  period: "current-month" | "previous-month" | "six-months"
): Promise<AnalyticsData> {
  try {
    const response = await fetch(`/api/analytics?period=${period}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch analytics data");
    }
    
    const data = await response.json();
    return data as AnalyticsData;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}