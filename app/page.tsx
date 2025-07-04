"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Award, MapPin, Smartphone, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.isAuthenticated) {
      if (user.onboardingCompleted) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    }
  }, [user, router])

  if (user?.isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CivicHero</h1>
                <p className="text-xs text-gray-500">Empowering Civic Engagement</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              🇰🇪 Made for Kenya
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">🚀 Join the Movement</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Empower Your
                <span className="text-blue-600"> Civic Voice</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn about your rights, engage with your community, and make a real difference in Kenya's democracy.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Learn & Grow</h3>
                  <p className="text-sm text-gray-600">Civic education made simple</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <MapPin className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Local Impact</h3>
                  <p className="text-sm text-gray-600">Connect with your community</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Award className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Earn Rewards</h3>
                  <p className="text-sm text-gray-600">Gamified civic engagement</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Smartphone className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold">SMS Powered</h3>
                  <p className="text-sm text-gray-600">Works on any phone</p>
                </div>
              </div>
            </div>

            {/* Language Support */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>Available in English and Kiswahili</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">Counties Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">1000+</div>
            <div className="text-sm text-gray-600">Active Citizens</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">50+</div>
            <div className="text-sm text-gray-600">Civic Lessons</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">SMS Support</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CivicHero Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and begin your journey to becoming a more engaged citizen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>1. Sign Up with SMS</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Enter your phone number and verify with SMS. No app download required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>2. Learn & Engage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Access civic education content, participate in community discussions, and stay informed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>3. Make Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Earn tokens, unlock achievements, and make a real difference in your community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CivicHero. Empowering Kenyan citizens through civic engagement.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
