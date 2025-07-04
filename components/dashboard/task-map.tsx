"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Coins } from "lucide-react"
import type { Task } from "@/types"

interface TaskMapProps {
  tasks: Task[]
  language: "en" | "sw"
  userLocation?: { lat: number; lng: number }
}

export function TaskMap({ tasks, language, userLocation }: TaskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Mock map implementation - in real app, use Mapbox GL JS
  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map here with Mapbox
    // mapboxgl.accessToken = 'your-mapbox-token'
    // const map = new mapboxgl.Map({
    //   container: mapRef.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: userLocation ? [userLocation.lng, userLocation.lat] : [36.8219, -1.2921],
    //   zoom: 12
    // })

    // Add task markers
    // tasks.forEach(task => {
    //   new mapboxgl.Marker()
    //     .setLngLat([task.location.lng, task.location.lat])
    //     .addTo(map)
    // })
  }, [tasks, userLocation])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock map container */}
          <div ref={mapRef} className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map will load here (Mapbox integration)</p>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.slice(0, 3).map((task) => (
          <Card
            key={task.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTask(task)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{language === "en" ? task.title_en : task.title_sw}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? task.description_en : task.description_sw}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {task.reward}
                  </Badge>
                  <Badge variant="outline">{task.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
