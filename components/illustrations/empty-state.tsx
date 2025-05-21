import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
}

export function EmptyStateIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[300px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect x="120" y="60" width="160" height="180" rx="8" fill="#f0f0f0" className="dark:fill-gray-800" />
        <rect x="140" y="90" width="120" height="10" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="140" y="110" width="80" height="10" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />

        {/* Calendar icon */}
        <rect
          x="160"
          y="140"
          width="80"
          height="70"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect x="170" y="130" width="10" height="20" rx="2" fill="#f97316" />
        <rect x="220" y="130" width="10" height="20" rx="2" fill="#f97316" />
        <line x1="160" y1="160" x2="240" y2="160" stroke="#f97316" strokeWidth="2" />

        {/* Decorative elements */}
        <circle cx="140" cy="200" r="15" fill="#10b981" fillOpacity="0.3" />
        <circle cx="260" cy="120" r="15" fill="#f97316" fillOpacity="0.3" />
        <circle cx="180" cy="230" r="10" fill="#f97316" fillOpacity="0.5" />
        <circle cx="220" cy="230" r="10" fill="#10b981" fillOpacity="0.5" />

        {/* Magnifying glass */}
        <circle cx="280" cy="90" r="25" stroke="#10b981" strokeWidth="4" fill="transparent" />
        <line x1="298" y1="108" x2="320" y2="130" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />

        <text x="200" y="270" textAnchor="middle" fontSize="14" fill="#6b7280" className="dark:fill-gray-400">
          No events found
        </text>
      </svg>
    </div>
  )
}
