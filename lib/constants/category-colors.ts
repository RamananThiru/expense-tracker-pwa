/**
 * Category Color Palette
 *
 * Modern, vibrant colors optimized for:
 * - Visual distinction in pie charts and lists
 * - Accessibility and contrast ratios
 * - Mobile and responsive design
 */

export type CategoryType =
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Health"
  | "Shopping"
  | "Bills"
  | "Other"

export interface CategoryColor {
  bg: string
  text: string
  fill: string
}

/**
 * Category color mapping with Tailwind classes and hex colors
 * - bg: Background color class for circular indicator
 * - text: Text color class for category name
 * - fill: Hex color for pie chart and legend
 */
export const CATEGORY_COLORS: Record<CategoryType, CategoryColor> = {
  Food: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    fill: "#f97316",
  },
  Transport: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    fill: "#3b82f6",
  },
  Housing: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    fill: "#d97706",
  },
  Entertainment: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    fill: "#a855f7",
  },
  Health: {
    bg: "bg-green-100",
    text: "text-green-600",
    fill: "#10b981",
  },
  Shopping: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    fill: "#ec4899",
  },
  Bills: {
    bg: "bg-red-100",
    text: "text-red-600",
    fill: "#ef4444",
  },
  Other: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    fill: "#64748b",
  },
}

/**
 * Get color configuration for a category
 * @param category - Category name
 * @returns Color configuration object, defaults to 'Food' if category not found
 */
export function getCategoryColor(category: string): CategoryColor {
  return CATEGORY_COLORS[category as CategoryType] || CATEGORY_COLORS.Food
}

/**
 * Get hex color for a category
 * @param category - Category name
 * @returns Hex color code for pie charts and other visualizations
 */
export function getCategoryHexColor(category: string): string {
  return getCategoryColor(category).fill
}

/**
 * Get all available categories
 * @returns Array of category names
 */
export function getCategories(): CategoryType[] {
  return Object.keys(CATEGORY_COLORS) as CategoryType[]
}
