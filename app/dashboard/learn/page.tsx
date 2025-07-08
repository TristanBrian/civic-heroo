"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BookOpen, Play, Lock, Star, Clock, Users, TrendingUp, Search, Award, Flame, Volume2 } from "lucide-react"
import { TextToSpeech } from "@/components/audio/text-to-speech"
import { useNotifications } from "@/components/ui/notification-system"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/lib/i18n"

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  swContent?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  duration: number // minutes
  xpReward: number
  category: string
  prerequisites: string[]
  isCompleted: boolean
  isLocked: boolean
  popularity: number // 0-100
  completionRate: number // 0-100
  language: "en" | "sw" | "both"
  tags: string[]
  featured: boolean
}

  // Mock lesson data with gamification
const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Understanding the Kenyan Constitution",
    description: "Learn about the fundamental principles and structure of Kenya's Constitution",
    content:
      `Core Focus: Foundational principles & structure of Kenya’s 2010 Constitution.
Key Concepts:
- Supremacy of the Constitution (Art. 2): Overrides all other laws.
- Sovereignty of the People (Art. 1): Power vested in citizens via democracy.

Structure:
- Preamble: National values & aspirations.
- 18 Chapters: Covering sovereignty, rights, governance, judiciary, devolution, etc.
- Schedules: Addendum details (e.g., county boundaries).

National Values & Principles (Art. 10):
Inclusivity, rule of law, human dignity, equity, public participation.

Separation of Powers:
Executive (President/Cabinet), Legislature (Parliament), Judiciary (Courts).

Amendment Process (Art. 255-257): Rigid; requires popular referendum for key changes.`,
    swContent:
      `Msingi: Kanuni za msingi na muundo wa Katiba ya Kenya ya 2010.
Mada Muhimu:
- Utawala wa Katiba (Sura ya 2): Inatawala sheria zote.
- Uraia wa Watu (Sura ya 1): Nguvu iko mikononi mwa wananchi kupitia demokrasia.

Muundo:
- Utangulizi: Thamani za kitaifa na matarajio.
- Sura 18: Zinahusu uraia, haki, utawala, mahakama, ugatuzi, n.k.
- Ratiba: Maelezo ya ziada (mfano, mipaka ya kaunti).

Thamani na Kanuni za Kitaifa (Sura ya 10):
Ujumuishaji, utawala wa sheria, heshima ya binadamu, usawa, ushiriki wa umma.

Mgawanyiko wa Madaraka:
Mtendaji (Rais/Bodi), Bunge (Bunge), Mahakama (Mahakama).

Mchakato wa Marekebisho (Sura ya 255-257): Magumu; yanahitaji kura ya maoni ya umma.`,
    difficulty: 2,
    duration: 15,
    xpReward: 100,
    category: "Constitutional Law",
    prerequisites: [],
    isCompleted: false,
    isLocked: false,
    popularity: 95,
    completionRate: 87,
    language: "both",
    tags: ["constitution", "law", "governance"],
    featured: true,
  },
  {
    id: "2",
    title: "Your Rights as a Kenyan Citizen",
    description: "Discover your fundamental rights and freedoms under the Constitution",
    content:
      `Core Focus: Fundamental rights under the Bill of Rights (Chapter 4).
Key Rights & Enforcement:
- Civil & Political Rights:
  Life & dignity (Art. 26-29), equality (Art. 27), expression (Art. 33), assembly (Art. 36).
- Socio-Economic Rights:
  Health, housing, food, education (Art. 43), fair labor practices (Art. 41).
- Limitations: Rights may be restricted only if reasonable, justifiable, and democratic (Art. 24).

Enforcement Mechanisms:
- Petition the High Court (Art. 23).
- Independent Commissions (e.g., KNCHR).

Duties of Citizens (Art. 24): Exercise rights responsibly.`,
    difficulty: 1,
    duration: 12,
    xpReward: 75,
    category: "Civil Rights",
    prerequisites: [],
    isCompleted: true,
    isLocked: false,
    popularity: 92,
    completionRate: 94,
    language: "both",
    tags: ["rights", "citizenship", "freedom"],
    featured: true,
  },
  {
    id: "3",
    title: "How County Governments Work",
    description: "Understanding devolution and the role of county governments in Kenya",
    content:
      `Core Focus: Devolution under Chapter 11 of the Constitution.

Structure & Functions:
- 47 Counties: Geographical & administrative units.

County Governance Structure:
- County Assembly: Legislative arm (MCAs).
- County Executive: Governor, Deputy, CECs.

Functions (Schedule 4):
- Exclusive: Agriculture, county health, transport, trade licensing.
- Shared: Education (pre-primary), environment.

Revenue Sources:
- National equitable share (≥15% national revenue).
- Local taxes, fees, grants.

Accountability: Public participation, county audits, impeachment of governors.`,
    difficulty: 3,
    duration: 20,
    xpReward: 150,
    category: "Devolution",
    prerequisites: ["1"],
    isCompleted: false,
    isLocked: false,
    popularity: 78,
    completionRate: 72,
    language: "both",
    tags: ["devolution", "county", "governance"],
    featured: false,
  },
  {
    id: "4",
    title: "Electoral Process in Kenya",
    description: "Learn about elections, voting, and democratic participation",
    content:
      `Core Focus: Democratic participation (Chapter 7).
Key Components:
- Electoral Bodies:
  IEBC: Manages elections, boundaries, voter registration.

Voter Eligibility:
- 18+ years, Kenyan ID, registered voter.

Electoral Systems:
- President: 50% + 1 vote & 25% in ≥24 counties.
- Governors, MPs, MCAs: First-past-the-post.

Election Cycle: Every 5 years (Aug).

Dispute Resolution:
- Petitions filed in Supreme (Presidential) or High Court (other).

Integrity Measures:
- Biometric voter registration, results transmission via KIEMS.`,
    difficulty: 4,
    duration: 25,
    xpReward: 200,
    category: "Elections",
    prerequisites: ["1", "3"],
    isCompleted: false,
    isLocked: true,
    popularity: 85,
    completionRate: 68,
    language: "both",
    tags: ["elections", "democracy", "voting"],
    featured: false,
  },
  {
    id: "5",
    title: "Anti-Corruption Laws and Reporting",
    description: "Understanding corruption laws and how to report corruption cases",
    content:
      `Core Focus: Legal framework & civic action (Chapter 6).
Laws & Institutions:
- Key Legislation:
  *Bribery Act (2016), Public Officer Ethics Act, Anti-Corruption and Economic Crimes Act (ACECA).*

Institutions:
- EACC: Investigates, prosecutes (with DPP).
- ODPP: Prosecutes corruption cases.

Chapter 6 (Leadership & Integrity):
- Requirements: Honesty, tax compliance, public scrutiny.

Reporting Mechanisms:
- EACC Hotline: 1551 (toll-free).
- Online Portal: www.eacc.go.ke.

Whistleblower Protection: Protected under law (ACECA, Art. 64).

Citizen Role: Refuse bribes, report corruption, demand accountability`,
    difficulty: 3,
    duration: 18,
    xpReward: 125,
    category: "Anti-Corruption",
    prerequisites: ["1"],
    isCompleted: false,
    isLocked: false,
    popularity: 89,
    completionRate: 76,
    language: "both",
    tags: ["corruption", "reporting", "ethics"],
    featured: true,
  },
]

export default function LearnPage() {
  const { user } = useAuth()
  const { showAchievement } = useNotifications()
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [userStats, setUserStats] = useState({
    level: 5,
    xp: 1250,
    xpToNext: 500,
    streak: 7,
    completedLessons: 12,
    totalLessons: 45,
  })

  const [language, setLanguage] = useState<"en" | "sw">(user?.language || "en")
  const { t } = useTranslation(language)

  const [isReading, setIsReading] = useState(false)

  useEffect(() => {
    if (user?.language && user.language !== language) {
      setLanguage(user.language)
    }
  }, [user?.language])

  // Add language toggle handler
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "sw" : "en"))
  }

  // Update userStats based on user data (tokens, xp, completedLessons)
  useEffect(() => {
    if (user) {
      setUserStats((prev) => ({
        ...prev,
        xp: user.xp || prev.xp,
        completedLessons: "completedTasks" in user && Array.isArray(user.completedTasks)
          ? user.completedTasks.length
          : prev.completedLessons,
        totalLessons: prev.totalLessons, // Assuming totalLessons is static or can be updated elsewhere
        level: user.level || prev.level,
        streak: "streak" in user ? (user.streak as number) : prev.streak,
        // xpToNext can be calculated or kept as is
      }))
    }
  }, [user])

  // Filter lessons based on search, category, difficulty, and language
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || lesson.difficulty.toString() === selectedDifficulty
    const matchesLanguage = lesson.language === "both" || lesson.language === language

    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage
  })

  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.isLocked) {
      showAchievement("Lesson Locked", "Complete prerequisite lessons first")
      return
    }

    // Allow retrying completed lessons
    setSelectedLesson(lesson)

    showAchievement("Lesson Started", `Started: ${lesson.title}`)
  }

  const handleCompleteLesson = (lesson: Lesson) => {
    // Update lesson completion
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? { ...l, isCompleted: true } : l)))

    // Update user stats
    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + lesson.xpReward,
      completedLessons: prev.completedLessons + 1,
    }))

    // Show achievement notification
    showAchievement(lesson.title, "Lesson Completed!")

    setSelectedLesson(null)
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={cn("h-4 w-4", i < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
    ))
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-orange-100 text-orange-800"
      case 5:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedLesson) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedLesson(null)} className="mb-4">
            ← Back to Lessons
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold">{selectedLesson.title}</h1>
            <Badge className={getDifficultyColor(selectedLesson.difficulty)}>Level {selectedLesson.difficulty}</Badge>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {selectedLesson.duration} min
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              {selectedLesson.xpReward} XP
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {selectedLesson.completionRate}% completion rate
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Learning
              </CardTitle>
              <Badge variant="outline">
                {selectedLesson.language === "both" ? "EN/SW" : selectedLesson.language.toUpperCase()}
              </Badge>
            </div>
          <CardDescription>Listen to the lesson content in your preferred language</CardDescription>
        </CardHeader>
          <CardContent>
            <TextToSpeech
              key={selectedLesson.id + "-" + language + "-" + (isReading ? "reading" : "stopped")}
              text={language === "sw" && selectedLesson.swContent ? selectedLesson.swContent : selectedLesson.content}
              language={language}
              autoPlay={isReading}
            />
            <div className="mt-4">
              <Button onClick={() => setIsReading((prev) => !prev)} variant="outline" size="sm">
                {isReading ? "Stop Reading Lesson Content" : "Read Lesson Content"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {language === "sw" && selectedLesson.swContent ? selectedLesson.swContent : selectedLesson.content}
            </p>

            <div className="mt-8 pt-6 border-t">
              {selectedLesson.isCompleted ? (
                <Button
                  onClick={() => {
                    // Reset lesson completion for retry
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === selectedLesson.id ? { ...l, isCompleted: false } : l,
                      ),
                    )
                    setSelectedLesson(null)
                    showAchievement("Retry Lesson", `Retrying: ${selectedLesson.title}`)
                  }}
                  className="w-full"
                  size="lg"
                >
                  Retry Lesson
                </Button>
              ) : (
                <Button onClick={() => handleCompleteLesson(selectedLesson)} className="w-full" size="lg">
                  Complete Lesson (+{selectedLesson.xpReward} XP)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("learn")}</h1>
            <p className="text-gray-600">{t("learn")} about your rights, responsibilities, and how government works</p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={toggleLanguage} variant="outline" size="sm">
              {language === "en" ? "Switch to Swahili" : "Badilisha kwenda Kiingereza"}
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Level {userStats.level}</div>
              <div className="text-sm text-gray-500">Civic Hero</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="h-5 w-5" />
                <span className="text-2xl font-bold">{userStats.streak}</span>
              </div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress to Level {userStats.level + 1}</span>
            <span className="text-sm text-gray-500">
              {userStats.xp}/{userStats.xp + userStats.xpToNext} XP
            </span>
          </div>
          <Progress value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} className="h-2" />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category filter dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="Constitutional Law">Constitutional Law</option>
            <option value="Civil Rights">Civil Rights</option>
            <option value="Devolution">Devolution</option>
            <option value="Elections">Elections</option>
            <option value="Anti-Corruption">Anti-Corruption</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1 (Beginner)</option>
            <option value="2">Level 2 (Easy)</option>
            <option value="3">Level 3 (Medium)</option>
            <option value="4">Level 4 (Hard)</option>
            <option value="5">Level 5 (Expert)</option>
          </select>
        </div>
      </div>

      {/* Featured Lessons */}
      {filteredLessons.some((lesson) => lesson.featured) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Featured Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons
              .filter((lesson) => lesson.featured)
              .map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={handleStartLesson}
                  getDifficultyStars={getDifficultyStars}
                  getDifficultyColor={getDifficultyColor}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Lessons */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          All Lessons ({filteredLessons.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onStart={handleStartLesson}
              getDifficultyStars={getDifficultyStars}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

function LessonCard({
  lesson,
  onStart,
  getDifficultyStars,
  getDifficultyColor,
}: {
  lesson: Lesson
  onStart: (lesson: Lesson) => void
  getDifficultyStars: (difficulty: number) => React.ReactNode
  getDifficultyColor: (difficulty: number) => string
}) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        lesson.isCompleted && "bg-green-50 border-green-200",
        lesson.isLocked && "opacity-60",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              {lesson.isCompleted && <Award className="h-5 w-5 text-green-600" />}
              {lesson.isLocked && <Lock className="h-5 w-5 text-gray-400" />}
              {lesson.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {getDifficultyStars(lesson.difficulty)}
              <Badge className={getDifficultyColor(lesson.difficulty)} variant="secondary">
                Level {lesson.difficulty}
              </Badge>
            </div>
          </div>
          {lesson.featured && (
            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
              Featured
            </Badge>
          )}
        </div>

        <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lesson.duration}m
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              {lesson.xpReward} XP
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {lesson.completionRate}%
          </div>
        </div>

        <Button
          onClick={() => onStart(lesson)}
          disabled={lesson.isLocked}
          className="w-full"
          variant={lesson.isCompleted ? "outline" : "default"}
        >
          {lesson.isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          ) : lesson.isCompleted ? (
            <>
              <Award className="h-4 w-4 mr-2" />
              Review
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Lesson
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
