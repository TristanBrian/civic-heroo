"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Phone, Shield, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [developmentOTP, setDevelopmentOTP] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "")

    // Handle Kenyan phone numbers
    if (cleaned.startsWith("254")) {
      return `+${cleaned}`
    } else if (cleaned.startsWith("0")) {
      return `+254${cleaned.substring(1)}`
    } else if (cleaned.length === 9) {
      return `+254${cleaned}`
    }

    return `+254${cleaned}`
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("otp")
        if (data.developmentOTP) {
          setDevelopmentOTP(data.developmentOTP)
          console.log("🔧 Development mode: Your OTP is", data.developmentOTP)
        }
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        if (data.user.onboardingCompleted) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (value: string) => {
    setOtp(value)
    setError("")
  }

  if (step === "phone") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Welcome to CivicHero</CardTitle>
          <CardDescription>Enter your phone number to get started with civic engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => {
                  // Allow digits and optional leading + only
                  let value = e.target.value
                  // Remove all characters except digits and +
                  value = value.replace(/[^\d+]/g, "")
                  // Ensure + only at start
                  if (value.includes("+")) {
                    value = "+" + value.replace(/\+/g, "")
                  }
                  setPhone(value)
                }}
                required
              />
              <p className="text-xs text-gray-500">We'll send you a verification code via SMS</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !phone}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Verify Your Phone</CardTitle>
        <CardDescription>Enter the 6-digit code sent to {formatPhoneNumber(phone)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <InputOTP maxLength={6} value={otp} onChange={handleOTPChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {developmentOTP && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Development Mode:</strong> Your OTP is {developmentOTP}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setStep("phone")
              setOtp("")
              setError("")
              setDevelopmentOTP("")
            }}
          >
            Change Phone Number
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
