"use client"

import { useState } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Mic, BarChart2, TrendingUp, ArrowRight } from "lucide-react"
import { Header } from "@/components/Header"

// Mock data for demonstration purposes
const mockData = {
  challengePoints: 1250,
  speechesGiven: 15,
  averageFillerWords: 12,
  averageSpeechDuration: "5:30",
  speechHistory: [
    { date: "2025-02-10", duration: "6:12", fillerWords: 15, topic: "Introduction to AI" },
    { date: "2025-02-08", duration: "4:55", fillerWords: 10, topic: "Climate Change Solutions" },
    { date: "2025-02-05", duration: "5:30", fillerWords: 8, topic: "Future of Work" },
    { date: "2025-02-01", duration: "5:45", fillerWords: 14, topic: "Sustainable Energy" },
  ],
}

export default function AnalyzePage() {
  const navigate = useNavigate()
  let theme = "dark"
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")

  const timeframes = [
    { label: "All Time", value: "all" },
    { label: "This Month", value: "month" },
    { label: "This Week", value: "week" },
  ]

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"
      }`}
    >
      <Header theme={theme} />
      <div className="p-6">
      <Card className={`max-w-6xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className={`${theme === "dark" ? "text-gray-300 hover:text-teal-300" : "text-gray-600 hover:text-teal-700"}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <CardTitle
            className={`text-2xl font-bold text-center ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
          >
            Speech Performance Analysis
          </CardTitle>
          {/* <ThemeToggle /> */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Trophy} title="Challenge Points" value={mockData.challengePoints} theme={theme} />
            <StatCard icon={Mic} title="Speeches Given" value={mockData.speechesGiven} theme={theme} />
            <StatCard icon={BarChart2} title="Avg. Filler Words" value={mockData.averageFillerWords} theme={theme} />
            <StatCard
              icon={TrendingUp}
              title="Avg. Speech Duration"
              value={mockData.averageSpeechDuration}
              theme={theme}
            />
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Speech History
            </h3>
            <div className="flex space-x-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={selectedTimeframe === tf.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
          <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Click on a row to view detailed speech analysis
          </p>
          <div className={`overflow-x-auto ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} rounded-lg`}>
            <table className="min-w-full">
              <thead>
                <tr className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Topic</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Filler Words</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {mockData.speechHistory.map((speech, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${
                      theme === "dark" ? "border-b border-gray-700" : "border-b border-gray-300"
                    } cursor-pointer hover:bg-opacity-80 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    onClick={() => navigate(`/analyze/${index + 1}`)}
                  >
                    <td className="px-4 py-2">{speech.date}</td>
                    <td className="px-4 py-2">{speech.topic}</td>
                    <td className="px-4 py-2">{speech.duration}</td>
                    <td className="px-4 py-2">{speech.fillerWords}</td>
                    <td className="px-4 py-2 text-right">
                      <ArrowRight className={`inline-block ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
1    </div>
  )
}

type StatsCardProps = {
  icon: any
  title: any
  value: any
  theme: any
}

function StatCard({ icon: Icon, title, value, theme }: StatsCardProps) {
  return (
    <Card className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
      <CardContent className="flex items-center p-4">
        <Icon className={`h-8 w-8 mr-4 ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`} />
        <div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{title}</p>
          <p className={`text-2xl font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

