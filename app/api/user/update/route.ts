import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { updateUser } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("civichero-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No authentication token" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret-key-change-in-production") as any

    const { county, language } = await request.json()

    // Update user profile
    const { data: updatedUser, error } = await updateUser(decoded.userId, {
      county,
      language,
    })

    if (error || !updatedUser) {
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        county: updatedUser.county,
        language: updatedUser.language,
        tokens: updatedUser.tokens,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
