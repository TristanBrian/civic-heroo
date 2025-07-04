"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Award, Scan } from "lucide-react"

interface ARCivicQuestProps {
  marker: string
  location: { lat: number; lng: number }
  language: "en" | "sw"
}

interface LandmarkData {
  name_en: string
  name_sw: string
  description_en: string
  description_sw: string
  historical_significance_en: string
  historical_significance_sw: string
  quiz_questions: {
    en: Array<{ question: string; options: string[]; correct: number }>
    sw: Array<{ question: string; options: string[]; correct: number }>
  }
  reward_tokens: number
}

const landmarkDatabase: Record<string, LandmarkData> = {
  "kenya-parliament": {
    name_en: "Parliament Buildings",
    name_sw: "Majengo ya Bunge",
    description_en: "The seat of Kenya's legislative power, where laws are made and national policies are debated.",
    description_sw:
      "Makao makuu ya mamlaka ya kisheria ya Kenya, ambapo sheria zinatengenezwa na sera za kitaifa zinajadiliwa.",
    historical_significance_en:
      "Built in 1954, these buildings have witnessed Kenya's journey from colonial rule to independence and democratic governance.",
    historical_significance_sw:
      "Yalijengewe mwaka 1954, majengo haya yameshuhudia safari ya Kenya kutoka utawala wa kikoloni hadi uhuru na utawala wa kidemokrasia.",
    quiz_questions: {
      en: [
        {
          question: "How many houses does the Kenyan Parliament have?",
          options: ["One", "Two", "Three", "Four"],
          correct: 1,
        },
        {
          question: "What is the upper house of Parliament called?",
          options: ["National Assembly", "Senate", "County Assembly", "Cabinet"],
          correct: 1,
        },
      ],
      sw: [
        {
          question: "Bunge la Kenya lina nyumba ngapi?",
          options: ["Moja", "Mbili", "Tatu", "Nne"],
          correct: 1,
        },
        {
          question: "Nyumba ya juu ya Bunge inaitwa nini?",
          options: ["Bunge la Kitaifa", "Seneti", "Bunge la Kaunti", "Baraza la Mawaziri"],
          correct: 1,
        },
      ],
    },
    reward_tokens: 200,
  },
  "county-assembly-nairobi": {
    name_en: "Nairobi County Assembly",
    name_sw: "Bunge la Kaunti ya Nairobi",
    description_en:
      "The legislative arm of Nairobi County government, responsible for making county laws and oversight.",
    description_sw:
      "Tawi la kisheria la serikali ya Kaunti ya Nairobi, linawajibika kwa kutengeneza sheria za kaunti na ufuatiliaji.",
    historical_significance_en:
      "Established in 2013 following the new constitution, it represents the devolution of power to county level.",
    historical_significance_sw:
      "Ilianzishwa mwaka 2013 kufuatia katiba mpya, inawakilisha ugawaji wa mamlaka hadi kiwango cha kaunti.",
    quiz_questions: {
      en: [
        {
          question: "When was the current county government system established?",
          options: ["2010", "2013", "2015", "2017"],
          correct: 1,
        },
      ],
      sw: [
        {
          question: "Mfumo wa sasa wa serikali za kaunti ulianzishwa lini?",
          options: ["2010", "2013", "2015", "2017"],
          correct: 1,
        },
      ],
    },
    reward_tokens: 150,
  },
}

export function ARCivicQuest({ marker, location, language }: ARCivicQuestProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [landmarkDetected, setLandmarkDetected] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const landmarkData = landmarkDatabase[marker]

  useEffect(() => {
    if (isScanning) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isScanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Simulate landmark detection after 3 seconds
      setTimeout(() => {
        setLandmarkDetected(true)
      }, 3000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return

    const questions = landmarkData.quiz_questions[language]
    const isCorrect = selectedAnswer === questions[currentQuiz].correct

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    if (currentQuiz < questions.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      setQuizCompleted(true)
    }
  }

  const calculateReward = () => {
    const baseReward = landmarkData.reward_tokens
    const quizBonus = (score / landmarkData.quiz_questions[language].length) * 100
    return Math.round(baseReward + quizBonus)
  }

  if (!landmarkData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Landmark data not found for marker: {marker}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* AR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {language === "en" ? "AR Civic Quest" : "Utafutaji wa AR wa Kiraia"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {isScanning ? (
              <div className="relative">
                <video ref={videoRef} className="w-full h-64 object-cover rounded-lg" playsInline muted />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                {!landmarkDetected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center text-white">
                      <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p>{language === "en" ? "Scanning for landmark..." : "Inatafuta alama..."}</p>
                    </div>
                  </div>
                )}
                {landmarkDetected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold">{language === "en" ? "Landmark Detected!" : "Alama Imepatikana!"}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <Button onClick={() => setIsScanning(true)}>
                    {language === "en" ? "Start AR Scan" : "Anza Uchunguzi wa AR"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Landmark Information */}
      {landmarkDetected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {language === "en" ? landmarkData.name_en : landmarkData.name_sw}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{language === "en" ? "Description" : "Maelezo"}</h4>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? landmarkData.description_en : landmarkData.description_sw}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                {language === "en" ? "Historical Significance" : "Umuhimu wa Kihistoria"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? landmarkData.historical_significance_en : landmarkData.historical_significance_sw}
              </p>
            </div>

            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
              <Award className="h-3 w-3" />
              {landmarkData.reward_tokens} {language === "en" ? "tokens available" : "pointi zinapatikana"}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Quiz Section */}
      {landmarkDetected && !quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Knowledge Quiz" : "Jaribio la Maarifa"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Question" : "Swali"} {currentQuiz + 1} {language === "en" ? "of" : "kati ya"}{" "}
              {landmarkData.quiz_questions[language].length}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">{landmarkData.quiz_questions[language][currentQuiz].question}</h4>
              <div className="space-y-2">
                {landmarkData.quiz_questions[language][currentQuiz].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleQuizSubmit} disabled={selectedAnswer === null} className="w-full">
              {currentQuiz < landmarkData.quiz_questions[language].length - 1
                ? language === "en"
                  ? "Next Question"
                  : "Swali Lijalo"
                : language === "en"
                  ? "Complete Quiz"
                  : "Maliza Jaribio"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quiz Results */}
      {quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {language === "en" ? "Quest Complete!" : "Utafutaji Umekamilika!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {score}/{landmarkData.quiz_questions[language].length}
              </p>
              <p className="text-muted-foreground">{language === "en" ? "Correct Answers" : "Majibu Sahihi"}</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-yellow-600">+{calculateReward()}</p>
              <p className="text-muted-foreground">{language === "en" ? "Tokens Earned" : "Pointi Zilizopatikana"}</p>
            </div>

            <Button className="w-full">{language === "en" ? "Claim Reward" : "Pokea Tuzo"}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
