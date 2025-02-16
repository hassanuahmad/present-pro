import type React from "react"

import { useTheme } from "@/contexts/themeContext"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-300 hover:text-teal-300">
      {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </Button>
  )
}
