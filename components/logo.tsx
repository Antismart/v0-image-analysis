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
    sm: "h-12 w-32",
    md: "h-16 w-40",
    lg: "h-20 w-48",
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

  const textColor =
    variant === "default"
      ? isDark
        ? "#ff8534"
        : "#f97316"
      : "#ffffff"

  return (
    <svg
      viewBox="0 0 160 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
      aria-hidden="true"
    >
      {/* Main circle representing community/togetherness */}
      <circle cx="25" cy="25" r="18" stroke={primaryColor} strokeWidth="2.5" />

      {/* Three connected elements representing people/events coming together */}
      <circle cx="20" cy="20" r="5" fill={secondaryColor} />
      <circle cx="30" cy="20" r="5" fill={primaryColor} />
      <circle cx="25" cy="30" r="5" fill={tertiaryColor} />

      {/* Connection lines */}
      <line x1="20" y1="20" x2="30" y2="20" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
      <line x1="20" y1="20" x2="25" y2="30" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
      <line x1="30" y1="20" x2="25" y2="30" stroke={isDark ? "#2d2d2d" : "white"} strokeWidth="1.5" />
      
      {/* Company name */}
      <text x="55" y="30" fontSize="14" fill={textColor} fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold">
        Pamoja Events
      </text>
    </svg>
  )
}

export function LogoWithText({ className, size = "md", variant = "default" }: LogoProps) {
  // This component is now redundant since Logo includes the text
  // But keeping it for backward compatibility
  return <Logo className={className} size={size} variant={variant} />
}