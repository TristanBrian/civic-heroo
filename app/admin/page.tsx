"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, FileText, CheckCircle, BarChart3, Handshake, Search, Ban, Edit, Trash2, Plus } from "lucide-react"

// Mock admin data
const mockUsers = [
  { id: "1", phone: "+254712345678", county: "Nairobi", tokens: 1250, status: "active" },
  { id: "2", phone: "+254723456789", county: "Mombasa", tokens: 890, status: "active" },
  { id: "3", phone: "+254734567890", county: "Kisumu", tokens: 2100, status: "restricted" },
]

const mockLessons = [
  { id: 1, title_en: "County Government", title_sw: "Serikali ya Kaunti", difficulty: 1, status: "published" },
  { id: 2, title_en: "Environmental Care", title_sw: "Utunzaji wa Mazingira", difficulty: 2, status: "draft" },
]

const mockTaskSubmissions = [
  {
    id: 1,
    user_phone: "+254712345678",
    task_title: "Road Documentation",
    image_url: "/placeholder.svg?height=100&width=100",
    status: "pending",
  },
  {
    id: 2,
    user_phone: "+254723456789",
    task_title: "Water Point Cleaning",
    image_url: "/placeholder.svg?height=100&width=100",
    status: "pending",
  },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [lessons, setLessons] = useState(mockLessons)
  const [submissions, setSubmissions] = useState(mockTaskSubmissions)

  const filteredUsers = users.filter(
    (user) => user.phone.includes(searchTerm) || user.county.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserAction = (userId: string, action: "ban" | "unban") => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: action === "ban" ? "banned" : "active" } : user)),
    )
  }

  const handleTaskVerification = (submissionId: number, action: "approve" | "reject") => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status: action === "approve" ? "approved" : "rejected" } : sub,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="secondary">Super Admin</Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{lessons.length}</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{submissions.filter((s) => s.status === "pending").length}</p>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Handshake className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Manager</TabsTrigger>
            <TabsTrigger value="verification">Task Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="partners">Partner Portal</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by phone or county..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phone</TableHead>
                      <TableHead>County</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.county}</TableCell>
                        <TableCell>{user.tokens}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, user.status === "active" ? "ban" : "unban")}
                            >
                              <Ban className="h-4 w-4" />
                              {user.status === "active" ? "Ban" : "Unban"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Manager */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content Manager</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Lesson</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Title (English)" />
                        <Input placeholder="Title (Swahili)" />
                        <textarea className="w-full p-2 border rounded-md" placeholder="Content (English)" rows={4} />
                        <textarea className="w-full p-2 border rounded-md" placeholder="Content (Swahili)" rows={4} />
                        <Button className="w-full">Create Lesson</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title (EN)</TableHead>
                      <TableHead>Title (SW)</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell>{lesson.title_en}</TableCell>
                        <TableCell>{lesson.title_sw}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {lesson.difficulty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lesson.status === "published" ? "default" : "secondary"}>
                            {lesson.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Verification */}
          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissions.map((submission) => (
                    <Card key={submission.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <img
                            src={submission.image_url || "/placeholder.svg"}
                            alt="Task submission"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium">{submission.task_title}</p>
                            <p className="text-sm text-muted-foreground">{submission.user_phone}</p>
                          </div>
                          <Badge
                            variant={
                              submission.status === "pending"
                                ? "secondary"
                                : submission.status === "approved"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {submission.status}
                          </Badge>
                          {submission.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleTaskVerification(submission.id, "approve")}>
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTaskVerification(submission.id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Engagement Chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Token Chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>English</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span>Swahili</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>County Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">County Map</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Partner Portal */}
          <TabsContent value="partners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Partner Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Handshake className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Partner portal features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
