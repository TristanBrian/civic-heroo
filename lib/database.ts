import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.warn("Database connection not available:", error)
}

export { sql }

// User Management
export async function createUser(userData: {
  phone: string
  name?: string
  county?: string
  language?: "en" | "sw"
}) {
  if (!sql) {
    return { data: null, error: "Database not available" }
  }

  try {
    const result = await sql`
      INSERT INTO users (phone, name, county, language, tokens, xp, level, streak, role, status, achievements, completed_lessons, completed_tasks)
      VALUES (
        ${userData.phone}, 
        ${userData.name || "Civic Hero"}, 
        ${userData.county || ""}, 
        ${userData.language || "en"}, 
        100, 0, 1, 0, 'user', 'active',
        ARRAY['first_login']::text[],
        ARRAY[]::text[],
        ARRAY[]::text[]
      )
      RETURNING *
    `
    return { data: result[0], error: null }
  } catch (error) {
    console.error("Error creating user:", error)
    return { data: null, error }
  }
}

export async function getUserByPhone(phone: string) {
  if (!sql) {
    return { data: null, error: "Database not available" }
  }

  try {
    const result = await sql`
      SELECT * FROM users WHERE phone = ${phone} LIMIT 1
    `
    return { data: result[0] || null, error: null }
  } catch (error) {
    console.error("Error getting user by phone:", error)
    return { data: null, error }
  }
}

export async function updateUser(
  id: string,
  updates: Partial<{
    name: string
    county: string
    language: "en" | "sw"
    tokens: number
    xp: number
    level: number
    streak: number
    achievements: string[]
    completed_lessons: string[]
    completed_tasks: string[]
  }>,
) {
  if (!sql) {
    return { data: null, error: "Database not available" }
  }

  try {
    const updateFields = []
    const values = []

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          updateFields.push(`${key} = $${values.length + 1}`)
          values.push(value)
        } else {
          updateFields.push(`${key} = $${values.length + 1}`)
          values.push(value)
        }
      }
    })

    if (updateFields.length === 0) {
      return { data: null, error: "No fields to update" }
    }

    const query = `
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
    `

    const result = await sql(query, [...values, id])
    return { data: result[0], error: null }
  } catch (error) {
    console.error("Error updating user:", error)
    return { data: null, error }
  }
}

// Lessons Management
export async function getLessons(language: "en" | "sw" = "en") {
  if (!sql) {
    // Return mock data if database not available
    return {
      data: [
        {
          id: "lesson_1",
          title: language === "en" ? "Introduction to Kenyan Constitution" : "Utangulizi wa Katiba ya Kenya",
          description:
            language === "en" ? "Learn the basics of Kenya's constitution" : "Jifunze misingi ya katiba ya Kenya",
          difficulty: 1,
          xp_reward: 50,
          token_reward: 25,
          category: "constitution",
          estimated_time: 15,
        },
        {
          id: "lesson_2",
          title: language === "en" ? "Your Rights as a Citizen" : "Haki Zako kama Raia",
          description: language === "en" ? "Understanding your fundamental rights" : "Kuelewa haki zako za kimsingi",
          difficulty: 1,
          xp_reward: 50,
          token_reward: 25,
          category: "rights",
          estimated_time: 20,
        },
      ],
      error: null,
    }
  }

  try {
    const result = await sql`
      SELECT * FROM lessons 
      ORDER BY difficulty ASC, created_at ASC
    `
    return { data: result, error: null }
  } catch (error) {
    console.error("Error getting lessons:", error)
    return { data: [], error }
  }
}

// Tasks Management
export async function getTasks(county?: string) {
  if (!sql) {
    // Return mock data if database not available
    return {
      data: [
        {
          id: "task_1",
          title: "Community Survey",
          description: "Help gather community feedback on local services",
          type: "survey",
          location: county || "Nairobi",
          xp_reward: 100,
          token_reward: 50,
          participants: 5,
          max_participants: 20,
          status: "active",
        },
      ],
      error: null,
    }
  }

  try {
    let query = sql`SELECT * FROM tasks WHERE status = 'active'`

    if (county) {
      query = sql`SELECT * FROM tasks WHERE status = 'active' AND (location = ${county} OR location IS NULL)`
    }

    const result = await query
    return { data: result, error: null }
  } catch (error) {
    console.error("Error getting tasks:", error)
    return { data: [], error }
  }
}

// Test database connection
export async function testConnection() {
  if (!sql) {
    console.log("Database not configured - using mock data")
    return false
  }

  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0])
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
