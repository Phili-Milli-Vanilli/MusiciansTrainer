"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Setze den initialen Status
    setIsOnline(navigator.onLine)

    // Event-Listener für Online/Offline-Status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50 flex items-center justify-center">
      <WifiOff className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">Du bist offline. Einige Funktionen sind möglicherweise eingeschränkt.</span>
    </div>
  )
}
