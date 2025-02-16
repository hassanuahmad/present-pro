import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Mic, BarChart2, TrendingUp, ArrowRight } from "lucide-react"
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

export default function AnalyzeDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useUser()
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  let theme = "dark"

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://${import.meta.env.VITE_ENDPOINT_URL}/history/${user?.id}/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis')
        }

        const data = await response.json()
        setAnalysis(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && id) {
      fetchAnalysis()
    }
  }, [user?.id, id])

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (!analysis) {
    return <div className="text-center py-4">Analysis not found</div>
  }

  // Parse the frequency data string into an array of tuples
  const freqData = JSON.parse(analysis.freq_60.replace(/'/g, '"'))

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
              onClick={() => navigate("/analyze")}
              className={`${theme === "dark" ? "text-gray-300 hover:text-teal-300" : "text-gray-600 hover:text-teal-700"}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
            </Button>
            <CardTitle
              className={`text-2xl font-bold text-center ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
            >
              Speech Analysis Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={Mic} 
                title="Total Words" 
                value={analysis.global_word_count}
                theme={theme} 
              />
              <StatCard 
                icon={BarChart2} 
                title="WPM (30s)" 
                value={analysis.wpm_30}
                theme={theme} 
              />
              <StatCard
                icon={TrendingUp}
                title="Filler Words %"
                value={analysis.global_filler_pct.toFixed(1) + '%'}
                theme={theme}
              />
              <StatCard
                icon={Trophy}
                title="Readability"
                value={analysis.global_readability.toFixed(1)}
                theme={theme}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Transcript
                </h3>
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  {analysis.transcript}
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Most Frequent Words/Symbols (60s)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {freqData.map(([word, count]: [string, number], index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                      <div className="text-lg font-semibold">{word}</div>
                      <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Count: {count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  title="30-Second Analysis"
                  items={[
                    { label: "WPM", value: analysis.wpm_30 },
                    { label: "Filler Words", value: analysis.filler_count_30 },
                    { label: "Filler %", value: analysis.filler_pct_30.toFixed(1) + '%' },
                  ]}
                  theme={theme}
                />
                <InfoCard
                  title="60-Second Analysis"
                  items={[
                    { label: "Readability", value: analysis.readability_60.toFixed(1) },
                    { label: "Total Pauses", value: analysis.total_pauses },
                  ]}
                  theme={theme}
                />
                <InfoCard
                  title="Global Analysis"
                  items={[
                    { label: "Total Words", value: analysis.global_word_count },
                    { label: "Filler Words", value: analysis.global_filler_count },
                    { label: "Filler %", value: analysis.global_filler_pct.toFixed(1) + '%' },
                    { label: "Readability", value: analysis.global_readability.toFixed(1) },
                  ]}
                  theme={theme}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type StatsCardProps = {
  icon: any
  title: string
  value: any
  theme: string
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

type InfoCardProps = {
  title: string
  items: Array<{ label: string; value: any }>
  theme: string
}

function InfoCard({ title, items, theme }: InfoCardProps) {
  return (
    <Card className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{item.label}</span>
              <span className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
