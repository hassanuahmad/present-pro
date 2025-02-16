import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, CheckCircle, Mic, StopCircle } from "lucide-react"
import { Header } from "@/components/Header"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface ChallengeScript {
  id: string
  title: string
  script: string
  timeLimit: number
  keywords: string[]
}

const challengeScripts: ChallengeScript[] = [
  {
    id: "1",
    title: "The Impact of Artificial Intelligence",
    script: `Artificial Intelligence, or AI, is revolutionizing our world in unprecedented ways. From healthcare to finance, AI is transforming industries and reshaping our daily lives. In healthcare, AI algorithms are assisting doctors in diagnosing diseases with remarkable accuracy, potentially saving countless lives. In the financial sector, AI-powered systems are detecting fraud, optimizing investments, and providing personalized financial advice. However, as AI continues to advance, we must also consider its ethical implications. Questions about privacy, job displacement, and the potential for AI bias need to be addressed. As we move forward, it's crucial that we harness the power of AI responsibly, ensuring that it benefits all of humanity while mitigating potential risks. The future of AI is bright, but it requires our careful guidance and consideration.`,
    timeLimit: 60,
    keywords: [
      "Artificial Intelligence",
      "AI",
      "healthcare",
      "finance",
      "transforming",
      "algorithms",
      "diagnosing",
      "fraud",
      "investments",
      "ethical",
      "privacy",
      "job displacement",
      "bias",
      "responsibly",
      "humanity",
      "risks",
      "future",
    ],
  },
  {
    id: "2",
    title: "Climate Change Solutions",
    script: `Climate change is one of the most pressing issues of our time, demanding immediate and decisive action. To combat this global threat, we need to implement a multi-faceted approach. First, we must rapidly transition to renewable energy sources like solar, wind, and hydroelectric power. This shift will significantly reduce our carbon emissions and dependence on fossil fuels. Second, we need to focus on sustainable urban planning and transportation. This includes developing energy-efficient buildings, promoting public transit, and encouraging the use of electric vehicles. Third, we must protect and restore our natural ecosystems, particularly forests and oceans, which act as crucial carbon sinks. Additionally, we need to revolutionize our agricultural practices, promoting sustainable farming methods that reduce emissions and increase resilience to changing climate conditions. Lastly, international cooperation is essential. We need global agreements and policies that hold nations accountable for their emissions and support developing countries in their transition to green economies. By implementing these solutions, we can mitigate the worst effects of climate change and create a sustainable future for generations to come.`,
    timeLimit: 90,
    keywords: [
      "Climate change",
      "renewable energy",
      "solar",
      "wind",
      "hydroelectric",
      "carbon emissions",
      "fossil fuels",
      "sustainable",
      "energy-efficient",
      "public transit",
      "electric vehicles",
      "ecosystems",
      "forests",
      "oceans",
      "carbon sinks",
      "agricultural",
      "emissions",
      "resilience",
      "international cooperation",
      "global agreements",
      "sustainable future",
    ],
  },
  {
    id: "3",
    title: "The Future of Space Exploration",
    script: `The future of space exploration is incredibly exciting and holds immense potential for scientific discovery and human advancement. As we look to the stars, several key areas are shaping the future of space exploration. First, there's the ongoing mission to Mars. Space agencies and private companies are working tirelessly to send humans to the Red Planet, which could happen within the next decade. This mission isn't just about reaching Mars, but about learning how to sustain human life on another planet, a crucial step for the long-term survival of our species. Second, we're seeing a renewed interest in lunar exploration. The Moon could serve as a stepping stone for deeper space missions and could also be a source of valuable resources. Third, the search for exoplanets and potential extraterrestrial life continues to captivate scientists and the public alike. Advanced telescopes and detection methods are allowing us to discover more potentially habitable planets than ever before. Fourth, the commercialization of space is opening up new possibilities. Private companies are now launching satellites, planning space tourism ventures, and even considering asteroid mining. Lastly, advancements in propulsion technology, like ion drives and potential fusion engines, could dramatically reduce travel times in space, making distant destinations more accessible. As we continue to push the boundaries of space exploration, we're not just learning about the universe - we're also developing technologies that can benefit life here on Earth, from satellite communications to medical advancements. The future of space exploration is bright, and its potential benefits for humanity are truly out of this world.`,
    timeLimit: 120,
    keywords: [
      "space exploration",
      "scientific discovery",
      "Mars",
      "Red Planet",
      "lunar exploration",
      "Moon",
      "exoplanets",
      "extraterrestrial life",
      "telescopes",
      "commercialization",
      "satellites",
      "space tourism",
      "asteroid mining",
      "propulsion technology",
      "ion drives",
      "fusion engines",
      "universe",
      "satellite communications",
      "medical advancements",
    ],
  },
]

const mockLeaderboard = [
  { name: "Alex", level: 8, score: 950 },
  { name: "Sam", level: 7, score: 820 },
  { name: "Jordan", level: 6, score: 750 },
  { name: "Taylor", level: 5, score: 680 },
  { name: "Casey", level: 4, score: 550 },
]

export default function Challenges() {
  const navigate = useNavigate()
  let theme = "dark"
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeScript | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState({ wpm: 0, accuracy: 0, total: 0 })
  const [userLevel, setUserLevel] = useState(1)
  const [userScore, setUserScore] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [speechProgress, setSpeechProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentWord, setCurrentWord] = useState("")

  const timerRef = useRef<any>(null)
  const speechRecognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<any>(null)
  const utteranceRef = useRef<any>(null)

  useEffect(() => {
    console.log("cursor position", cursorPosition)
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      speechRecognitionRef.current = new SpeechRecognition()
      speechRecognitionRef.current.continuous = true
      speechRecognitionRef.current.interimResults = true

      speechRecognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const fullTranscript = (finalTranscript + " " + interimTranscript).trim()
        setTranscript(fullTranscript)

        if (currentChallenge) {
          const challengeWords = currentChallenge.script.toLowerCase().split(/\s+/)
          const spokenWords = fullTranscript.toLowerCase().split(/\s+/)

          let matchedWords = 0
          let lastMatchedIndex = -1

          for (let i = 0; i < spokenWords.length; i++) {
            const wordIndex = challengeWords.indexOf(spokenWords[i], lastMatchedIndex + 1)
            if (wordIndex > -1) {
              matchedWords++
              lastMatchedIndex = wordIndex
            }
          }

          setSpeechProgress(matchedWords)
          setCurrentWord(challengeWords[matchedWords] || "")
        }
      }
      speechRecognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          setTimeout(() => {
            speechRecognitionRef.current?.start()
          }, 500)
        }
      }
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentChallenge, isRecording, isPaused])

  const startChallenge = (challenge: ChallengeScript | null = null) => {
    if (challenge) {
      setCurrentChallenge(challenge)
    }
    if (!currentChallenge && !challenge) return

    const selectedChallenge: any = challenge || currentChallenge
    setTimeLeft(selectedChallenge.timeLimit)
    setTranscript("")
    setSpeechProgress(0)
    setIsRecording(true)
    setIsPaused(false)
    setScore({ wpm: 0, accuracy: 0, total: 0 })
    setCursorPosition(0)
    setCurrentWord("")

    setTimeout(() => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
      }
    }, 100)

    startTimers()
  }

  const stopChallenge = () => {
    setIsRecording(false)
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    stopSpeaking()
    calculateScore()
  }

  const normalizeText = (text: string) => {
    return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
  }

  const calculateScore = () => {
    if (!currentChallenge) return

    const normalizedTranscript = normalizeText(transcript)
    const normalizedScript = normalizeText(currentChallenge.script)

    // Calculate Words Per Minute (WPM)
    const words = normalizedTranscript.split(/\s+/).length
    const minutes = (currentChallenge.timeLimit - timeLeft) / 60
    const wpm = Math.round(words / minutes)

    // Calculate accuracy using Levenshtein distance
    const accuracy = Math.round(
      (1 - levenshteinDistance(normalizedTranscript, normalizedScript) / normalizedScript.length) * 100,
    )

    // Check if all keywords were mentioned
    const allKeywordsUsed = currentChallenge.keywords.every((keyword) =>
      normalizedTranscript.includes(normalizeText(keyword)),
    )

    // Calculate total score
    const totalScore = allKeywordsUsed && timeLeft > 0 ? Math.round((wpm + accuracy) / 2) : 0

    setScore({ wpm, accuracy, total: totalScore })

    if (totalScore > 0) {
      setCompletedChallenges([...completedChallenges, currentChallenge.id])

      // Update user level and score
      const newUserScore = userScore + totalScore
      setUserScore(newUserScore)
      setUserLevel(Math.floor(newUserScore / 100) + 1)

      // Show congratulatory popup
      setShowCongrats(true)
      setTimeout(() => setShowCongrats(false), 3000)
    }
  }

  // Levenshtein distance function for calculating string similarity
  const levenshteinDistance = (a: string, b: string) => {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null))

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + substitutionCost)
      }
    }

    return matrix[b.length][a.length]
  }

  const highlightText = (text: string, progress: number) => {
    const words = text.split(/(\s+)/)
    let matchedCount = 0

    return words.map((word, index) => {
      const isWord = word.trim().length > 0
      if (!isWord) {
        return <span key={index}>{word}</span>
      }

      if (transcript.toLowerCase().includes(word.toLowerCase()) && matchedCount < progress) {
        matchedCount++
        return (
          <span key={index} className="text-green-500 font-bold" aria-label={`Spoken: ${word}`}>
            {word}
          </span>
        )
      } else if (matchedCount === progress) {
        return (
          <span key={index} className="bg-blue-500 text-white font-bold" aria-label={`Current word: ${word}`}>
            {word}
          </span>
        )
      } else {
        return (
          <span key={index} aria-label={word}>
            {word}
          </span>
        )
      }
    })
  }

  const pauseChallenge = () => {
    setIsPaused(true)
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const unpauseChallenge = () => {
    setIsPaused(false)
    setTimeout(() => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
      }
      startTimers()
    }, 100)
  }

  const restartChallenge = () => {
    if (currentChallenge) {
      startChallenge(currentChallenge)
    }
  }

  const startTimers = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopChallenge()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const speakText = useCallback((text: string) => {
    if (!speechSynthesisRef.current) {
      speechSynthesisRef.current = window.speechSynthesis
    }

    if (utteranceRef.current) {
      speechSynthesisRef.current.cancel()
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text)
    utteranceRef.current.rate = 1
    utteranceRef.current.onend = () => setIsSpeaking(false)
    utteranceRef.current.onerror = (event: any) => {
      console.error("SpeechSynthesisUtterance error", event)
      setIsSpeaking(false)
    }

    setIsSpeaking(true)
    speechSynthesisRef.current.speak(utteranceRef.current)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current && isSpeaking) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [isSpeaking])

  const toggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking()
    } else if (currentChallenge) {
      speakText(currentChallenge.script)
    }
  }, [isSpeaking, currentChallenge, speakText, stopSpeaking])

  useEffect(() => {
    setCursorPosition(speechProgress)
  }, [speechProgress])

  return (

    <div
      className={`min-h-screen  ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"
      } p-6`}
    >

      <Header />
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className={`${theme === "dark" ? "text-gray-300 hover:text-teal-300" : "text-gray-600 hover:text-teal-700"}`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        {/* <ThemeToggle /> */}
      </div>

      <h1
        className={`text-4xl font-bold mb-8 ${
          theme === "dark"
            ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400"
            : "text-teal-700"
        }`}
      >
        Speech Challenges
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {currentChallenge ? (
            <Card className={`mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <CardHeader>
                <CardTitle>{currentChallenge.title}</CardTitle>
              </CardHeader>
              {!isRecording && (
                <div className="mt-4 mb-6">
                  <Button
                    onClick={() => startChallenge(currentChallenge)}
                    className={`w-full ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600"
                        : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    } transition-all duration-300 text-white`}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Challenge
                  </Button>
                </div>
              )}
              <CardContent>
                {isRecording && (
                  <div
                    className={`mb-4 h-16 flex items-center justify-center rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                    }`}
                  >
                    <span className={`text-4xl font-bold ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>
                      {currentWord}
                    </span>
                  </div>
                )}
                <div className="mb-4 p-4 rounded-lg bg-opacity-50 bg-gray-700 text-sm">
                  {highlightText(currentChallenge.script, speechProgress)}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">{timeLeft}s</div>
                  <div className="flex items-center space-x-2">
                    {isRecording && !isPaused && <Button onClick={pauseChallenge}>Pause</Button>}
                    {isRecording && isPaused && <Button onClick={unpauseChallenge}>Unpause</Button>}
                    <Button onClick={restartChallenge}>Restart</Button>
                    <Button onClick={stopChallenge} disabled={!isRecording}>
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop Challenge
                    </Button>
                    <Button onClick={toggleSpeaking}>{isSpeaking ? "Stop TTS" : "Start TTS"}</Button>
                  </div>
                </div>
                <Progress value={(timeLeft / currentChallenge.timeLimit) * 100} className="mb-4" />
                {score.total > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold">Words Per Minute</h3>
                      <p>{score.wpm}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Accuracy</h3>
                      <p>{score.accuracy}%</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Total Score</h3>
                      <p>{score.total}%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challengeScripts.map((challenge) => (
                <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card
                    className={`${
                      theme === "dark"
                        ? "bg-gray-800 bg-opacity-50 border-teal-800"
                        : "bg-white bg-opacity-70 border-teal-200"
                    } backdrop-filter backdrop-blur-lg rounded-xl p-6 h-full transition-all duration-300 hover:bg-opacity-70 hover:scale-105 border shadow-lg ${
                      theme === "dark" ? "shadow-teal-900/20" : "shadow-teal-200/50"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className={`text-xl ${theme === "dark" ? "text-teal-200" : "text-teal-700"}`}>
                        {challenge.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        Time Limit: {challenge.timeLimit} seconds
                      </p>
                      <Button
                        onClick={() => setCurrentChallenge(challenge)}
                        disabled={completedChallenges.includes(challenge.id)}
                        className={`w-full ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600"
                            : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                        } transition-all duration-300 text-white`}
                      >
                        {completedChallenges.includes(challenge.id) ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Select Challenge
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card className={`mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Trophy className={`mr-2 h-6 w-6 ${theme === "dark" ? "text-yellow-500" : "text-yellow-600"}`} />
                <span className="text-lg font-semibold">Level {userLevel}</span>
              </div>
              <Progress value={userScore % 100} className="mb-2" />
              <p className="text-sm text-gray-500">
                {userScore} / {userLevel * 100} XP
              </p>
              <p className="mt-4">
                Completed Challenges: {completedChallenges.length} / {challengeScripts.length}
              </p>
            </CardContent>
          </Card>

          <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {mockLeaderboard.map((player, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span>{player.name}</span>
                    <span>
                      Level {player.level} - {player.score} XP
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              ${theme === "dark" ? "bg-gray-800" : "bg-white"} 
              p-8 rounded-lg shadow-lg text-center`}
          >
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p>You've completed the challenge!</p>
            <p className="mt-2">Score: {score.total}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
