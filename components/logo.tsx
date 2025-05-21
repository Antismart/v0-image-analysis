"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  // Adjust colors for dark mode
  const primaryColor =
    variant === "default"
      ? isDark
        ? "#ff8534"
        : "#f97316" // Brighter orange in dark mode
      : "#ffffff"

  const secondaryColor =
    variant === "default"
      ? isDark
        ? "#12d898"
        : "#10b981" // Brighter teal in dark mode
      : "#ffffff"

  const tertiaryColor =
    variant === "default"
      ? isDark
        ? "#ffa34e"
        : "#fb923c" // Brighter light orange in dark mode
      : "#ffffff"

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
      aria-hidden="true"
    >
      {/* Main circle representing community/togetherness */}
      <circle cx="20" cy="20" r="18" stroke={primaryColor} strokeWidth="2.5" />

      {/* Three connected elements representing people/events coming together */}
      <circle cx="15" cy="15" r="5" fill={secondaryColor} />
      <circle cx="25" cy="15" r="5" fill={primaryColor} />
      <circle cx="20" cy="25" r="5" fill={tertiaryColor} />

      {/* Connection lines */}
      <line x1="15" y1="15" x2="25" y2="15" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
      <line x1="15" y1="15" x2="20" y2="25" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
      <line x1="25" y1="15" x2="20" y2="25" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
    </svg>
  )
}

export function LogoWithText({ className, size = "md", variant = "default" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  }

  const textColor =
    variant === "default" ? (isDark ? "text-pamoja-400" : "text-pamoja-600 dark:text-pamoja-400") : "text-white"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={size} variant={variant} />
      <span className={cn("font-bold tracking-tight", textColor, sizes[size])}>Pamoja Events</span>
    </div>
  )
}
