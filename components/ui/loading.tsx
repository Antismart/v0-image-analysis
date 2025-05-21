"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { useTheme } from "next-themes"

const loadingVariants = cva("relative flex items-center justify-center", {
  variants: {
    variant: {
      spinner: "animate-spin",
      dots: "gap-1",
      pulse: "",
      bar: "w-full overflow-hidden rounded-full",
    },
    size: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      bar: "h-2",
    },
  },
  defaultVariants: {
    variant: "spinner",
    size: "md",
  },
})

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  /**
   * The primary color of the loading indicator
   * @default "primary" - Uses the primary color (Pamoja orange)
   */
  color?: "primary" | "secondary" | "muted"
  /**
   * Text to be announced to screen readers
   * @default "Loading"
   */
  label?: string
  /**
   * Whether to show a text label next to the loading indicator
   * @default false
   */
  showLabel?: boolean
}

export function Loading({
  className,
  variant = "spinner",
  size = "md",
  color = "primary",
  label = "Loading",
  showLabel = false,
  ...props
}: LoadingProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Map color prop to actual color values
  const colorMap = {
    primary: {
      light: "#f97316", // pamoja-500
      dark: "#ff8534", // brighter for dark mode
    },
    secondary: {
      light: "#10b981", // unity-500
      dark: "#12d898", // brighter for dark mode
    },
    muted: {
      light: "#78716c", // stone-500
      dark: "#a8a29e", // stone-400 for dark mode
    },
  }

  const currentColor = isDark ? colorMap[color].dark : colorMap[color].light

  // Render different loading indicators based on variant
  const renderLoadingIndicator = () => {
    switch (variant) {
      case "spinner":
        return (
          <svg
            className={loadingVariants({ variant, size, className })}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )

      case "dots":
        return (
          <div className={cn(loadingVariants({ variant, size, className }), "flex")}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "animate-bounce rounded-full",
                  size === "xs" ? "h-1 w-1" : size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
                )}
                style={{
                  backgroundColor: currentColor,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s",
                }}
              ></div>
            ))}
          </div>
        )

      case "pulse":
        return (
          <div
            className={cn(
              loadingVariants({ variant, size, className }),
              "animate-pulse rounded-full",
              size === "xs" ? "h-4 w-4" : size === "sm" ? "h-5 w-5" : size === "md" ? "h-8 w-8" : "h-12 w-12",
            )}
            style={{ backgroundColor: currentColor }}
          ></div>
        )

      case "bar":
        return (
          <div className={cn(loadingVariants({ variant, size: "bar", className }), "bg-muted")}>
            <div className="h-full animate-loading-bar rounded-full" style={{ backgroundColor: currentColor }}></div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn("flex items-center gap-3", variant === "bar" ? "w-full" : "")}
      role="status"
      aria-live="polite"
      style={{ color: currentColor }}
      {...props}
    >
      {renderLoadingIndicator()}
      {showLabel && <span className="text-sm font-medium">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  loadingText?: string
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-primary/80",
        className,
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loading variant="spinner" size="xs" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function LoadingOverlay({
  visible = false,
  message = "Loading...",
  variant = "spinner",
  color = "primary",
  className,
  ...props
}: {
  visible: boolean
  message?: string
  variant?: "spinner" | "dots" | "pulse"
  color?: "primary" | "secondary" | "muted"
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-background p-6 shadow-lg dark:bg-background/90">
        <Loading variant={variant} size="lg" color={color} />
        <p className="text-center text-base font-medium">{message}</p>
      </div>
    </div>
  )
}
