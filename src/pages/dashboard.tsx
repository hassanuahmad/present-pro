"use client"

import { useState } from "react"
import {useNavigate} from "react-router"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Mic, BarChart, Trophy, Menu } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let theme = "dark";

  const menuItems = [
    { name: "Challenges", icon: Trophy, route: "/app/challenges" },
    { name: "Profile", icon: FileText, route: "/app/profile" },
    { name: "Settings", icon: BarChart, route: "/app/settings" },
  ]

  const features = [
    { name: "Prepare", icon: FileText, description: "Create and organize your content", route: "/app/prepare" },
    { name: "Practice", icon: Mic, description: "Rehearse with AI feedback", route: "/practice" },
    { name: "Analyze", icon: BarChart, description: "Track your improvement", route: "/app/analyze" },
    { name: "Challenges", icon: Trophy, description: "Complete daily tasks", route: "/app/challenges" },
  ]

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200" : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"}`}
    >
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className={`text-3xl font-bold ${theme === "dark" ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400" : "text-teal-700"}`}
          >
            PresentPro
          </h1>
          <div className="flex items-center space-x-2">
            {/* <ThemeToggle /> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${theme === "dark" ? "text-gray-300 hover:text-teal-300" : "text-gray-600 hover:text-teal-700"}`}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute top-20 right-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} rounded-lg shadow-lg p-4 z-10`}
        >
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${theme === "dark" ? "text-gray-200 hover:text-teal-300" : "text-gray-800 hover:text-teal-700"}`}
                  onClick={() => navigate(item.route)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}

      <main className="max-w-7xl mx-auto py-12 px-6">
        <h2
          className={`text-5xl font-bold text-center mb-12 ${theme === "dark" ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400" : "text-teal-700"}`}
        >
          Welcome to Your Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`${theme === "dark" ? "bg-gray-800 bg-opacity-50 border-teal-800" : "bg-white bg-opacity-70 border-teal-200"} backdrop-filter backdrop-blur-lg rounded-xl p-6 h-full transition-all duration-300 group-hover:bg-opacity-70 group-hover:scale-105 border shadow-lg ${theme === "dark" ? "shadow-teal-900/20" : "shadow-teal-200/50"}`}
              >
                <feature.icon className={`h-12 w-12 mb-4 ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-teal-200" : "text-teal-700"}`}>
                  {feature.name}
                </h3>
                <p className={`mb-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {feature.description}
                </p>
                <Button
                  className={`w-full ${theme === "dark" ? "bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600" : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"} transition-all duration-300 text-white`}
                  onClick={() => navigate(feature.route)}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className={`mt-12 py-6 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <p>&copy; 2025 PresentPro. All rights reserved.</p>
      </footer>
    </div>
  )
}

