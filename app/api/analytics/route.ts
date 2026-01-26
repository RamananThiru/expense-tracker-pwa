import { NextResponse } from "next/server";
import {
  getCategoryBreakdown,
  getWeeklySpending,
  getSummaryStats,
  getDateRange
} from "@/lib/api/analytics";

export async function GET(request: Request) {
  try {
    // Extract search params from the URL
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    
    if (!period || !["current-month", "previous-month", "six-months"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Use 'current-month', 'previous-month', or 'six-months'." },
        { status: 400 }
      );
    }

    // Get the date range based on the period
    const { startDate, endDate } = getDateRange(period as "current-month" | "previous-month" | "six-months");

    // Fetch analytics data
    const categoryBreakdown = await getCategoryBreakdown(startDate, endDate);
    const weeklySpending = await getWeeklySpending(startDate, endDate);
    const summaryStats = await getSummaryStats(startDate, endDate, categoryBreakdown);

    // Return the combined analytics data
    return NextResponse.json({
      categoryBreakdown,
      weeklySpending,
      summaryStats,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error("API error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}