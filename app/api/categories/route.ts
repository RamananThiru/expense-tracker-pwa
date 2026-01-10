import { NextResponse } from "next/server"
import { fetchCategories } from "@/lib/api/categories"

export async function GET() {
  try {
    const categories = await fetchCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
