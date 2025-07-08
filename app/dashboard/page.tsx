"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Users,
  Award,
  MapPin,
  Clock,
  TrendingUp,
  Target,
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  Trophy,
  Calendar,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please log in to continue</h1>
          <Button asChild>
            <Link href="/">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Safe access to user properties with defaults
  const achievements = Array.isArray(user.achievements) ? user.achievements : []
  const completedLessons = Array.isArray(user.completedLessons) ? user.completedLessons : []
  const completedTasks = Array.isArray(user.completedTasks) ? user.completedTasks : []

  const progressToNextLevel = (user.xp || 0) % 100 // Assuming 100 XP per level
  const totalLessons = 50 // Total available lessons
  const totalTasks = 25 // Total available tasks

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-screen-2xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name || "CivicHero"}! 👋</h1>
              <p className="text-gray-600">Ready to continue your civic journey?</p>
            </div>
          </div>

          {!user.onboarded && (
            <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50">
              <Bell className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Complete your profile setup to unlock all features and get personalized content.
                <Button asChild variant="link" className="p-0 ml-2 text-blue-600">
                  <Link href="/onboarding">Complete Setup →</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{user.tokens || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Civic Tokens</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{user.xp || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Experience Points</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{user.level || 1}</span>
              </div>
              <p className="text-sm text-gray-600">Level</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{user.streak || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription>Your civic education journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Lessons Completed</span>
                  <span>
                    {completedLessons.length}/{totalLessons}
                  </span>
                </div>
                <Progress value={(completedLessons.length / totalLessons) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Level Progress</span>
                  <span>{progressToNextLevel}%</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>

              <Button asChild className="w-full">
                <Link href="/dashboard/learn">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community Engagement</span>
              </CardTitle>
              <CardDescription>Your civic participation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tasks Completed</span>
                  <span>
                    {completedTasks.length}/{totalTasks}
                  </span>
                </div>
                <Progress value={(completedTasks.length / totalTasks) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>County: {user.county || "Not set"}</span>
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  Local
                </Badge>
              </div>

              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/dashboard/tasks">
                  <Users className="w-4 h-4 mr-2" />
                  View Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Your civic milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.slice(0, 4).map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm font-medium capitalize">{achievement.replace(/_/g, " ")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Complete lessons and tasks to earn achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Today's Lesson</span>
              </CardTitle>
              <CardDescription>Continue your civic education</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Learn about "Understanding Your Constitutional Rights" - 15 min read
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard/learn">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span>Community Task</span>
              </CardTitle>
              <CardDescription>Make a difference locally</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                "Report a local issue" - Help improve your community by reporting problems
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard/tasks">
                  View Tasks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span>Leaderboard</span>
              </CardTitle>
              <CardDescription>See how you rank</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                You're ranked #47 in your county. Keep learning to climb higher!
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard/leaderboard">
                  View Rankings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest civic actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Joined CivicHero</p>
                  <p className="text-xs text-gray-500">Welcome to the community!</p>
                </div>
                <Badge variant="secondary">+50 XP</Badge>
              </div>

              {completedLessons.length > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed lessons</p>
                    <p className="text-xs text-gray-500">{completedLessons.length} lessons finished</p>
                  </div>
                  <Badge variant="secondary">+{completedLessons.length * 10} XP</Badge>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed community tasks</p>
                    <p className="text-xs text-gray-500">{completedTasks.length} tasks finished</p>
                  </div>
                  <Badge variant="secondary">+{completedTasks.length * 25} XP</Badge>
                </div>
              )}

              {completedLessons.length === 0 && completedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Start learning or complete tasks to see your activity here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
