"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Scan, Award, RotateCcw, Volume2, VolumeX } from "lucide-react"

interface ARCountyAssemblyTourProps {
  county: string
  language: "en" | "sw"
}

export function ARCountyAssemblyTour({ county, language }: ARCountyAssemblyTourProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [badgeDetected, setBadgeDetected] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [show3DModel, setShow3DModel] = useState(false)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const quizQuestions = {
    en: [
      {
        question: "What is the main function of a County Assembly?",
        options: [
          "To enforce laws",
          "To make county laws and oversee county government",
          "To collect taxes",
          "To provide healthcare services",
        ],
        correct: 1,
      },
      {
        question: "Who leads the County Assembly?",
        options: ["The Governor", "The County Commissioner", "The Speaker", "The Deputy Governor"],
        correct: 2,
      },
      {
        question: "How often do County Assembly members meet?",
        options: ["Once a year", "Once a month", "Regularly as scheduled", "Only during emergencies"],
        correct: 2,
      },
    ],
    sw: [
      {
        question: "Kazi kuu ya Bunge la Kaunti ni nini?",
        options: [
          "Kutekeleza sheria",
          "Kutengeneza sheria za kaunti na kusimamia serikali ya kaunti",
          "Kukusanya ushuru",
          "Kutoa huduma za afya",
        ],
        correct: 1,
      },
      {
        question: "Nani anaongoza Bunge la Kaunti?",
        options: ["Gavana", "Kamishna wa Kaunti", "Spika", "Naibu Gavana"],
        correct: 2,
      },
      {
        question: "Wabunge wa Kaunti hukutana mara ngapi?",
        options: [
          "Mara moja kwa mwaka",
          "Mara moja kwa mwezi",
          "Kila wakati kama ilivyopangwa",
          "Wakati wa dharura tu",
        ],
        correct: 2,
      },
    ],
  }

  const assemblyInfo = {
    en: {
      title: `${county} County Assembly`,
      description: "The legislative arm of the county government responsible for making laws and oversight.",
      facts: [
        "Established in 2013 following devolution",
        "Represents the people of the county",
        "Makes county laws and policies",
        "Oversees county government operations",
      ],
    },
    sw: {
      title: `Bunge la Kaunti ya ${county}`,
      description: "Tawi la kisheria la serikali ya kaunti linawajibika kwa kutengeneza sheria na ufuatiliaji.",
      facts: [
        "Lilianzishwa mwaka 2013 kufuatia ugawaji wa mamlaka",
        "Linawakilisha watu wa kaunti",
        "Linatengeneza sheria na sera za kaunti",
        "Linasimamia shughuli za serikali ya kaunti",
      ],
    },
  }

  const currentInfo = assemblyInfo[language]
  const currentQuiz = quizQuestions[language]

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

      // Simulate badge detection after 3 seconds
      setTimeout(() => {
        setBadgeDetected(true)
        if (audioEnabled) {
          speak(
            language === "en"
              ? "Judge's badge detected! Loading 3D model..."
              : "Begi ya jaji imepatikana! Inapakia mfano wa 3D...",
          )
        }
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

  const speak = (text: string) => {
    if (!audioEnabled || !window.speechSynthesis) return

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "sw" ? "sw-KE" : "en-US"
      utterance.rate = 0.8

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error with speech synthesis:", error)
    }
  }

  const handleShow3DModel = () => {
    setShow3DModel(true)
    if (audioEnabled) {
      speak(
        language === "en"
          ? "Welcome to the County Assembly virtual tour. This is where county representatives meet to make laws."
          : "Karibu katika ziara ya mtandaoni ya Bunge la Kaunti. Hapa ndipo wawakilishi wa kaunti hukutana kutengeneza sheria.",
      )
    }
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
    setShow3DModel(false)
    if (audioEnabled) {
      speak(currentQuiz[0].question)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuiz[currentQuizIndex].correct) {
      setQuizScore((prev) => prev + 1)
    }

    if (currentQuizIndex < currentQuiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      if (audioEnabled) {
        setTimeout(() => speak(currentQuiz[currentQuizIndex + 1].question), 500)
      }
    } else {
      // Quiz completed
      const finalScore = selectedAnswer === currentQuiz[currentQuizIndex].correct ? quizScore + 1 : quizScore
      if (audioEnabled) {
        speak(
          language === "en"
            ? `Quiz completed! You scored ${finalScore} out of ${currentQuiz.length}.`
            : `Jaribio limekamilika! Umepata alama ${finalScore} kati ya ${currentQuiz.length}.`,
        )
      }
    }
  }

  const resetTour = () => {
    setBadgeDetected(false)
    setShow3DModel(false)
    setShowQuiz(false)
    setCurrentQuizIndex(0)
    setQuizScore(0)
    setSelectedAnswer(null)
    setIsScanning(false)
  }

  const isQuizComplete = currentQuizIndex >= currentQuiz.length - 1 && selectedAnswer !== null

  return (
    <div className="space-y-4">
      {/* AR Scanner */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {language === "en" ? "AR County Assembly Tour" : "Ziara ya AR ya Bunge la Kaunti"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={resetTour}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {isScanning ? (
              <div className="relative">
                <video ref={videoRef} className="w-full h-64 object-cover rounded-lg" playsInline muted />
                {!badgeDetected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center text-white">
                      <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p>{language === "en" ? "Scan the judge's badge..." : "Changanua begi ya jaji..."}</p>
                    </div>
                  </div>
                )}
                {badgeDetected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold">{language === "en" ? "Badge Detected!" : "Begi Imepatikana!"}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Point your camera at a judge's badge to start the AR tour"
                      : "Elekeza kamera yako kwenye begi ya jaji kuanza ziara ya AR"}
                  </p>
                  <Button onClick={() => setIsScanning(true)}>
                    {language === "en" ? "Start AR Scan" : "Anza Uchunguzi wa AR"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3D Model Viewer */}
      {badgeDetected && !showQuiz && (
        <Card>
          <CardHeader>
            <CardTitle>{currentInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-blue-200 rounded-lg flex items-center justify-center">
                  <div className="text-4xl">🏛️</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{currentInfo.title}</h3>
                <p className="text-muted-foreground mb-4">{currentInfo.description}</p>

                {!show3DModel ? (
                  <Button onClick={handleShow3DModel} className="mb-4">
                    {language === "en" ? "View 3D Model" : "Ona Mfano wa 3D"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium mb-2">{language === "en" ? "Key Facts:" : "Ukweli Muhimu:"}</h4>
                      <ul className="text-sm text-left space-y-1">
                        {currentInfo.facts.map((fact, index) => (
                          <li key={index}>• {fact}</li>
                        ))}
                      </ul>
                    </div>

                    <Button onClick={handleStartQuiz} className="w-full">
                      {language === "en" ? "Take Knowledge Quiz" : "Fanya Jaribio la Maarifa"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Section */}
      {showQuiz && (
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Knowledge Quiz" : "Jaribio la Maarifa"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Question" : "Swali"} {currentQuizIndex + 1} {language === "en" ? "of" : "kati ya"}{" "}
              {currentQuiz.length}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuizIndex < currentQuiz.length ? (
              <>
                <div>
                  <h4 className="font-medium mb-3">{currentQuiz[currentQuizIndex].question}</h4>
                  <div className="space-y-2">
                    {currentQuiz[currentQuizIndex].options.map((option, index) => (
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

                <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="w-full">
                  {currentQuizIndex < currentQuiz.length - 1
                    ? language === "en"
                      ? "Next Question"
                      : "Swali Lijalo"
                    : language === "en"
                      ? "Complete Quiz"
                      : "Maliza Jaribio"}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <Award className="h-16 w-16 mx-auto text-yellow-500" />
                <h3 className="text-xl font-bold">{language === "en" ? "Quiz Complete!" : "Jaribio Limekamilika!"}</h3>
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    {quizScore + (selectedAnswer === currentQuiz[currentQuizIndex].correct ? 1 : 0)}/
                    {currentQuiz.length}
                  </p>
                  <p className="text-muted-foreground">{language === "en" ? "Correct Answers" : "Majibu Sahihi"}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">+300</p>
                  <p className="text-muted-foreground">
                    {language === "en" ? "Tokens Earned" : "Pointi Zilizopatikana"}
                  </p>
                </div>
                <Button onClick={resetTour} className="w-full">
                  {language === "en" ? "Start New Tour" : "Anza Ziara Mpya"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
