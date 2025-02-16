import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, RefreshCw } from "lucide-react"

const fillerWords = ["um", "uh", "like", "you know", "actually", "basically", "literally"]

export default function LivePracticeMode() {
  let theme = "dark"
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [fillerCount, setFillerCount] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const transcriptRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcriptRef.current]) //Corrected dependency

  const toggleRecording = () => {
    setIsRecording((prev) => !prev)
    if (!isRecording) {
      simulateLiveSpeech()
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const simulateLiveSpeech = () => {
    const words = [
      "Welcome",
      "to",
      "version",
      "31",
      "of",
      "our",
      "presentation",
      "practice",
      "mode",
      "um",
      "Today",
      "we'll",
      "be",
      "discussing",
      "the",
      "importance",
      "of",
      "effective",
      "communication",
      "uh",
      "in",
      "various",
      "professional",
      "settings",
      "you know",
      "It's",
      "actually",
      "a",
      "critical",
      "skill",
      "that",
      "can",
      "make",
      "or",
      "break",
      "your",
      "career",
      "um",
      "Let's",
      "dive",
      "into",
      "some",
      "key",
      "points",
      "First",
      "active",
      "listening",
      "is",
      "uh",
      "crucial",
      "for",
      "understanding",
      "others",
      "Second",
      "clear",
      "and",
      "concise",
      "messaging",
      "helps",
      "avoid",
      "misunderstandings",
      "Third",
      "body",
      "language",
      "plays",
      "a",
      "significant",
      "role",
      "in",
      "how",
      "your",
      "message",
      "is",
      "received",
      "um",
      "by",
      "others",
      "Remember",
      "practice",
      "makes",
      "perfect",
    ]
    let index = 0

    timerRef.current = setInterval(() => {
      if (index < words.length) {
        const word = words[index]
        setCurrentWord(word)
        setTranscript((prev) => {
          const newTranscript = prev + (prev ? " " : "") + word
          const newFillerCount = countFillerWords(newTranscript)
          setFillerCount(newFillerCount)
          return newTranscript
        })
        index++
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setIsRecording(false)
      }
    }, 500)
  }

  const countFillerWords = (text: string) => {
    return fillerWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      return count + (text.match(regex) || []).length
    }, 0)
  }

  const resetPractice = () => {
    setTranscript("")
    setFillerCount(0)
    setIsRecording(false)
    setCurrentWord("")
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"
      } p-6`}
    >
      <Card className={`max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <CardHeader>
          <CardTitle
            className={`text-2xl font-bold text-center ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
          >
            Live Practice Mode v31
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"}>
              {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <div className="text-lg font-semibold">
              Filler Words: <span className="text-red-500">{fillerCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* <ThemeToggle /> */}
              {/* <Button onClick={() => toggleTheme()} variant="outline" size="sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button> */}
              <Button onClick={resetPractice} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          <div
            className={`mb-4 h-16 flex items-center justify-center rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <span className={`text-4xl font-bold ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>
              {currentWord}
            </span>
          </div>
          <div
            ref={transcriptRef}
            className={`p-4 rounded-lg h-64 overflow-y-auto whitespace-pre-wrap ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            {transcript.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  fillerWords.includes(word.toLowerCase())
                    ? theme === "dark"
                      ? "text-red-400 font-bold"
                      : "text-red-600 font-bold"
                    : theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-800"
                }
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

