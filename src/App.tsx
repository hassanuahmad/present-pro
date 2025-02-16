"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, BarChart, Trophy } from "lucide-react"
import { Header } from "@/components/Header"
import { useNavigate } from "react-router"
import { Button } from "./components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  let theme = "dark"
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    { icon: Mic, title: "AI-Powered Practice", description: "Get real-time feedback on your presentations" },
    {
      icon: BarChart,
      title: "Detailed Analytics",
      description: "Track your progress and identify areas for improvement",
    },
    { icon: Trophy, title: "Daily Challenges", description: "Sharpen your skills with engaging daily tasks" },
  ]

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200" : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"}`}
    >
      <Header theme={theme} />

      <main className="max-w-7xl mx-auto py-12 px-6">
        <section className="text-center mb-24">
          <motion.h2
            className={`text-5xl md:text-7xl font-bold mb-6 ${theme === "dark" ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400" : "text-teal-700"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Master the Art of Presentation
          </motion.h2>
          <motion.p
            className={`text-xl md:text-2xl mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Elevate your speaking skills with AI-powered feedback and personalized coaching
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className={`${theme === "dark" ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"} text-white text-lg px-8 py-4`}
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </section>

        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-70"} backdrop-filter backdrop-blur-lg shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className={`h-12 w-12 mb-4 ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-teal-300" : "text-teal-700"}`}>
                  {feature.title}
                </h3>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <motion.div
            className="relative h-96 rounded-lg overflow-hidden"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                rotateX: scrollY * 0.1,
                rotateY: scrollY * 0.1,
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: theme === "dark" ? "#2dd4bf" : "#0d9488", stopOpacity: 1 }} />
                    <stop
                      offset="100%"
                      style={{ stopColor: theme === "dark" ? "#0891b2" : "#0e7490", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#gradient)"
                  d="M47.7,-57.2C59.5,-47.3,65.9,-30.9,67.2,-14.6C68.5,1.6,64.7,17.7,56.6,31.1C48.6,44.6,36.4,55.3,21.9,61.3C7.4,67.3,-9.3,68.5,-23.6,63.5C-37.9,58.5,-49.8,47.3,-57.8,33.5C-65.7,19.7,-69.7,3.3,-67.1,-12.2C-64.5,-27.7,-55.3,-42.3,-42.8,-52C-30.3,-61.7,-15.2,-66.5,1,-67.7C17.2,-68.9,34.5,-64.5,47.7,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h3 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-teal-900"}`}>
                  Transform Your Skills
                </h3>
                <p className={`text-xl ${theme === "dark" ? "text-gray-200" : "text-teal-800"}`}>
                  Watch your confidence soar as you practice and improve
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="text-center mb-24">
          <h2
            className={`text-4xl font-bold mb-8 ${theme === "dark" ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400" : "text-teal-700"}`}
          >
            Ready to Become a Presentation Pro?
          </h2>
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className={`${theme === "dark" ? "bg-teal-500 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700"} text-white text-lg px-8 py-4`}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>

      <footer className={`mt-12 py-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <p>&copy; 2025 PresentPro. All rights reserved.</p>
      </footer>
    </div>
  )
}

