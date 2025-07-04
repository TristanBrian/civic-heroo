import { type NextRequest, NextResponse } from "next/server"
import { storeOTP } from "@/lib/otp-storage"

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC6f94c4c8c4c4c4c4c4c4c4c4c4c4c4c4"
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your_auth_token_here"
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+1234567890"

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

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

async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    console.log(`🔧 Attempting to send SMS to: ${to}`)
    console.log(`📱 Message: ${message}`)

    // Check if Twilio credentials are configured
    if (
      !TWILIO_ACCOUNT_SID ||
      TWILIO_ACCOUNT_SID === "AC6f94c4c8c4c4c4c4c4c4c4c4c4c4c4c4" ||
      !TWILIO_AUTH_TOKEN ||
      TWILIO_AUTH_TOKEN === "your_auth_token_here"
    ) {
      console.log("⚠️ Twilio credentials not configured")
      return false
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: to,
        Body: message,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ SMS sent successfully:", result.sid)
      return true
    } else {
      const error = await response.text()
      console.error("❌ SMS failed:", error)
      return false
    }
  } catch (error) {
    console.error("❌ SMS error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    const formattedPhone = formatPhoneNumber(phone)
    const otp = generateOTP()

    console.log(`📞 Sending OTP to: ${formattedPhone}`)

    // Store OTP
    storeOTP(formattedPhone, otp)

    // Try to send SMS
    const message = `Your CivicHero verification code is: ${otp}. This code expires in 10 minutes.`
    const smsSent = await sendSMS(formattedPhone, message)

    if (!smsSent) {
      console.log("⚠️ SMS failed, but OTP stored for development:", otp)
      console.log("🔧 Development mode: Your OTP is", otp)
    }
    
    // Workaround for Twilio trial account: always return OTP in response for development
    return NextResponse.json({
      success: true,
      message: "OTP generated (check console or response in development mode)",
      developmentOTP: otp,
    })

    return NextResponse.json({
      success: true,
      message: smsSent ? "OTP sent successfully" : "OTP generated (check console in development mode)",
      developmentOTP: !smsSent ? otp : undefined,
    })
  } catch (error) {
    console.error("❌ Send OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 })
  }
}
