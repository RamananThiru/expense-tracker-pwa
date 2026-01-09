"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { BottomNavigation } from "@/components/bottom-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header - hidden on home page and add expense page */}
      {!isHomePage && <Header currentPath={pathname} />}

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Fixed bottom navigation */}
      <BottomNavigation currentPath={pathname} />
    </div>
  )
}
