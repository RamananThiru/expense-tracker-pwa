"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className = "" }: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`fixed bottom-28 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center active:scale-95 hover:scale-110 ${
        isPressed ? "scale-95" : "scale-100"
      } ${className}`}
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
