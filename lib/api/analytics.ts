/**
 * Analytics API Aggregator
 *
 * Main entry point for analytics functions. Re-exports individual modules.
 */

export {
  getCategoryBreakdown,
  type CategoryBreakdown
} from "./analytics/category-breakdown";

export {
  getWeeklySpending,
  type WeeklySpending
} from "./analytics/weekly-spending";

export {
  getSummaryStats,
  type SummaryStats
} from "./analytics/summary-stats";

export {
  getDateRange
} from "./analytics/date-utils";