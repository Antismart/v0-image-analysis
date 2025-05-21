"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

/**
 * This component adds dynamic dark mode styles to the document
 * to enhance the dark mode experience beyond what CSS variables can do
 */
export function DarkModeStyles() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const isLight = resolvedTheme === "light"

  useEffect(() => {
    // Add appropriate class to the document element based on theme
    if (isDark) {
      document.documentElement.classList.add("dark-mode-enhanced")
      document.documentElement.classList.remove("light-mode-enhanced")
    } else if (isLight) {
      document.documentElement.classList.remove("dark-mode-enhanced")
      document.documentElement.classList.add("light-mode-enhanced")
    }

    // Clean up any existing style elements
    const existingDarkStyle = document.getElementById("dark-mode-scrollbars")
    const existingLightStyle = document.getElementById("light-mode-styles")

    if (existingDarkStyle) existingDarkStyle.remove()
    if (existingLightStyle) existingLightStyle.remove()

    // Apply theme specific styles
    if (isDark) {
      // Dark mode specific styles
      const style = document.createElement("style")
      style.id = "dark-mode-scrollbars"
      style.textContent = `
        ::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        ::-webkit-scrollbar-track {
          background: hsl(20 14.3% 8%);
        }
        ::-webkit-scrollbar-thumb {
          background: hsl(20 14.3% 20%);
          border: 3px solid hsl(20 14.3% 8%);
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(20 14.3% 25%);
        }
        
        /* Subtle dark mode selection color */
        ::selection {
          background-color: hsla(24, 94%, 53%, 0.3);
          color: white;
        }
      `
      document.head.appendChild(style)
    } else if (isLight) {
      // Light mode specific styles
      const style = document.createElement("style")
      style.id = "light-mode-styles"
      style.textContent = `
        ::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        ::-webkit-scrollbar-track {
          background: hsl(0 0% 96%);
        }
        ::-webkit-scrollbar-thumb {
          background: hsl(20 5% 80%);
          border: 3px solid hsl(0 0% 96%);
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(20 5% 70%);
        }
        
        /* Light mode selection color */
        ::selection {
          background-color: hsla(24, 94%, 53%, 0.2);
          color: black;
        }
      `
      document.head.appendChild(style)
    }
  }, [isDark, isLight])

  return null
}
