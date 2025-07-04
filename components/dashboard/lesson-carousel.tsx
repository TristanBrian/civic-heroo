"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, BookOpen, Award } from "lucide-react"
import type { Lesson } from "@/types"

interface LessonCarouselProps {
  lessons: Lesson[]
  language: "en" | "sw"
  continueLabel: string
}

export function LessonCarousel({ lessons, language, continueLabel }: LessonCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextLesson = () => {
    setCurrentIndex((prev) => (prev + 1) % lessons.length)
  }

  const prevLesson = () => {
    setCurrentIndex((prev) => (prev - 1 + lessons.length) % lessons.length)
  }

  const currentLesson = lessons[currentIndex]

  if (!currentLesson) return null

  return (
    <div className="relative">
      <Card className="min-h-[200px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {language === "en" ? currentLesson.title_en : currentLesson.title_sw}
            {currentLesson.completed && <Award className="h-4 w-4 text-yellow-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {language === "en" ? currentLesson.content_en : currentLesson.content_sw}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{currentLesson.progress || 0}%</span>
              </div>
              <Progress value={currentLesson.progress || 0} className="h-2" />
            </div>

            <Button className="w-full" size="sm">
              {continueLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent"
        onClick={prevLesson}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent"
        onClick={nextLesson}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center gap-2 mt-4">
        {lessons.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
