"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Users,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Loader2,
  RefreshCw,
  Award,
  Coins,
} from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"

interface Task {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  timeEstimate: string
  location?: {
    lat: number
    lng: number
    address: string
  }
  requirements: string[]
  completed: boolean
}

interface UserLocation {
  lat: number
  lng: number
  address: string
  county: string
}

export default function TasksPage() {
  const { user, updateUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Sample tasks data
  const sampleTasks: Task[] = [
    {
      id: "1",
      title: "Report a Pothole",
      description: "Help improve road infrastructure by reporting potholes in your area to the county government.",
      category: "Infrastructure",
      difficulty: "easy",
      points: 25,
      timeEstimate: "10 minutes",
      requirements: ["Take a photo", "Provide location", "Submit report"],
      completed: false,
    },
    {
      id: "2",
      title: "Attend County Assembly Meeting",
      description: "Participate in local governance by attending a public county assembly meeting.",
      category: "Governance",
      difficulty: "medium",
      points: 50,
      timeEstimate: "2 hours",
      requirements: ["Check meeting schedule", "Attend meeting", "Submit feedback"],
      completed: false,
    },
    {
      id: "3",
      title: "Community Clean-up Drive",
      description: "Organize or participate in a community clean-up activity in your neighborhood.",
      category: "Environment",
      difficulty: "medium",
      points: 40,
      timeEstimate: "3 hours",
      requirements: ["Gather volunteers", "Organize supplies", "Document impact"],
      completed: false,
    },
    {
      id: "4",
      title: "Voter Registration Drive",
      description: "Help fellow citizens register to vote by organizing a voter registration drive.",
      category: "Democracy",
      difficulty: "hard",
      points: 75,
      timeEstimate: "1 day",
      requirements: ["Get IEBC approval", "Organize venue", "Register 10+ people"],
      completed: false,
    },
    {
      id: "5",
      title: "School Visit & Civic Education",
      description: "Visit a local school to teach students about their civic rights and responsibilities.",
      category: "Education",
      difficulty: "hard",
      points: 60,
      timeEstimate: "4 hours",
      requirements: ["Contact school", "Prepare materials", "Conduct session"],
      completed: false,
    },
  ]

  // Initialize tasks and user data
  useEffect(() => {
    setTasks(sampleTasks)
    if (user && "completedTasks" in user && Array.isArray(user.completedTasks)) {
      setCompletedTasks(user.completedTasks)
    }
  }, [user])

  // Request user location with proper error handling
  const requestLocation = async () => {
    setLocationLoading(true)
    setLocationError("")

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      // Check permissions first
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({ name: "geolocation" })

        if (permission.state === "denied") {
          setLocationError("Location access denied. Please enable location in your browser settings.")
          setLocationLoading(false)
          return
        }
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocoding to get address (mock implementation)
      const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      const mockCounty = user?.county || "Nairobi"

      const location: UserLocation = {
        lat: latitude,
        lng: longitude,
        address: mockAddress,
        county: mockCounty,
      }

      setUserLocation(location)
      toast.success("Location updated successfully!")
    } catch (error: any) {
      console.error("Error getting location:", error)

      let errorMessage = "Unable to get your location. "

      if (error.code === 1) {
        errorMessage += "Location access denied. Please enable location in your browser settings."
      } else if (error.code === 2) {
        errorMessage += "Location unavailable. Please check your GPS settings."
      } else if (error.code === 3) {
        errorMessage += "Location request timed out. Please try again."
      } else {
        errorMessage += error.message || "Please try again or use manual location."
      }

      setLocationError(errorMessage)

      // Fallback to user's county center (mock coordinates)
      const fallbackLocation: UserLocation = {
        lat: -1.2921, // Nairobi coordinates as fallback
        lng: 36.8219,
        address: `${user?.county || "Nairobi"} County Center`,
        county: user?.county || "Nairobi",
      }

      setUserLocation(fallbackLocation)
      toast.info("Using default location based on your county")
    } finally {
      setLocationLoading(false)
    }
  }

  // Auto-request location on component mount
  useEffect(() => {
    if (!userLocation) {
      requestLocation()
    }
  }, [])

  // Complete a task
  const completeTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || completedTasks.includes(taskId)) return

    try {
      const newCompletedTasks = [...completedTasks, taskId]
      const newTokens = (user?.tokens || 0) + task.points
      const newXP = (user?.xp || 0) + task.points
      const newAchievements = [...(user?.achievements || [])]

      // Add achievements based on task completion
      if (newCompletedTasks.length === 1) {
        newAchievements.push("first_task_complete")
      }
      if (newCompletedTasks.length === 5) {
        newAchievements.push("task_champion")
      }

      // Update user data
      updateUser({
        ...(user || {}),
        completedTasks: newCompletedTasks,
        tokens: newTokens,
        xp: newXP,
        achievements: newAchievements,
      } as any)

      setCompletedTasks(newCompletedTasks)
      toast.success(`Task completed! +${task.points} tokens earned!`)
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("Failed to complete task. Please try again.")
    }
  }

  // Filter tasks by category
  const filteredTasks =
    selectedCategory === "all"
      ? tasks
      : tasks.filter((task) => task.category.toLowerCase() === selectedCategory.toLowerCase())

  const categories = ["all", "Infrastructure", "Governance", "Environment", "Democracy", "Education"]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Tasks</h1>
          <p className="text-gray-600">Make a difference in your community</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {completedTasks.length}/{tasks.length}
          </div>
          <div className="text-sm text-gray-500">Tasks Completed</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Task Completion</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{user?.tokens || 0}</div>
                <div className="text-sm text-gray-600">Total Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{tasks.length - completedTasks.length}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting your location...
            </div>
          ) : locationError ? (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <p>{locationError}</p>
                  <Button size="sm" variant="outline" onClick={requestLocation} className="bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : userLocation ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium">{userLocation.county} County</div>
                  <div className="text-sm text-gray-600">{userLocation.address}</div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={requestLocation} className="bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Button onClick={requestLocation} className="bg-blue-600 hover:bg-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location
              </Button>
              <p className="text-sm text-gray-500 mt-2">Enable location to see nearby tasks and opportunities</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap bg-transparent"
          >
            {category === "all" ? "All Tasks" : category}
          </Button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id)

          return (
          <Card key={task.id} className={`relative ${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle
                  className="text-lg cursor-pointer hover:underline"
                  onClick={() => setSelectedTask(task)}
                >
                  {task.title}
                </CardTitle>
                {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{task.category}</Badge>
                <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty}</Badge>
              </div>
            </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription>{task.description}</CardDescription>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {task.timeEstimate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {task.points} tokens
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {task.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => completeTask(task.id)}
                  disabled={isCompleted}
                  className={`w-full ${
                    isCompleted ? "bg-green-600 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Start Task
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}

      <Dialog open={selectedTask !== null} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>{selectedTask?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p><strong>Category:</strong> {selectedTask?.category}</p>
            <p><strong>Difficulty:</strong> {selectedTask?.difficulty}</p>
            <p><strong>Points:</strong> {selectedTask?.points}</p>
            <p><strong>Time Estimate:</strong> {selectedTask?.timeEstimate}</p>
            <p><strong>Requirements:</strong></p>
            <ul className="list-disc list-inside">
              {selectedTask?.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
