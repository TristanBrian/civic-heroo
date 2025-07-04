"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  MapPin,
  Bell,
  Shield,
  Save,
  Trash2,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"

const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
]

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const [formData, setFormData] = useState({
    name: "",
    county: "",
    language: "en" as "en" | "sw",
    phone: "",
    notifications: {
      sms: true,
      achievements: true,
      reminders: true,
      community: false,
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    // Initialize form with user data
    setFormData({
      name: user.name || "",
      county: user.county || "",
      language: user.language || "en",
      phone: user.phone || "",
      notifications: {
        sms: true,
        achievements: true,
        reminders: true,
        community: false,
      },
    })
  }, [user, router])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      // Update user data
      updateUser({
        name: formData.name,
        county: formData.county,
        language: formData.language,
        phone: formData.phone,
      })

      setMessage("Settings saved successfully!")
      setMessageType("success")

      // Auto-hide success message
      setTimeout(() => {
        setMessage("")
        setMessageType("")
      }, 3000)
    } catch (error) {
      console.error("Save settings error:", error)
      setMessage("Failed to save settings. Please try again.")
      setMessageType("error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      setMessage("Failed to sign out. Please try again.")
      setMessageType("error")
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Clear user data
        await logout()
        router.push("/")
      } catch (error) {
        console.error("Delete account error:", error)
        setMessage("Failed to delete account. Please try again.")
        setMessageType("error")
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="bg-white/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your CivicHero account</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Messages */}
        {message && (
          <Alert
            className={`mb-6 ${messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl">
                    {(user.name || "C").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name || "Civic Hero"}</CardTitle>
                <CardDescription>{user.phone}</CardDescription>
                <div className="flex justify-center gap-2 mt-2">
                  {user.county && <Badge variant="outline">📍 {user.county}</Badge>}
                  <Badge variant="outline">{user.language === "en" ? "🇬🇧 English" : "🇰🇪 Kiswahili"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-blue-600">{user.level || 1}</div>
                      <div className="text-gray-600">Level</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600">{user.tokens || 0}</div>
                      <div className="text-gray-600">Tokens</div>
                    </div>
                    <div>
                      <div className="font-bold text-orange-600">{user.streak || 0}</div>
                      <div className="text-gray-600">Streak</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center text-sm text-gray-600">
                    <p>Member since</p>
                    <p className="font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254712345678"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Phone number cannot be changed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location & Language</span>
                </CardTitle>
                <CardDescription>Set your county and preferred language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select
                      value={formData.county}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, county: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        {KENYAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value: "en" | "sw") => setFormData((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="sw">🇰🇪 Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                    </div>
                    <Switch
                      checked={formData.notifications.sms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked },
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when you unlock achievements</p>
                    </div>
                    <Switch
                      checked={formData.notifications.achievements}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, achievements: checked },
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Learning Reminders</Label>
                      <p className="text-sm text-gray-600">Daily reminders to continue learning</p>
                    </div>
                    <Switch
                      checked={formData.notifications.reminders}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, reminders: checked },
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Community Updates</Label>
                      <p className="text-sm text-gray-600">News about local civic activities</p>
                    </div>
                    <Switch
                      checked={formData.notifications.community}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, community: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Actions</span>
                </CardTitle>
                <CardDescription>Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Danger Zone</h4>
                  <p className="text-sm text-gray-600">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
