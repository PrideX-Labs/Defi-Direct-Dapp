"use client"

import { Suspense, useState, useEffect } from "react"
import SettingsContent from "@/components/settings/SettingsContent"
import SettingsContentSkeleton from "@/components/settings/settings-content-skeleton"

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen py-6">
      <Suspense fallback={<SettingsContentSkeleton />}>
        {isLoading ? <SettingsContentSkeleton /> : <SettingsContent />}
      </Suspense>
    </div>
  )
}

export default Settings
