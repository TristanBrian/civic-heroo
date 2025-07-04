import { type NextRequest, NextResponse } from "next/server"

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC6f94c4c8c4c4c4c4c4c4c4c4c4c4c4c4"
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your_auth_token_here"
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+1234567890"

export async function GET() {
  try {
    console.log("🔧 Testing Twilio Configuration...")
    console.log("Account SID:", TWILIO_ACCOUNT_SID?.substring(0, 10) + "...")
    console.log("Auth Token:", TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Not set")
    console.log("Phone Number:", TWILIO_PHONE_NUMBER)

    // Test Twilio API connection
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}.json`

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      },
    })

    if (response.ok) {
      const account = await response.json()
      return NextResponse.json({
        success: true,
        message: "Twilio connection successful",
        account: {
          sid: account.sid,
          friendlyName: account.friendly_name,
          status: account.status,
        },
      })
    } else {
      const error = await response.text()
      return NextResponse.json(
        {
          success: false,
          error: "Twilio connection failed",
          details: error,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("❌ Twilio test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test Twilio connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ success: false, error: "Phone number and message are required" }, { status: 400 })
    }

    console.log(`📱 Sending test SMS to: ${to}`)
    console.log(`💬 Message: ${message}`)

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
      console.log("✅ Test SMS sent successfully:", result.sid)
      return NextResponse.json({
        success: true,
        message: "Test SMS sent successfully",
        messageSid: result.sid,
      })
    } else {
      const error = await response.text()
      console.error("❌ Test SMS failed:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test SMS",
          details: error,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("❌ Test SMS error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test SMS",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
