"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/app-layout"
import { HomePage } from "@/components/pages/home-page"
import { AddExpensePage } from "@/components/pages/add-expense-page"
import { AnalyticsPage } from "@/components/pages/analytics-page"

export default function RootPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // or a loading spinner
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddExpensePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}
