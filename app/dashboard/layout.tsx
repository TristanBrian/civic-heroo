"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/sidebar"
import type { User } from "../../types"

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

  // Create a complete user object with default values for missing properties
  const completeUser: User = {
    id: user.id,
    phone: user.phone,
    name: user.name || "CivicHero",
    county: user.county ?? null,
    language: user.language === "en" || user.language === "sw" ? user.language : "en",
    level: user.level ?? 1,
    xp: user.xp ?? 0,
    tokens: user.tokens ?? 0,
    streak: user.streak ?? 0,
    achievements: user.achievements ?? [],
    completedLessons: user.completedLessons ?? [],
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  }

  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="flex min-h-screen flex-col md:flex-row">
          <div className="w-full md:w-64 flex-shrink-0">
            <AppSidebar
              user={completeUser}
              onLanguageChange={handleLanguageChange}
              isDarkMode={isDarkMode}
              onThemeToggle={handleThemeToggle}
            />
          </div>
          <main className="flex-1 bg-white dark:bg-gray-900">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  )
}
