"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { VoiceAssistant } from "@/components/onboarding/voice-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LogOut, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

// Kenyan counties
const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
]

// Civic interests
const CIVIC_INTERESTS = [
  { id: "governance", label: "Local Governance", description: "County assemblies, ward reps" },
  { id: "budget", label: "Public Budget", description: "How taxes are spent" },
  { id: "services", label: "Public Services", description: "Healthcare, education, water" },
  { id: "environment", label: "Environment", description: "Conservation, climate change" },
  { id: "youth", label: "Youth Programs", description: "Employment, skills development" },
  { id: "women", label: "Women's Rights", description: "Gender equality, empowerment" },
  { id: "business", label: "Business & Trade", description: "SMEs, market access" },
  { id: "infrastructure", label: "Infrastructure", description: "Roads, bridges, utilities" },
]

interface OnboardingData {
  name: string
  age: string
  county: string
  interests: string[]
  experience: string
}

export default function OnboardingPage() {
  const { user, updateUser, logout, isLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState<"en" | "sw">("en")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("onboardingCurrentStep")
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingCurrentStep", currentStep.toString())
    }
  }, [currentStep])

  if (isLoading) {
    return null
  }
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)

  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    county: "",
    interests: [],
    experience: "beginner",
  })

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/")
    }
  }, [user, router])

  const handleComplete = async () => {
    try {
      const updatedUser = {
        ...user,
        ...formData,
        onboarded: true,
        onboardingCompleted: true,
        profileComplete: true,
        tokens: (user?.tokens || 0) + 100, // Bonus tokens for completing onboarding
        xp: (user?.xp || 0) + 50, // Bonus XP
        achievements: [...(user?.achievements || []), "profile_complete"],
      }

      localStorage.removeItem("onboardingCurrentStep")

      await updateUser(updatedUser)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    }
  }

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  if (!user?.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-600">CivicHero</h1>
              <Badge variant="outline">Onboarding</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
                {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                Voice {isVoiceEnabled ? "On" : "Off"}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}>
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Audio {isSpeechEnabled ? "On" : "Off"}
              </Button>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Language Selector */}
          <div className="mb-6">
            <label htmlFor="language" className="block mb-2 font-medium text-gray-700">
              Select Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "sw")}
              className="w-full p-2 border rounded-md"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Complete Your Profile</h2>
              <span className="text-sm text-gray-500">Step {currentStep + 1} of 5</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>

          {/* Welcome Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🎉 Welcome to CivicHero!</CardTitle>
              <CardDescription>
                Let's set up your profile to personalize your civic engagement journey. You can use voice commands or
                type your responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mic className="h-4 w-4" />
                  Voice Recognition: {isVoiceEnabled ? "Enabled" : "Disabled"}
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  Audio Prompts: {isSpeechEnabled ? "Enabled" : "Disabled"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Assistant */}
          <VoiceAssistant
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            formData={formData}
            onFormDataChange={setFormData}
            onComplete={handleComplete}
            isVoiceEnabled={isVoiceEnabled}
            isSpeechEnabled={isSpeechEnabled}
            language={language}
          />
        </div>
      </div>
    </div>
  )
}
