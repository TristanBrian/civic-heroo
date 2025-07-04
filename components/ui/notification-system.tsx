"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info, Trophy, Coins } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "achievement" | "token"
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, "id">) => void
  showSuccess: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showInfo: (message: string, title?: string) => void
  showAchievement: (title: string, message: string) => void
  showTokenEarned: (amount: number, reason: string) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }

    setNotifications((prev) => [...prev, newNotification])

    // Auto remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, duration)
  }, [])

  const showSuccess = useCallback(
    (message: string, title = "Success") => {
      showNotification({ type: "success", title, message })
    },
    [showNotification],
  )

  const showError = useCallback(
    (message: string, title = "Error") => {
      showNotification({ type: "error", title, message })
    },
    [showNotification],
  )

  const showInfo = useCallback(
    (message: string, title = "Info") => {
      showNotification({ type: "info", title, message })
    },
    [showNotification],
  )

  const showAchievement = useCallback(
    (title: string, message: string) => {
      showNotification({ type: "achievement", title, message, duration: 7000 })
    },
    [showNotification],
  )

  const showTokenEarned = useCallback(
    (amount: number, reason: string) => {
      showNotification({
        type: "token",
        title: `+${amount} Tokens Earned!`,
        message: reason,
        duration: 6000,
      })
    },
    [showNotification],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showAchievement,
        showTokenEarned,
        removeNotification,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification
  onRemove: () => void
}) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-purple-600" />
      case "token":
        return <Coins className="h-4 w-4 text-yellow-600" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertClass = () => {
    switch (notification.type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      case "achievement":
        return "border-purple-200 bg-purple-50"
      case "token":
        return "border-yellow-200 bg-yellow-50"
      default:
        return ""
    }
  }

  return (
    <Alert className={`${getAlertClass()} cursor-pointer transition-all hover:shadow-md`} onClick={onRemove}>
      {getIcon()}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          {notification.type === "achievement" && (
            <Badge className="bg-purple-100 text-purple-800 text-xs">🏆 Achievement</Badge>
          )}
          {notification.type === "token" && <Badge className="bg-yellow-100 text-yellow-800 text-xs">💰 Reward</Badge>}
        </div>
        <AlertDescription className="text-xs mt-1">{notification.message}</AlertDescription>
      </div>
    </Alert>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
