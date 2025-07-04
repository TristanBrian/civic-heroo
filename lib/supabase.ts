import { createClient } from "@supabase/supabase-js"

// Make Supabase optional - use mock data if not configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create client only if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Real-time subscription helpers with fallback
export function subscribeToUserTokens(userId: string, callback: (tokens: number) => void) {
  if (!supabase) {
    console.log("Supabase not configured, using mock data")
    return { unsubscribe: () => {} }
  }

  return supabase
    .channel("user-tokens")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new.tokens)
      },
    )
    .subscribe()
}

export function subscribeToTasks(callback: (tasks: any[]) => void) {
  if (!supabase) {
    console.log("Supabase not configured, using mock data")
    return { unsubscribe: () => {} }
  }

  return supabase
    .channel("tasks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
      },
      () => {
        fetchTasks().then(callback)
      },
    )
    .subscribe()
}

export async function fetchTasks() {
  if (!supabase) {
    // Return mock tasks
    return [
      {
        id: 1,
        title: "Learn About County Government",
        description: "Complete the county government basics lesson",
        type: "education",
        status: "active",
        reward_tokens: 50,
        location: { lat: -1.2921, lng: 36.8219 },
      },
      {
        id: 2,
        title: "Attend Community Meeting",
        description: "Participate in your local community meeting",
        type: "participation",
        status: "active",
        reward_tokens: 100,
        location: { lat: -1.2921, lng: 36.8219 },
      },
    ]
  }

  const { data, error } = await supabase.from("tasks").select("*").eq("status", "active")
  if (error) throw error
  return data
}

export async function fetchUserProfile(userId: string) {
  if (!supabase) {
    // Return mock user profile
    return {
      id: userId,
      phone: "+254712345678",
      name: "Civic Hero",
      tokens: 250,
      xp: 1250,
      level: 5,
      streak: 7,
      language: "en",
      achievements: ["first_login", "lesson_complete", "week_streak"],
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
  if (error) throw error
  return data
}

export async function updateUserLanguage(userId: string, language: "en" | "sw") {
  if (!supabase) {
    console.log(`Mock: Updated user ${userId} language to ${language}`)
    return
  }

  const { error } = await supabase.from("users").update({ language }).eq("id", userId)
  if (error) throw error
}
