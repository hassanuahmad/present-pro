import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, BarChart2, Volume2 } from "lucide-react"
import { Header } from "@/components/Header"

// Mock data for demonstration purposes
const mockData = {
  speechHistory: [
    {
      date: "2024-10-26",
      topic: "State of the Union",
      duration: "1:12:34",
      fillerWords: 25,
      wordsPerMinute: 150,
      transcript:
        "Esteemed colleagues, members of the press, and citizens of our great nation. Today, I stand before you to address the state of our union.  Um, it's a time of both challenges and opportunities.  We face economic headwinds, uh, but we also have the potential for unprecedented growth.  Like, we need to work together to overcome these obstacles. You know, it won't be easy, but I believe in the resilience of the American people. Actually, I'm confident that we can achieve great things if we collaborate effectively.  We must invest in infrastructure, education, and healthcare.  Um, these are critical areas that will shape our future.  Uh, we also need to address climate change and promote sustainable practices.  Like, this is a responsibility we owe to future generations. You know, we can't afford to delay action any longer. Actually, the time to act is now.  Thank you.",
      fillerWordsList: ["um", "uh", "like", "you know", "actually"],
    },
    {
      date: "2024-11-15",
      topic: "Climate Change Initiatives",
      duration: "45:00",
      fillerWords: 12,
      wordsPerMinute: 160,
      transcript:
        "Good morning, everyone. Today, we'll be discussing the latest climate change initiatives.  Um, as you know, this is a critical issue facing our planet.  Uh, we need to take immediate action to mitigate the effects of climate change.  Like, we can't afford to wait any longer. You know, the consequences are too severe. Actually, we need to transition to renewable energy sources.  We must invest in research and development of clean technologies.  Um, we also need to promote sustainable practices in all sectors of the economy.  Uh, this will require a collaborative effort from governments, businesses, and individuals.  Like, we all have a role to play. You know, we need to work together to create a sustainable future. Actually, the future of our planet depends on it. Thank you.",
      fillerWordsList: ["um", "uh", "like", "you know", "actually"],
    },
  ],
}

const mockSpeechData = {
  id: "1",
  date: "2025-02-10",
  topic: "Introduction to AI",
  duration: "6:12",
  fillerWords: 15,
  wordsPerMinute: 130,
  transcript:
    "Welcome to this presentation on Artificial Intelligence. Today, we'll be discussing the fundamentals of AI and its impact on various industries. Um, let's start with a brief overview. AI, or Artificial Intelligence, refers to the simulation of human intelligence in machines. These machines are programmed to think and learn like humans, enabling them to perform tasks that typically require human intelligence. Some key areas of AI include machine learning, natural language processing, and computer vision. Uh, now let's dive into some specific applications. In healthcare, AI is revolutionizing diagnosis and treatment planning. For example, AI algorithms can analyze medical images to detect diseases earlier and more accurately than human doctors in some cases. In finance, AI is being used for fraud detection, algorithmic trading, and personalized banking experiences. Um, another exciting area is autonomous vehicles. Companies like Tesla and Waymo are using AI to develop self-driving cars that can navigate complex road conditions. As we look to the future, AI will continue to transform industries and create new opportunities. However, it's important to consider the ethical implications and potential challenges that come with this technology. In conclusion, Artificial Intelligence is a rapidly evolving field with enormous potential to change the way we live and work. Thank you for your attention, and I'm happy to answer any questions you may have.",
  fillerWordsList: ["um", "uh", "like", "you know", "actually"],
}

export default function IndividualSpeechAnalysis() {
  const navigate = useNavigate()
  let theme = "dark"
  const [speechData, setSpeechData] = useState(mockSpeechData)
  const { id } = useParams()

  useEffect(() => {
    const speechIndex = id ? Number.parseInt(id, 10) - 1 : 0
    const speechData: any = {
      ...mockSpeechData,
      ...mockData.speechHistory[speechIndex],
      id,
      fillerWordsList: mockSpeechData.fillerWordsList,
    }
    setSpeechData(speechData)
  }, [id])

  const highlightFillerWords = (text: string, fillerWords: string[]) => {
    const words = text.split(/\s+/)
    return words.map((word, index) => {
      const isFillerWord = fillerWords.some((filler) => word.toLowerCase().includes(filler.toLowerCase()))
      return (
        <span
          key={index}
          className={isFillerWord ? `font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}` : ""}
        >
          {word}{" "}
        </span>
      )
    })
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"
      } p-6`}
    >
      <Header theme={theme} />
      <div className="p-6">
        <Card className={`max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/analyze")}
              className={`${
                theme === "dark" ? "text-gray-300 hover:text-teal-300" : "text-gray-600 hover:text-teal-700"
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
            </Button>
            <CardTitle
              className={`text-2xl font-bold text-center ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
            >
              Speech Analysis
            </CardTitle>
            {/* <ThemeToggle /> */}
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {speechData.topic}
              </h2>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{speechData.date}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={Clock} title="Duration" value={speechData.duration} theme={theme} />
              <StatCard icon={BarChart2} title="Filler Words" value={speechData.fillerWords.toString()} theme={theme} />
              <StatCard
                icon={Volume2}
                title="Words per Minute"
                value={speechData.wordsPerMinute.toString()}
                theme={theme}
              />
            </div>

            <div className="mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Transcript
              </h3>
              <div className={`p-4 rounded-lg h-64 overflow-y-auto ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {highlightFillerWords(speechData.transcript, speechData.fillerWordsList)}
                </p>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Filler Words Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {speechData.fillerWordsList.map((word, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-sm ${
                      theme === "dark" ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, theme }: any) {
  return (
    <Card className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
      <CardContent className="flex items-center p-4">
        <Icon className={`h-6 w-6 mr-4 ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`} />
        <div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{title}</p>
          <p className={`text-xl font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
