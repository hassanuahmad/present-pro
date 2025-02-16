import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, BarChart2, Volume2, TrendingUp } from "lucide-react"
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

export default function IndividualSpeechAnalysis() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { user } = useUser()
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  let theme = "dark"

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        console.log('Fetching analysis for ID:', id)
        const response = await fetch(`https://${import.meta.env.VITE_ENDPOINT_URL}/history/${user?.id}/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis')
        }

        const data = await response.json()
        console.log('Analysis data:', data)
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
                Speech Analysis
              </h2>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {analysis ? new Date(analysis.created_at).toLocaleString() : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard 
                icon={Clock} 
                title="Total Words" 
                value={analysis?.global_word_count} 
                theme={theme} 
              />
              <StatCard 
                icon={BarChart2} 
                title="WPM (30s)" 
                value={analysis?.wpm_30} 
                theme={theme} 
              />
              <StatCard
                icon={Volume2}
                title="Filler Words"
                value={`${analysis?.global_filler_count} (${analysis?.global_filler_pct.toFixed(1)}%)`}
                theme={theme}
              />
              <StatCard
                icon={TrendingUp}
                title="Readability"
                value={analysis?.global_readability.toFixed(1)}
                theme={theme}
              />
            </div>

            <div className="mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Transcript
              </h3>
              <div className={`p-4 rounded-lg h-64 overflow-y-auto ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {analysis?.transcript}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard
                title="30-Second Analysis"
                items={[
                  { label: "WPM", value: analysis?.wpm_30 },
                  { label: "Filler Words", value: analysis?.filler_count_30 },
                  { label: "Filler %", value: analysis?.filler_pct_30.toFixed(1) + '%' },
                ]}
                theme={theme}
              />
              <InfoCard
                title="60-Second Analysis"
                items={[
                  { label: "Readability", value: analysis?.readability_60.toFixed(1) },
                  { label: "Total Pauses", value: analysis?.total_pauses },
                ]}
                theme={theme}
              />
              <InfoCard
                title="Global Analysis"
                items={[
                  { label: "Total Words", value: analysis?.global_word_count },
                  { label: "Filler Words", value: analysis?.global_filler_count },
                  { label: "Filler %", value: analysis?.global_filler_pct.toFixed(1) + '%' },
                  { label: "Readability", value: analysis?.global_readability.toFixed(1) },
                ]}
                theme={theme}
              />
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

function StatCard({ icon: Icon, title, value, theme }: StatsCardProps) {
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
