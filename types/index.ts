export interface User {
  id: string
  phone: string
  name: string
  county: string | null
  language: "en" | "sw"
  level: number
  xp: number
  tokens: number
  streak: number
  achievements: string[]
  completedLessons: string[]
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  title: string
  titleSw: string
  description: string
  descriptionSw: string
  content: string
  contentSw: string
  difficulty: number
  xpReward: number
  tokenReward: number
  prerequisites: string[]
  category: string
  estimatedTime: number
  completionRate: number
  popularity: number
  isLocked: boolean
}

export interface Achievement {
  id: string
  title: string
  titleSw: string
  description: string
  descriptionSw: string
  icon: string
  xpReward: number
  tokenReward: number
  unlockedAt?: string
}

export interface Task {
  id: string
  title: string
  titleSw: string
  description: string
  descriptionSw: string
  type: "survey" | "petition" | "meeting" | "volunteer"
  location?: string
  date?: string
  xpReward: number
  tokenReward: number
  participants: number
  maxParticipants?: number
  status: "active" | "completed" | "cancelled"
}

export interface EmergencyContact {
  id: string
  name: string
  nameSw: string
  phone: string
  category: "police" | "medical" | "fire" | "government" | "legal"
  county: string
  available24h: boolean
}

export interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning" | "achievement" | "token"
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}
