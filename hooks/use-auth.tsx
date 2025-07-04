"use client"

import React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  phone: string
  name?: string
  age?: string
  county?: string
  interests?: string[]
  experience?: string
  isAuthenticated: boolean
  onboardingCompleted: boolean
  createdAt: string
  achievements: string[]
  tokens: number
  xp: number
  level: number
  language?: "en" | "sw"
}

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
        // Ensure achievements is always an array
        if (userData && typeof userData === "object") {
          userData.achievements = Array.isArray(userData.achievements) ? userData.achievements : ["first_login"]
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
    // Ensure achievements is always an array
    const userWithAchievements = {
      ...userData,
      achievements: Array.isArray(userData.achievements) ? userData.achievements : ["first_login"],
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
      // Ensure achievements is always an array
      achievements: Array.isArray(userData.achievements) ? userData.achievements : user.achievements || ["first_login"],
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
