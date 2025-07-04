import { type NextRequest, NextResponse } from "next/server"
import type { User } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)

    // Get user from database (simplified for demo)
    const user: User = {
      id: session.userId,
      phone: "+254712345678", // This would come from database
      name: "Demo User",
      county: "Nairobi",
      language: "en",
      level: 3,
      xp: 1250,
      tokens: 450,
      streak: 5,
      achievements: ["first_lesson", "week_streak"],
      completedLessons: ["intro_to_constitution", "voting_rights"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
