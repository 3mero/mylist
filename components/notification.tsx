"use client"
import { CheckCircle, XCircle, Info } from "lucide-react"
import { usePlaylist } from "@/contexts/playlist-context"

export function Notification() {
  const { notification } = usePlaylist()

  if (!notification) return null

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
      default:
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
    }
  }

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border shadow-lg backdrop-blur-sm ${getBgColor()}`}>
        {getIcon()}
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  )
}
