"use client"

import type React from "react"
import { useLocation } from "react-router-dom"
import { Header } from "@/components/header"
import { BottomNavigation } from "@/components/bottom-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header - hidden on home page */}
      {!isHomePage && <Header currentPath={location.pathname} />}

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Fixed bottom navigation */}
      <BottomNavigation currentPath={location.pathname} />
    </div>
  )
}
