"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { updateUserLanguage } from "@/lib/supabase"

interface LanguageToggleProps {
  currentLanguage: "en" | "sw"
  userId: string
  onLanguageChange: (language: "en" | "sw") => void
}

export function LanguageToggle({ currentLanguage, userId, onLanguageChange }: LanguageToggleProps) {
  const [isLoading, setIsLoading] = useState(false)

  const toggleLanguage = async () => {
    setIsLoading(true)
    const newLanguage = currentLanguage === "en" ? "sw" : "en"

    try {
      await updateUserLanguage(userId, newLanguage)
      onLanguageChange(newLanguage)
    } catch (error) {
      console.error("Failed to update language:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      disabled={isLoading}
      className="flex items-center gap-2 bg-transparent"
    >
      <Globe className="h-4 w-4" />
      {currentLanguage === "en" ? "SW" : "EN"}
    </Button>
  )
}
