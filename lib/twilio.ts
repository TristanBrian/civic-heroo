import twilio from "twilio"

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

if (!accountSid || !authToken || !serviceSid) {
  console.warn("Twilio credentials not configured. SMS functionality will be limited.")
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  if (!client || !serviceSid) {
    console.log("Twilio not configured, using mock OTP")
    return { success: true }
  }

  try {
    await client.verify.v2.services(serviceSid).verifications.create({
      to: phoneNumber,
      channel: "sms",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Twilio OTP send error:", error)
    return {
      success: false,
      error: error.message || "Failed to send OTP",
    }
  }
}

export async function verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
  if (!client || !serviceSid) {
    console.log("Twilio not configured, using mock verification")
    // Mock verification - accept any 6-digit code
    if (code.length === 6 && /^\d+$/.test(code)) {
      return { success: true }
    }
    return { success: false, error: "Invalid OTP format" }
  }

  try {
    const verification = await client.verify.v2.services(serviceSid).verificationChecks.create({
      to: phoneNumber,
      code: code,
    })

    if (verification.status === "approved") {
      return { success: true }
    } else {
      return { success: false, error: "Invalid OTP" }
    }
  } catch (error: any) {
    console.error("Twilio OTP verify error:", error)
    return {
      success: false,
      error: error.message || "Failed to verify OTP",
    }
  }
}
