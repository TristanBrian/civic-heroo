"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Droplets,
  Flame,
  Shield,
  Heart,
  Camera,
  Send,
  CheckCircle,
} from "lucide-react"

interface EmergencyReport {
  id: string
  type: string
  description: string
  location: { lat: number; lng: number }
  status: "reported" | "acknowledged" | "resolved"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
}

const emergencyTypes = [
  {
    id: "medical",
    name: "Medical Emergency",
    icon: Heart,
    color: "text-red-600",
    description: "Health emergencies requiring immediate medical attention",
  },
  {
    id: "fire",
    name: "Fire Emergency",
    icon: Flame,
    color: "text-orange-600",
    description: "Fire incidents or fire hazards",
  },
  {
    id: "security",
    name: "Security Threat",
    icon: Shield,
    color: "text-blue-600",
    description: "Security incidents or threats to public safety",
  },
  {
    id: "flood",
    name: "Flood/Water Emergency",
    icon: Droplets,
    color: "text-cyan-600",
    description: "Flooding or water-related emergencies",
  },
  {
    id: "infrastructure",
    name: "Infrastructure Failure",
    icon: AlertTriangle,
    color: "text-yellow-600",
    description: "Road damage, power outages, or infrastructure issues",
  },
]

export default function EmergencyPage() {
  const [selectedType, setSelectedType] = useState("")
  const [description, setDescription] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isReporting, setIsReporting] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [mockFloodDemo, setMockFloodDemo] = useState(false)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleEmergencyReport = async () => {
    if (!selectedType || !description) return

    setIsReporting(true)

    // Simulate flood demo
    if (selectedType === "flood") {
      setMockFloodDemo(true)
      setTimeout(() => {
        setReportSubmitted(true)
        setIsReporting(false)
      }, 2000)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setReportSubmitted(true)
      setIsReporting(false)
    }, 2000)
  }

  const resetForm = () => {
    setSelectedType("")
    setDescription("")
    setReportSubmitted(false)
    setMockFloodDemo(false)
  }

  if (reportSubmitted) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-4">Emergency Report Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Your emergency report has been received and forwarded to the appropriate authorities. You will receive
              updates on the response status.
            </p>

            {mockFloodDemo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-blue-800 mb-2">🌊 Flood Emergency Demo</h3>
                <div className="text-left space-y-2 text-sm">
                  <p>✅ Report received at Emergency Operations Center</p>
                  <p>✅ Location verified: Nairobi CBD area</p>
                  <p>✅ Response team dispatched</p>
                  <p>✅ Local authorities notified</p>
                  <p>⏳ Estimated response time: 15-20 minutes</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Report ID: EMG-{Date.now()}</p>
                <p className="text-sm text-muted-foreground">Keep this ID for reference</p>
              </div>

              <Button onClick={resetForm} className="w-full">
                Report Another Emergency
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Emergency Center</h1>
          <p className="text-muted-foreground">Report emergencies and get immediate help</p>
        </div>
        <Badge variant="destructive" className="animate-pulse">
          24/7 Active
        </Badge>
      </div>

      {/* Emergency Hotlines */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Phone className="h-5 w-5" />
            Emergency Hotlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="font-bold text-red-600">999</p>
              <p className="text-sm text-muted-foreground">Police Emergency</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="font-bold text-orange-600">999</p>
              <p className="text-sm text-muted-foreground">Fire Department</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-bold text-blue-600">999</p>
              <p className="text-sm text-muted-foreground">Medical Emergency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Emergency</CardTitle>
          <p className="text-sm text-muted-foreground">Select the type of emergency you want to report</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyTypes.map((type) => {
              const Icon = type.icon
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === type.id ? "ring-2 ring-red-500 bg-red-50" : ""
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-12 w-12 mx-auto mb-3 ${type.color}`} />
                    <h3 className="font-medium mb-2">{type.name}</h3>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedType && (
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium mb-2">Describe the emergency situation</label>
                <Textarea
                  placeholder="Provide as much detail as possible about the emergency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location Information</span>
                </div>
                {userLocation ? (
                  <p className="text-sm text-muted-foreground">
                    Your current location will be shared with emergency responders:
                    <br />
                    Latitude: {userLocation.lat.toFixed(6)}
                    <br />
                    Longitude: {userLocation.lng.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Location access required for emergency response</p>
                )}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For life-threatening emergencies, call 999 immediately. This form is for non-critical emergencies and
                  community reporting.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  onClick={handleEmergencyReport}
                  disabled={!description || isReporting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isReporting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Emergency Report
                    </>
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Photo Evidence</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Take a photo or upload an image to help emergency responders understand the situation
                        </p>
                        <Button className="mt-4">Take Photo</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Map Demo */}
      {mockFloodDemo && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Droplets className="h-5 w-5" />
              Real-time Emergency Response Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="font-bold text-blue-800">🌊 Flood Emergency - Nairobi CBD</h3>
                <p className="text-sm text-blue-600">Live tracking of emergency response</p>
              </div>

              <div className="bg-white p-4 rounded border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">📍 Your Location</span>
                    <Badge className="bg-red-100 text-red-800">Emergency Reported</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">🚒 Fire Department Unit 3</span>
                    <Badge className="bg-orange-100 text-orange-800">En Route - 8 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">🚓 Police Unit 12</span>
                    <Badge className="bg-blue-100 text-blue-800">En Route - 12 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">🏥 Ambulance Service</span>
                    <Badge className="bg-green-100 text-green-800">Standby</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-blue-600">
                  Emergency response teams have been notified and are responding to your location. Stay safe and follow
                  any instructions from emergency personnel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Preparedness Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Before an Emergency</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep emergency contacts readily available</li>
                <li>• Know your evacuation routes</li>
                <li>• Prepare an emergency kit</li>
                <li>• Stay informed about local risks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">During an Emergency</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stay calm and assess the situation</li>
                <li>• Call emergency services if needed</li>
                <li>• Follow official instructions</li>
                <li>• Help others if it's safe to do so</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
