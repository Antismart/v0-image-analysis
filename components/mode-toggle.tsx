"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    setIsDark(initialDark)

    // Apply initial theme
    if (initialDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Toggle theme function
  const toggleTheme = () => {
    if (isDark) {
      // Switch to light
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      // Switch to dark
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="border-gray-200 dark:border-gray-800">
      {isDark ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-pamoja-400" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-pamoja-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
