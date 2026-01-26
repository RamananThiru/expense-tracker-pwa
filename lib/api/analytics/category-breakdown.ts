/**
 * Category Breakdown Analytics API
 *
 * Function for aggregating expenses by category from Supabase.
 */

import { createClient } from "@/utils/supabase/server";
import type { Expense, Category } from "@/lib/types/database.types";
import { getCategoryHexColor } from "@/lib/constants/category-colors";

// Define the return type for category breakdown
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  fill: string;
}

/**
 * Get category breakdown for a given date range
 */
export async function getCategoryBreakdown(
  startDate: string,
  endDate: string
): Promise<CategoryBreakdown[]> {
  try {
    const supabase = await createClient();

    // First, get all categories to ensure we have the display names
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, code, description");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    // Get expenses grouped by category_id within the date range
    const { data, error } = await supabase
      .from("expenses")
      .select("category_id, amount")
      .gte("expense_date", startDate)
      .lte("expense_date", endDate)
      .is("deleted_at", null) // Only include non-deleted expenses

    if (error) {
      console.error("Error fetching category breakdown:", error);
      throw new Error(`Failed to fetch category breakdown: ${error.message}`);
    }

    // Group expenses by category_id and sum the amounts
    const categoryTotals: Record<number, number> = {};
    data?.forEach(expense => {
      if (!categoryTotals[expense.category_id]) {
        categoryTotals[expense.category_id] = 0;
      }
      categoryTotals[expense.category_id] += parseFloat(expense.amount.toString());
    });

    // Calculate total amount for percentage calculation
    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Map category IDs to their descriptions and calculate percentages
    return Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const categoryIdNum = parseInt(categoryId);
      const categoryRecord = categories.find(cat => cat.id === categoryIdNum);
      const categoryCode = categoryRecord?.code || 'Other'; // Use 'Other' as fallback which exists in color mapping
      const categoryDesc = categoryRecord?.description || 'Unknown';
      const percentage = totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0;

      // Get the color for the category
      // If the category code doesn't match expected types, it will default to Food color (#f97316)
      // To prevent all unknown categories from appearing in the same color, we'll use a hash-based approach
      const baseColor = getCategoryHexColor(categoryCode);

      // If it's the default Food color (orange) and the category code is not 'Food',
      // assign a deterministic color based on the category code
      let finalColor = baseColor;
      if (baseColor === '#f97316' && categoryCode !== 'Food') { // Default Food color
        // Generate a deterministic color based on the category code
        finalColor = generateColorFromText(categoryCode);
      }

      return {
        category: categoryDesc, // Use description for display
        amount,
        percentage,
        fill: finalColor
      };
    });
  } catch (error) {
    console.error("Error in getCategoryBreakdown:", error);
    throw error;
  }
}

/**
 * Generates a deterministic color based on the input text
 * This ensures that the same category always gets the same color
 */
function generateColorFromText(text: string): string {
  // Create a simple hash of the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to RGB values
  const r = (hash >> 16) & 255;
  const g = (hash >> 8) & 255;
  const b = hash & 255;

  // Convert to hex
  return '#' + ('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2);
}