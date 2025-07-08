"use client"

import React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/index"

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("civichero_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Map onboardingCompleted to onboarded if needed
        if (userData && typeof userData === "object") {
          userData.achievements = Array.isArray(userData.achievements) ? userData.achievements : ["first_login"]
          if (userData.onboardingCompleted !== undefined) {
            userData.onboarded = userData.onboardingCompleted
            delete userData.onboardingCompleted
          }
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to parse saved user data:", error)
        localStorage.removeItem("civichero_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    // Map onboardingCompleted to onboarded if needed
    const userWithAchievements = {
      ...userData,
      achievements: Array.isArray(userData.achievements) ? userData.achievements : ["first_login"],
      onboarded: (userData as any).onboardingCompleted ?? userData.onboarded,
    }
    setUser(userWithAchievements)
    localStorage.setItem("civichero_user", JSON.stringify(userWithAchievements))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("civichero_user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...userData,
      achievements: Array.isArray(userData.achievements) ? userData.achievements : user.achievements || ["first_login"],
      onboarded: (userData as any).onboardingCompleted ?? userData.onboarded ?? user.onboarded,
    }
    setUser(updatedUser)
    localStorage.setItem("civichero_user", JSON.stringify(updatedUser))
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
