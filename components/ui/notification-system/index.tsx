"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface Notification {
  id: string
  type: "info" | "error" | "success"
  title: string
  message: string
}

interface Achievement {
  id: string
  title: string
  description: string
  xpReward: number
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, "id">) => void
  showAchievement: (title: string, description: string, xpReward: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { id, ...notification }])
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }, [])

  const showAchievement = useCallback((title: string, description: string, xpReward: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    setAchievements((prev) => [...prev, { id, title: description, description: title, xpReward }])
    // Auto-remove achievement after 5 seconds
    setTimeout(() => {
      setAchievements((prev) => prev.filter((a) => a.id !== id))
    }, 5000)
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, showAchievement }}>
      {children}
      {/* Render notifications and achievements here */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 rounded shadow text-white ${n.type === "error" ? "bg-red-600" : n.type === "success" ? "bg-green-600" : "bg-blue-600"}`}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        ))}
        {achievements.map((a) => (
          <div key={a.id} className="p-4 rounded shadow bg-yellow-400 text-black">
            <strong>{a.title}</strong>
            <p>XP Reward: {a.xpReward}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
