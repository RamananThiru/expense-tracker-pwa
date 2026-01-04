"use client"

import { Link } from "react-router-dom"
import { Home, Plus, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  currentPath: string
}

export function BottomNavigation({ currentPath }: BottomNavigationProps) {
  const navigationItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/add",
      label: "Add",
      icon: Plus,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: PieChart,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-20 px-2 max-w-lg mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          const isAddButton = item.path === "/add"

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200",
                isAddButton
                  ? "bg-primary text-primary-foreground scale-105 shadow-lg"
                  : isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Icon */}
              <Icon className={cn("h-6 w-6 transition-transform duration-200", isAddButton && "scale-110")} />

              {/* Label */}
              <span className="text-xs mt-1 font-medium">{item.label}</span>

              {/* Underline indicator for active tab (except Add button) */}
              {isActive && !isAddButton && <div className="absolute bottom-0 h-1 w-8 bg-primary rounded-t-md" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
