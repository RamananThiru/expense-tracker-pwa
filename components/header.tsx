"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  currentPath: string
}

export function Header({ currentPath }: HeaderProps) {
  const router = useRouter()

  const getHeaderTitle = (path: string) => {
    switch (path) {
      case "/add":
        return "Add Expense"
      case "/analytics":
        return "Analytics"
      default:
        return "Expense Tracker"
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Back button */}
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>

        {/* Title */}
        <h1 className="text-lg font-semibold">{getHeaderTitle(currentPath)}</h1>

        {/* Empty space for alignment */}
        <div className="w-10" />
      </div>
    </header>
  )
}
