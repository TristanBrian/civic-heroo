"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, Volume2, VolumeX, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TextToSpeechProps {
  text: string
  language?: "en" | "sw"
  autoPlay?: boolean
  className?: string
  compact?: boolean
}

export function TextToSpeech({
  text,
  language = "en",
  autoPlay = false,
  className,
  compact = false,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState(0.8) // Slower for better comprehension
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const isSpeakingRef = useRef(false)

  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([])
  const currentUtteranceIndex = useRef(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const elapsedTimeRef = useRef<number>(0)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // Auto-select appropriate voice based on language
      const preferredVoice = availableVoices.find((voice) => {
        if (language === "sw") {
          return voice.lang.startsWith("sw") || voice.name.toLowerCase().includes("swahili")
        } else {
          return voice.lang.startsWith("en") && voice.name.toLowerCase().includes("us")
        }
      })

      if (preferredVoice && !selectedVoice) {
        setSelectedVoice(preferredVoice.name)
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [language, selectedVoice])

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && text) {
      handlePlay()
    }
    return () => {
      handleStop()
    }
  }, [autoPlay, text])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceQueue.current.length > 0) {
        speechSynthesis.cancel()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Split text into chunks for speech synthesis
  const splitTextIntoChunks = (inputText: string, maxLength = 160) => {
    console.log("Splitting text into chunks for TTS")
    const sentences = inputText.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+$/g) || []
    const chunks: string[] = []
    let currentChunk = ""

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          // Sentence itself is longer than maxLength, push as is
          chunks.push(sentence.trim())
          currentChunk = ""
        }
      } else {
        currentChunk += sentence
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }
    console.log("Chunks created:", chunks.length, chunks)
    return chunks
  }

  // Create utterance for a chunk
  const createUtterance = (chunk: string) => {
    const utterance = new SpeechSynthesisUtterance(chunk)

    // Set voice
    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) {
      utterance.voice = voice
    }

    // Set properties
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = isMuted ? 0 : volume

    // Event handlers
    utterance.onstart = () => {
      console.log("Utterance started:", currentUtteranceIndex.current)
      setIsPlaying(true)
      setIsPaused(false)
      startProgressTracking()
    }

    utterance.onend = () => {
      console.log("Utterance ended:", currentUtteranceIndex.current)
      currentUtteranceIndex.current += 1
      if (currentUtteranceIndex.current < utteranceQueue.current.length) {
        // Removed setTimeout to avoid timing issues
        console.log("Speaking next chunk:", currentUtteranceIndex.current)
        if (!speechSynthesis.speaking) {
          speechSynthesis.speak(utteranceQueue.current[currentUtteranceIndex.current])
        }
      } else {
        setIsPlaying(false)
        setIsPaused(false)
        setProgress(0)
        stopProgressTracking()
        currentUtteranceIndex.current = 0
        isSpeakingRef.current = false
      }
    }

    utterance.onerror = (event) => {
      if (event.error !== "interrupted") {
        console.error("Speech synthesis error:", event.error)
      }
      if (event.error === "interrupted") {
        console.log("Speech interrupted, attempting to continue...")
        if (currentUtteranceIndex.current < utteranceQueue.current.length - 1) {
          currentUtteranceIndex.current += 1
          setTimeout(() => {
            if (!speechSynthesis.speaking) {
              speechSynthesis.speak(utteranceQueue.current[currentUtteranceIndex.current])
            }
          }, 300)
          return
        }
      }
      setIsPlaying(false)
      setIsPaused(false)
      stopProgressTracking()
      currentUtteranceIndex.current = 0
      isSpeakingRef.current = false
    }

    utterance.onpause = () => {
      setIsPaused(true)
      stopProgressTracking()
    }

    utterance.onresume = () => {
      setIsPaused(false)
      startProgressTracking()
    }

    return utterance
  }

  const startProgressTracking = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - elapsedTimeRef.current
    }
    const totalDuration = duration || estimateDuration(text)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      elapsedTimeRef.current = elapsed
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(progressPercent)
    }, 100)
  }

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const estimateDuration = (inputText: string) => {
    const wordsPerMinute = 150 * rate // Average speaking rate adjusted for rate
    const wordCount = inputText.split(" ").length
    return (wordCount / wordsPerMinute) * 60 * 1000 // in milliseconds
  }

  const handlePlay = () => {
    if (isSpeakingRef.current) {
      // Prevent multiple simultaneous plays
      return
    }
    isSpeakingRef.current = true

    if (isPaused) {
      speechSynthesis.resume()
      setIsPlaying(true)
      setIsPaused(false)
      startProgressTracking()
      return
    }

    if (speechSynthesis.speaking) {
      // Prevent interrupting ongoing speech
      return
    }
    const chunks = splitTextIntoChunks(text)
    utteranceQueue.current = chunks.map(createUtterance)
    currentUtteranceIndex.current = 0
    if (utteranceQueue.current.length > 0) {
      speechSynthesis.speak(utteranceQueue.current[0])
    }
  }

  const handlePause = () => {
    speechSynthesis.pause()
    setIsPaused(true)
    stopProgressTracking()
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
    stopProgressTracking()
    currentUtteranceIndex.current = 0
    elapsedTimeRef.current = 0
    startTimeRef.current = 0
    isSpeakingRef.current = false
    utteranceQueue.current = []
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (utteranceQueue.current.length > 0 && isPlaying) {
      // Restart with new volume
      handleStop()
      setTimeout(() => {
        handlePlay()
      }, 100)
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={isPlaying && !isPaused ? handlePause : handlePlay}
          disabled={!text}
          className="h-8 w-8 p-0"
        >
          {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        {isPlaying && (
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border p-4 space-y-4", className)}>
      {/* Main Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={isPlaying && !isPaused ? handlePause : handlePlay}
          disabled={!text}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              {isPaused ? "Resume" : "Play"}
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" onClick={handleStop} disabled={!isPlaying && !isPaused}>
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Voice</label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices
                      .filter((voice) =>
                        language === "sw"
                          ? voice.lang.startsWith("sw") || voice.name.toLowerCase().includes("swahili")
                          : voice.lang.startsWith("en"),
                      )
                      .map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Speed: {rate.toFixed(1)}x</label>
                <Slider
                  value={[rate]}
                  onValueChange={([value]) => setRate(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Pitch: {pitch.toFixed(1)}</label>
                <Slider
                  value={[pitch]}
                  onValueChange={([value]) => setPitch(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
                <Slider
                  value={[volume]}
                  onValueChange={([value]) => setVolume(value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Progress Bar */}
      {(isPlaying || isPaused) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{Math.round(progress)}%</span>
            <span>{Math.round(duration / 1000)}s</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Language Indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Language: {language === "en" ? "English" : "Kiswahili"}</span>
      {text && <span>{text.trim().split(/\s+/).length} words</span>}
      </div>
    </div>
  )
}

// Hook for global audio preferences
export function useAudioPreferences() {
  const [globalMute, setGlobalMute] = useState(false)
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "sw">("en")

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem("civichero-audio-prefs")
    if (saved) {
      const prefs = JSON.parse(saved)
      setGlobalMute(prefs.globalMute || false)
      setPreferredLanguage(prefs.preferredLanguage || "en")
    }
  }, [])

  const updatePreferences = (prefs: { globalMute?: boolean; preferredLanguage?: "en" | "sw" }) => {
    if (prefs.globalMute !== undefined) setGlobalMute(prefs.globalMute)
    if (prefs.preferredLanguage !== undefined) setPreferredLanguage(prefs.preferredLanguage)

    // Save to localStorage
    const current = JSON.parse(localStorage.getItem("civichero-audio-prefs") || "{}")
    localStorage.setItem("civichero-audio-prefs", JSON.stringify({ ...current, ...prefs }))
  }

  return {
    globalMute,
    preferredLanguage,
    updatePreferences,
  }
}
