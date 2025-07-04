import twilio from "twilio"

// Initialize Twilio client
let twilioClient: any | null = null
let isConfigured = false

// Check if Twilio is properly configured
function initializeTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER

  console.log("🔧 Twilio Configuration Check:")
  console.log("- Account SID:", accountSid ? "✅ Set" : "❌ Missing")
  console.log("- Auth Token:", authToken ? "✅ Set" : "❌ Missing")
  console.log("- Verify Service SID:", verifyServiceSid ? "✅ Set" : "❌ Missing")
  console.log("- Phone Number:", phoneNumber ? "✅ Set" : "❌ Missing")

  if (accountSid && authToken) {
    try {
      twilioClient = twilio(accountSid, authToken)
      isConfigured = true
      console.log("✅ Twilio client initialized successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to initialize Twilio client:", error)
      return false
    }
  }

  console.log("⚠️ Twilio not configured - using mock SMS")
  return false
}

// Initialize on module load
initializeTwilio()

// In-memory OTP storage for development/testing
const otpStorage = new Map<string, { code: string; expires: number }>()

// Clean expired OTPs
setInterval(() => {
  const now = Date.now()
  for (const [phone, data] of otpStorage.entries()) {
    if (now > data.expires) {
      otpStorage.delete(phone)
    }
  }
}, 60000) // Clean every minute

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "")

  // Handle different formats
  if (digits.startsWith("254")) {
    return "+" + digits
  } else if (digits.startsWith("0")) {
    return "+254" + digits.slice(1)
  } else if (digits.length <= 9) {
    return "+254" + digits
  }

  return "+" + digits
}

export function isValidKenyanPhone(phone: string): boolean {
  // Kenyan phone number validation
  const phoneRegex = /^\+254[17]\d{8}$/
  return phoneRegex.test(phone)
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

interface SMSResult {
  success: boolean
  error?: string
  messageId?: string
}

export async function sendSMS(to: string, message: string): Promise<SMSResult> {
  // Check if Twilio credentials are available
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("⚠️ Twilio credentials not configured")
    return {
      success: false,
      error: "SMS service not configured",
    }
  }

  try {
    // Format phone number
    const formattedTo = to.startsWith("+") ? to : `+${to}`

    console.log("📱 Sending SMS:", {
      to: formattedTo,
      from: fromNumber,
      message: message.substring(0, 50) + "...",
    })

    // Create Twilio client
    const client = require("twilio")(accountSid, authToken)

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo,
    })

    console.log("✅ SMS sent successfully:", result.sid)
    return {
      success: true,
      messageId: result.sid,
    }
  } catch (error: any) {
    console.error("❌ Twilio SMS error:", error)
    return {
      success: false,
      error: error.message || "Failed to send SMS",
    }
  }
}

export async function sendOTP(phone: string): Promise<{
  success: boolean
  message: string
  method: string
  otp?: string
}> {
  const formattedPhone = formatPhoneNumber(phone)

  if (!isValidKenyanPhone(formattedPhone)) {
    return {
      success: false,
      message: "Invalid Kenyan phone number format",
      method: "validation",
    }
  }

  // Try Twilio Verify Service first (recommended)
  if (isConfigured && process.env.TWILIO_VERIFY_SERVICE_SID) {
    try {
      console.log(`📱 Sending OTP via Twilio Verify to: ${formattedPhone}`)

      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: formattedPhone,
          channel: "sms",
        })

      console.log("✅ Twilio Verify OTP sent successfully:", verification.status)

      return {
        success: true,
        message: `Verification code sent to ${formattedPhone}`,
        method: "twilio-verify",
      }
    } catch (error: any) {
      console.error("❌ Twilio Verify failed:", error.message)

      // Fall through to direct SMS method
    }
  }

  // Try direct SMS method
  if (isConfigured && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const otp = generateOTP()
      console.log(`📱 Sending OTP via direct SMS to: ${formattedPhone}`)

      const message = await twilioClient.messages.create({
        body: `Your CivicHero verification code is: ${otp}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      })

      console.log("✅ Direct SMS sent successfully:", message.sid)

      // Store OTP for verification
      otpStorage.set(formattedPhone, {
        code: otp,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      })

      return {
        success: true,
        message: `Verification code sent to ${formattedPhone}`,
        method: "twilio-direct",
      }
    } catch (error: any) {
      console.error("❌ Direct SMS failed:", error.message)

      // Fall through to mock method
    }
  }

  // Mock SMS for development
  const otp = generateOTP()
  console.log(`🧪 Mock SMS - OTP for ${formattedPhone}: ${otp}`)

  // Store OTP for verification
  otpStorage.set(formattedPhone, {
    code: otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
  })

  return {
    success: true,
    message: `Mock SMS sent to ${formattedPhone} (check console for OTP)`,
    method: "mock",
    otp: otp, // Return OTP for development
  }
}

export async function verifyOTP(
  phone: string,
  code: string,
): Promise<{
  success: boolean
  message: string
}> {
  const formattedPhone = formatPhoneNumber(phone)

  // Try Twilio Verify Service first
  if (isConfigured && process.env.TWILIO_VERIFY_SERVICE_SID) {
    try {
      console.log(`🔍 Verifying OTP via Twilio Verify for: ${formattedPhone}`)

      const verificationCheck = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: formattedPhone,
          code: code,
        })

      console.log("✅ Twilio Verify result:", verificationCheck.status)

      if (verificationCheck.status === "approved") {
        return {
          success: true,
          message: "Phone number verified successfully",
        }
      } else {
        return {
          success: false,
          message: "Invalid or expired verification code",
        }
      }
    } catch (error: any) {
      console.error("❌ Twilio Verify check failed:", error.message)

      // Fall through to local verification
    }
  }

  // Local OTP verification (for direct SMS or mock)
  const storedData = otpStorage.get(formattedPhone)

  if (!storedData) {
    return {
      success: false,
      message: "No verification code found. Please request a new code.",
    }
  }

  if (Date.now() > storedData.expires) {
    otpStorage.delete(formattedPhone)
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    }
  }

  if (storedData.code !== code) {
    return {
      success: false,
      message: "Invalid verification code. Please try again.",
    }
  }

  // Clean up used OTP
  otpStorage.delete(formattedPhone)

  console.log("✅ OTP verified successfully for:", formattedPhone)

  return {
    success: true,
    message: "Phone number verified successfully",
  }
}

export async function testTwilioConnection(): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    console.log("❌ Twilio credentials not found")
    return false
  }

  try {
    const client = require("twilio")(accountSid, authToken)
    await client.api.accounts(accountSid).fetch()
    console.log("✅ Twilio connection successful")
    return true
  } catch (error) {
    console.error("❌ Twilio connection failed:", error)
    return false
  }
}
