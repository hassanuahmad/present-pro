"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Mic, TrendingUp, ArrowRight } from "lucide-react"
import { Header } from "@/components/Header"
import { useUser } from "@clerk/clerk-react"

interface SpeechAnalysis {
    id: number;
    user_id: string;
    transcript: string;
    wpm_30: number;
    filler_count_30: number;
    filler_pct_30: number;
    readability_60: number;
    freq_60: string;
    total_pauses: number;
    global_word_count: number;
    global_filler_count: number;
    global_filler_pct: number;
    global_readability: number;
    created_at: string;
  }
  

// Fetch speech history from API
const  useSpeechHistory = () => {
  const { user } = useUser();
  const [history, setHistory] = useState<SpeechAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://${import.meta.env.VITE_ENDPOINT_URL}/history/${user?.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  return { history, loading, error };
};

export default function AnalyzePage() {
  const navigate = useNavigate()
  const { history, loading, error } = useSpeechHistory()
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={Mic} 
              title="Total Words" 
              value={history.length > 0 ? history.reduce((acc, curr) => acc + curr.global_word_count, 0) : 0}
              theme={theme} 
            />
            <StatCard
              icon={TrendingUp}
              title="Avg. WPM (30s)"
              value={history.length > 0 ? 
                Math.round(history.reduce((acc, curr) => acc + curr.wpm_30, 0) / history.length) : 0}
              theme={theme}
            />
            <StatCard
              icon={Trophy}
              title="Avg. Readability"
              value={history.length > 0 ? 
                (history.reduce((acc, curr) => acc + curr.global_readability, 0) / history.length).toFixed(1) : '0.0'}
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
                  <th className="px-4 py-2 text-left">Words</th>
                  <th className="px-4 py-2 text-left">WPM (30s)</th>
                  <th className="px-4 py-2 text-left">Readability</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4">No speech history available</div>
          ) : history.map((speech, index) => (
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
                    onClick={() => {
                      console.log('Navigating to speech:', speech.id);
                      navigate(`/analyze/${speech.id}`);
                    }}
                  >
                    <td className="px-4 py-2">{new Date(speech.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2">{speech.global_word_count}</td>
                    <td className="px-4 py-2">{speech.wpm_30}</td>
                    <td className="px-4 py-2">{speech.global_readability.toFixed(1)}</td>
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

