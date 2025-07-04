"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/hooks/use-auth"
import { NotificationProvider } from "@/components/ui/notification-system"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = pathname === "/" || pathname === "/test/sms"
    const isOnboardingRoute = pathname === "/onboarding"
    const isDashboardRoute = pathname.startsWith("/dashboard")

    if (!user?.isAuthenticated && !isPublicRoute) {
      router.push("/")
    } else if (user?.isAuthenticated && !user?.onboardingCompleted && !isOnboardingRoute && isDashboardRoute) {
      router.push("/onboarding")
    } else if (user?.isAuthenticated && user?.onboardingCompleted && isOnboardingRoute) {
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  )
}
