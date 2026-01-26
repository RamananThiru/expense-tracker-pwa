/**
 * Date Utilities for Analytics
 *
 * Utility functions for calculating date ranges for analytics.
 */

/**
 * Get date range for different time periods
 */
export function getDateRange(period: "current-month" | "previous-month" | "six-months"): { startDate: string; endDate: string } {
  const now = new Date();

  switch (period) {
    case "current-month": {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }

    case "previous-month": {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }

    case "six-months": {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Start of 6 months ago
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }

    default:
      throw new Error(`Invalid period: ${period}`);
  }
}