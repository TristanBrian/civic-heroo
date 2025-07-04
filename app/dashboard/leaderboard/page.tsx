"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, Users, Calendar, Zap } from "lucide-react"

interface LeaderboardUser {
  id: string
  phone: string
  county: string
  tokens: number
  lessons_completed: number
  tasks_completed: number
  streak_days: number
  rank: number
}

interface TeamStats {
  county: string
  total_users: number
  total_tokens: number
  avg_engagement: number
  rank: number
}

// Mock data for live leaderboard
const mockUsers: LeaderboardUser[] = [
  {
    id: "1",
    phone: "+254712345678",
    county: "Nairobi",
    tokens: 2850,
    lessons_completed: 15,
    tasks_completed: 12,
    streak_days: 14,
    rank: 1,
  },
  {
    id: "2",
    phone: "+254723456789",
    county: "Mombasa",
    tokens: 2650,
    lessons_completed: 13,
    tasks_completed: 11,
    streak_days: 12,
    rank: 2,
  },
  {
    id: "3",
    phone: "+254734567890",
    county: "Kisumu",
    tokens: 2400,
    lessons_completed: 12,
    tasks_completed: 10,
    streak_days: 10,
    rank: 3,
  },
  {
    id: "4",
    phone: "+254745678901",
    county: "Nakuru",
    tokens: 2200,
    lessons_completed: 11,
    tasks_completed: 9,
    streak_days: 8,
    rank: 4,
  },
  {
    id: "5",
    phone: "+254756789012",
    county: "Eldoret",
    tokens: 2100,
    lessons_completed: 10,
    tasks_completed: 8,
    streak_days: 7,
    rank: 5,
  },
  {
    id: "6",
    phone: "+254767890123",
    county: "Nairobi",
    tokens: 1950,
    lessons_completed: 9,
    tasks_completed: 7,
    streak_days: 6,
    rank: 6,
  },
  {
    id: "7",
    phone: "+254778901234",
    county: "Mombasa",
    tokens: 1800,
    lessons_completed: 8,
    tasks_completed: 6,
    streak_days: 5,
    rank: 7,
  },
  {
    id: "8",
    phone: "+254789012345",
    county: "Kisumu",
    tokens: 1650,
    lessons_completed: 7,
    tasks_completed: 5,
    streak_days: 4,
    rank: 8,
  },
]

const mockTeamStats: TeamStats[] = [
  { county: "Nairobi", total_users: 1250, total_tokens: 125000, avg_engagement: 85, rank: 1 },
  { county: "Mombasa", total_users: 890, total_tokens: 89000, avg_engagement: 78, rank: 2 },
  { county: "Kisumu", total_users: 650, total_tokens: 65000, avg_engagement: 72, rank: 3 },
  { county: "Nakuru", total_users: 580, total_tokens: 58000, avg_engagement: 68, rank: 4 },
  { county: "Eldoret", total_users: 420, total_tokens: 42000, avg_engagement: 65, rank: 5 },
]

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>(mockUsers)
  const [teamStats, setTeamStats] = useState<TeamStats[]>(mockTeamStats)
  const [currentUser] = useState(mockUsers[5]) // Simulate current user
  const [liveUpdate, setLiveUpdate] = useState(false)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdate(true)

      // Simulate small token changes
      setUsers((prev) =>
        prev
          .map((user) => ({
            ...user,
            tokens: user.tokens + Math.floor(Math.random() * 10) - 5,
          }))
          .sort((a, b) => b.tokens - a.tokens)
          .map((user, index) => ({
            ...user,
            rank: index + 1,
          })),
      )

      setTimeout(() => setLiveUpdate(false), 1000)
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800"
    if (rank === 2) return "bg-gray-100 text-gray-800"
    if (rank === 3) return "bg-amber-100 text-amber-800"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among civic heroes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={liveUpdate ? "default" : "secondary"} className={liveUpdate ? "animate-pulse" : ""}>
            {liveUpdate ? "🔴 Live" : "📊 Updated"}
          </Badge>
        </div>
      </div>

      {/* Current User Stats */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Current Rank</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">#{currentUser.rank}</span>
                <div>
                  <p className="font-medium">{currentUser.tokens} tokens</p>
                  <p className="text-sm opacity-90">{currentUser.county} County</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">{currentUser.streak_days} day streak</span>
              </div>
              <div className="text-sm opacity-90">
                {currentUser.lessons_completed} lessons • {currentUser.tasks_completed} tasks
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">Individual Rankings</TabsTrigger>
          <TabsTrigger value="teams">County Teams</TabsTrigger>
          <TabsTrigger value="achievements">Top Achievers</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Civic Heroes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      user.id === currentUser.id ? "bg-blue-50 border-2 border-blue-200" : "bg-muted/50 hover:bg-muted"
                    } ${liveUpdate ? "animate-pulse" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(user.rank)}</div>

                      <Avatar>
                        <AvatarFallback>{user.phone.slice(-2)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">
                          {user.phone}
                          {user.id === currentUser.id && <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.county} County</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getRankBadge(user.rank)}>#{user.rank}</Badge>
                        <span className="font-bold">{user.tokens.toLocaleString()} tokens</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.lessons_completed}L • {user.tasks_completed}T • {user.streak_days}🔥
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                County Team Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamStats.map((team) => (
                  <div key={team.county} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRankIcon(team.rank)}
                        <div>
                          <h3 className="font-bold">{team.county} County</h3>
                          <p className="text-sm text-muted-foreground">
                            {team.total_users.toLocaleString()} active users
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{team.total_tokens.toLocaleString()} tokens</p>
                        <p className="text-sm text-muted-foreground">{team.avg_engagement}% engagement</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Team Engagement</span>
                        <span>{team.avg_engagement}%</span>
                      </div>
                      <Progress value={team.avg_engagement} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Trophy className="h-5 w-5" />
                  Most Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg">78</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{users[0].phone}</p>
                  <p className="text-sm text-muted-foreground">{users[0].county}</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">{users[0].tokens.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Award className="h-5 w-5" />
                  Most Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg">78</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{users[0].phone}</p>
                  <p className="text-sm text-muted-foreground">{users[0].county}</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{users[0].lessons_completed}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Zap className="h-5 w-5" />
                  Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg">78</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{users[0].phone}</p>
                  <p className="text-sm text-muted-foreground">{users[0].county}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{users[0].streak_days} days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">🏆 Civic Education Week</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete 5 lessons this week to earn bonus tokens and a special badge!
                  </p>
                  <div className="flex justify-center gap-8 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">156</p>
                      <p className="text-muted-foreground">Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-600">3</p>
                      <p className="text-muted-foreground">Days Left</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">500</p>
                      <p className="text-muted-foreground">Bonus Tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
