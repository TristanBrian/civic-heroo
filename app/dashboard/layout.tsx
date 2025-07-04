"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/sidebar"
import type { User } from "@/types"

import { useAuth } from "@/hooks/use-auth"
import { NotificationProvider } from "@/components/ui/notification-system"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, updateUser } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleLanguageChange = (language: "en" | "sw") => {
    if (updateUser) {
      updateUser({ language })
    }
  }

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev)
    document.documentElement.classList.toggle("dark")
  }

  if (!hasMounted) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <NotificationProvider>
      <SidebarProvider>
        <AppSidebar
          user={user}
          onLanguageChange={handleLanguageChange}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />
        {children}
      </SidebarProvider>
    </NotificationProvider>
  )
}
