"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"

interface VoiceAssistantProps {
  currentStep: number
  onStepChange: (step: number) => void
  formData: {
    name: string
    age: string
    county: string
    interests: string[]
    experience: string
  }
  onFormDataChange: (data: any) => void
  onComplete: () => void
  isVoiceEnabled: boolean
  isSpeechEnabled: boolean
}

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

const INTEREST_OPTIONS = [
  "Local Government",
  "National Politics",
  "Community Development",
  "Education",
  "Healthcare",
  "Environment",
  "Youth Programs",
  "Women's Rights",
  "Anti-Corruption",
  "Economic Development",
  "Infrastructure",
  "Agriculture",
  "Technology",
  "Arts & Culture",
]

export function VoiceAssistant({
  currentStep,
  onStepChange,
  formData,
  onFormDataChange,
  onComplete,
  isVoiceEnabled,
  isSpeechEnabled,
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  const steps = [
    {
      title: "What's your name?",
      description: "Tell us your full name so we can personalize your experience",
      field: "name",
      type: "text",
      prompt: "Hello! Welcome to CivicHero. What's your full name?",
    },
    {
      title: "How old are you?",
      description: "This helps us provide age-appropriate content and opportunities",
      field: "age",
      type: "number",
      prompt: "Great to meet you! How old are you?",
    },
    {
      title: "Which county are you from?",
      description: "We'll show you local civic opportunities and information",
      field: "county",
      type: "select",
      options: KENYAN_COUNTIES,
      prompt: "Which county in Kenya are you from?",
    },
    {
      title: "What interests you most?",
      description: "Select areas of civic engagement that interest you",
      field: "interests",
      type: "multiselect",
      options: INTEREST_OPTIONS,
      prompt: "What areas of civic engagement interest you most? You can select multiple options.",
    },
    {
      title: "Tell us about your experience",
      description: "Any previous civic engagement or community involvement?",
      field: "experience",
      type: "textarea",
      prompt: "Do you have any previous experience with civic engagement or community involvement? Tell us about it.",
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript
        setTranscript(result)
        handleVoiceInput(result)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    // Speak the current step prompt when component mounts or step changes
    if (isSpeechEnabled) {
      speakText(steps[currentStep].prompt)
    }
  }, [currentStep, isSpeechEnabled])

  const speakText = (text: string) => {
    if (!isSpeechEnabled || !synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  const startListening = () => {
    if (!isVoiceEnabled || !recognitionRef.current) return

    setIsListening(true)
    setTranscript("")
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceInput = (input: string) => {
    const step = steps[currentStep]
    const lowerInput = input.toLowerCase()

    switch (step.type) {
      case "text":
      case "textarea":
        onFormDataChange({
          ...formData,
          [step.field]: input,
        })
        break

      case "number":
        const age = input.match(/\d+/)?.[0]
        if (age) {
          onFormDataChange({
            ...formData,
            [step.field]: age,
          })
        }
        break

      case "select":
        const county = KENYAN_COUNTIES.find(
          (c) => lowerInput.includes(c.toLowerCase()) || c.toLowerCase().includes(lowerInput),
        )
        if (county) {
          onFormDataChange({
            ...formData,
            [step.field]: county,
          })
        }
        break

      case "multiselect":
        const interests = INTEREST_OPTIONS.filter(
          (option) => lowerInput.includes(option.toLowerCase()) || option.toLowerCase().includes(lowerInput),
        )
        if (interests.length > 0) {
          onFormDataChange({
            ...formData,
            [step.field]: [...formData.interests, ...interests.filter((i) => !formData.interests.includes(i))],
          })
        }
        break
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const isStepValid = () => {
    const step = steps[currentStep]
    const value = formData[step.field as keyof typeof formData]

    if (step.type === "multiselect") {
      return Array.isArray(value) && value.length > 0
    }

    return value && value.toString().trim().length > 0
  }

  const currentStepData = steps[currentStep]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {currentStep + 1}
          </span>
          {currentStepData.title}
        </CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Voice Controls */}
        {isVoiceEnabled && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening ? "Stop Listening" : "Start Voice Input"}
            </Button>

            {isSpeechEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText(currentStepData.prompt)}
                disabled={isSpeaking}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {isSpeaking ? "Speaking..." : "Repeat Prompt"}
              </Button>
            )}

            {transcript && (
              <Badge variant="secondary" className="ml-auto">
                Heard: "{transcript}"
              </Badge>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {currentStepData.type === "text" && (
            <div>
              <Label htmlFor="input">Your Name</Label>
              <Input
                id="input"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          )}

          {currentStepData.type === "number" && (
            <div>
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => onFormDataChange({ ...formData, age: e.target.value })}
                placeholder="Enter your age"
                min="16"
                max="100"
              />
            </div>
          )}

          {currentStepData.type === "select" && (
            <div>
              <Label htmlFor="county">Your County</Label>
              <select
                id="county"
                value={formData.county}
                onChange={(e) => onFormDataChange({ ...formData, county: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select your county</option>
                {KENYAN_COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentStepData.type === "multiselect" && (
            <div>
              <Label>Your Interests</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFormDataChange({
                            ...formData,
                            interests: [...formData.interests, interest],
                          })
                        } else {
                          onFormDataChange({
                            ...formData,
                            interests: formData.interests.filter((i) => i !== interest),
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
              {formData.interests.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStepData.type === "textarea" && (
            <div>
              <Label htmlFor="experience">Your Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => onFormDataChange({ ...formData, experience: e.target.value })}
                placeholder="Tell us about any civic engagement or community involvement experience..."
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {isStepValid() && <CheckCircle className="h-5 w-5 text-green-500" />}
            <Button onClick={handleNext} disabled={!isStepValid()}>
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
