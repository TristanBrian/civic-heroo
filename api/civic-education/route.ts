import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface CivicEducationRequest {
  topic: string
  language?: "en" | "sw" | "both"
  difficulty?: "beginner" | "intermediate" | "advanced"
  format?: "lesson" | "quiz" | "summary"
}

export async function POST(request: NextRequest) {
  try {
    const body: CivicEducationRequest = await request.json()
    const { topic, language = "both", difficulty = "beginner", format = "lesson" } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const results: any = {}

    // Generate English content
    if (language === "en" || language === "both") {
      const englishPrompt = `Create a ${format} about "${topic}" for ${difficulty} level civic education in Kenya. 
      Focus on practical, actionable information that helps citizens understand their rights, responsibilities, and how government works.
      Keep it engaging and relevant to Kenyan context.`

      const { text: englishContent } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: englishPrompt,
        system:
          "You are a civic education expert specializing in Kenyan governance and citizen engagement. Provide clear, accurate, and practical information.",
      })

      results.en = englishContent
    }

    // Generate Swahili content
    if (language === "sw" || language === "both") {
      const swahiliPrompt = `Unda ${format} kuhusu "${topic}" kwa kiwango cha ${difficulty} katika elimu ya uraia nchini Kenya.
      Zingatia maelezo ya vitendo ambayo yanasaidia raia kuelewa haki zao, majukumu, na jinsi serikali inavyofanya kazi.
      Ifanye iwe ya kuvutia na muhimu kwa mazingira ya Kenya.`

      // For Swahili, we'll use a specialized approach
      const { text: swahiliContent } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: swahiliPrompt,
        system:
          "Wewe ni mtaalamu wa elimu ya uraia unayejua vizuri utawala wa Kenya na ushiriki wa raia. Toa maelezo wazi, sahihi, na ya vitendo kwa lugha ya Kiswahili sanifu.",
      })

      results.sw = swahiliContent
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Civic education generation error:", error)
    return NextResponse.json({ error: "Failed to generate civic education content" }, { status: 500 })
  }
}

// GET endpoint for predefined topics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const topics = {
    governance: [
      "County Government Functions",
      "National Assembly Role",
      "Senate Responsibilities",
      "Judicial System",
      "Electoral Process",
    ],
    environment: [
      "Water Conservation",
      "Waste Management",
      "Climate Change Adaptation",
      "Forest Conservation",
      "Pollution Control",
    ],
    rights: ["Bill of Rights", "Gender Equality", "Children Rights", "Disability Rights", "Access to Information"],
    participation: [
      "Public Participation",
      "Citizen Oversight",
      "Community Development",
      "Civic Engagement",
      "Accountability Mechanisms",
    ],
  }

  if (category && topics[category as keyof typeof topics]) {
    return NextResponse.json({ topics: topics[category as keyof typeof topics] })
  }

  return NextResponse.json({ topics: Object.values(topics).flat() })
}
