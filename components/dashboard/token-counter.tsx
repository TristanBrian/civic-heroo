"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"
import { subscribeToUserTokens } from "@/lib/supabase"

interface TokenCounterProps {
  initialTokens: number
  userId: string
  label: string
}

export function TokenCounter({ initialTokens, userId, label }: TokenCounterProps) {
  const [tokens, setTokens] = useState(initialTokens)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const subscription = subscribeToUserTokens(userId, (newTokens) => {
      if (newTokens !== tokens) {
        setIsAnimating(true)
        setTimeout(() => {
          setTokens(newTokens)
          setIsAnimating(false)
        }, 300)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, tokens])

  return (
    <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{label}</p>
            <p
              className={`text-3xl font-bold transition-all duration-300 ${
                isAnimating ? "scale-110 text-yellow-200" : "scale-100"
              }`}
            >
              {tokens.toLocaleString()}
            </p>
          </div>
          <Coins
            className={`h-12 w-12 transition-all duration-300 ${
              isAnimating ? "rotate-12 scale-110" : "rotate-0 scale-100"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
