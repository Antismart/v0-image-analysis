import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
}

export function WelcomeIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[500px]", className)}>
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background elements */}
        <circle cx="250" cy="200" r="150" fill="#f97316" fillOpacity="0.1" />
        <circle cx="250" cy="200" r="100" fill="#10b981" fillOpacity="0.1" />

        {/* Event venue building */}
        <rect
          x="150"
          y="150"
          width="200"
          height="150"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="190"
          y="250"
          width="120"
          height="50"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-700"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect x="230" y="250" width="40" height="50" fill="#f97316" fillOpacity="0.2" />

        {/* Roof */}
        <polygon points="150,150 250,100 350,150" fill="#f97316" fillOpacity="0.7" />

        {/* Windows */}
        <rect x="180" y="170" width="30" height="30" rx="2" fill="#10b981" fillOpacity="0.5" />
        <rect x="235" y="170" width="30" height="30" rx="2" fill="#10b981" fillOpacity="0.5" />
        <rect x="290" y="170" width="30" height="30" rx="2" fill="#10b981" fillOpacity="0.5" />

        {/* People silhouettes */}
        <circle cx="200" cy="320" r="15" fill="#f97316" />
        <rect x="190" y="335" width="20" height="30" rx="10" fill="#f97316" />

        <circle cx="240" cy="320" r="15" fill="#10b981" />
        <rect x="230" y="335" width="20" height="30" rx="10" fill="#10b981" />

        <circle cx="280" cy="320" r="15" fill="#fb923c" />
        <rect x="270" y="335" width="20" height="30" rx="10" fill="#fb923c" />

        {/* Decorative elements */}
        <circle cx="150" cy="100" r="20" fill="#10b981" fillOpacity="0.3" />
        <circle cx="350" cy="100" r="20" fill="#f97316" fillOpacity="0.3" />

        {/* Calendar */}
        <rect
          x="380"
          y="200"
          width="60"
          height="70"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect x="390" y="190" width="8" height="20" rx="2" fill="#f97316" />
        <rect x="422" y="190" width="8" height="20" rx="2" fill="#f97316" />
        <line x1="380" y1="220" x2="440" y2="220" stroke="#f97316" strokeWidth="2" />

        {/* Chat bubbles */}
        <rect x="80" y="200" width="50" height="40" rx="20" fill="#10b981" />
        <polygon points="80,220 70,240 90,220" fill="#10b981" />

        <rect x="60" y="250" width="60" height="40" rx="20" fill="#f97316" />
        <polygon points="120,270 130,290 110,270" fill="#f97316" />
      </svg>
    </div>
  )
}
