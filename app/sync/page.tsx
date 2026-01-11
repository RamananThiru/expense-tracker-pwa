"use client"

import { AppLayout } from "@/components/app-layout"
import SyncPageComponent from "@/components/sync-page"

export default function SyncPage() {
  return (
    <AppLayout>
      <div className="w-full h-full bg-background pb-24">
        <div className="px-4 pt-4">
          <SyncPageComponent />
        </div>
      </div>
    </AppLayout>
  )
}
