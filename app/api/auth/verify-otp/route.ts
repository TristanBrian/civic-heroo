import { type NextRequest, NextResponse } from "next/server"
import { getOTP, removeOTP } from "@/lib/otp-storage"

function formatPhoneNumber(phone: string): string {
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

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: "Phone number and OTP are required" }, { status: 400 })
    }

    const formattedPhone = formatPhoneNumber(phone)
    const storedOTP = getOTP(formattedPhone)

    console.log(`🔍 Verifying OTP for: ${formattedPhone}`)
    console.log(`📝 Provided OTP: ${otp}`)
    console.log(`💾 Stored OTP: ${storedOTP}`)

    if (!storedOTP) {
      return NextResponse.json(
        { success: false, error: "No verification code found. Please request a new code." },
        { status: 400 },
      )
    }

    if (storedOTP !== otp) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // OTP is valid, remove it from storage
    removeOTP(formattedPhone)

    console.log("✅ OTP verified successfully")

    // Create user data
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      phone: formattedPhone,
      isAuthenticated: true,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      achievements: ["first_login"],
      tokens: 50,
      xp: 0,
      level: 1,
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      user: userData,
    })
  } catch (error) {
    console.error("❌ Verify OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify OTP" }, { status: 500 })
  }
}
