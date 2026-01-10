import { NextRequest, NextResponse } from "next/server"
import { fetchSubcategoriesByCategoryId } from "@/lib/api/subcategories"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("categoryId")

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId parameter is required" },
        { status: 400 }
      )
    }

    const categoryIdNum = parseInt(categoryId, 10)
    if (isNaN(categoryIdNum)) {
      return NextResponse.json(
        { error: "categoryId must be a valid number" },
        { status: 400 }
      )
    }

    const subcategories = await fetchSubcategoriesByCategoryId(categoryIdNum)
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("API error fetching subcategories:", error)
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    )
  }
}
