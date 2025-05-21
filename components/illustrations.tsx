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

export function SuccessIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[300px]", className)}>
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="150" cy="150" r="120" fill="#10b981" fillOpacity="0.1" />

        {/* Ticket */}
        <rect
          x="75"
          y="100"
          width="150"
          height="100"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />
        <line x1="75" y1="130" x2="225" y2="130" stroke="#f97316" strokeDasharray="5 5" strokeWidth="2" />
        <line x1="75" y1="170" x2="225" y2="170" stroke="#f97316" strokeDasharray="5 5" strokeWidth="2" />
        <circle
          cx="75"
          cy="130"
          r="10"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />
        <circle
          cx="75"
          cy="170"
          r="10"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />
        <circle
          cx="225"
          cy="130"
          r="10"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />
        <circle
          cx="225"
          cy="170"
          r="10"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />

        {/* Event details */}
        <rect x="95" y="110" width="70" height="10" rx="2" fill="#f97316" fillOpacity="0.7" />
        <rect x="95" y="140" width="110" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="95" y="155" width="90" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="95" y="180" width="50" height="10" rx="2" fill="#10b981" />

        {/* Check mark */}
        <circle cx="210" cy="90" r="25" fill="#10b981" />
        <path d="M200 90 L208 98 L220 82" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Confetti */}
        <rect x="90" y="60" width="10" height="10" rx="1" fill="#f97316" transform="rotate(30 90 60)" />
        <rect x="220" y="70" width="10" height="10" rx="1" fill="#10b981" transform="rotate(-20 220 70)" />
        <rect x="180" y="50" width="8" height="8" rx="1" fill="#fb923c" transform="rotate(45 180 50)" />
        <rect x="240" y="120" width="8" height="8" rx="1" fill="#f97316" transform="rotate(10 240 120)" />
        <rect x="70" y="120" width="8" height="8" rx="1" fill="#10b981" transform="rotate(-30 70 120)" />
        <rect x="120" y="220" width="10" height="10" rx="1" fill="#f97316" transform="rotate(15 120 220)" />
        <rect x="190" y="220" width="10" height="10" rx="1" fill="#10b981" transform="rotate(-15 190 220)" />

        <text x="150" y="250" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#10b981">
          Success!
        </text>
      </svg>
    </div>
  )
}

export function CommunityIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <circle cx="200" cy="150" r="120" fill="#f97316" fillOpacity="0.1" />

        {/* Central connecting point */}
        <circle cx="200" cy="150" r="30" fill="#10b981" />

        {/* People around the circle */}
        {/* Person 1 */}
        <circle cx="120" cy="100" r="20" fill="#f97316" />
        <rect x="110" y="120" width="20" height="30" rx="10" fill="#f97316" />
        <line x1="120" y1="150" x2="180" y2="150" stroke="#f97316" strokeWidth="2" />

        {/* Person 2 */}
        <circle cx="280" cy="100" r="20" fill="#f97316" />
        <rect x="270" y="120" width="20" height="30" rx="10" fill="#f97316" />
        <line x1="280" y1="150" x2="220" y2="150" stroke="#f97316" strokeWidth="2" />

        {/* Person 3 */}
        <circle cx="120" cy="200" r="20" fill="#fb923c" />
        <rect x="110" y="220" width="20" height="30" rx="10" fill="#fb923c" />
        <line x1="120" y1="200" x2="180" y2="160" stroke="#fb923c" strokeWidth="2" />

        {/* Person 4 */}
        <circle cx="280" cy="200" r="20" fill="#fb923c" />
        <rect x="270" y="220" width="20" height="30" rx="10" fill="#fb923c" />
        <line x1="280" y1="200" x2="220" y2="160" stroke="#fb923c" strokeWidth="2" />

        {/* Person 5 */}
        <circle cx="200" cy="70" r="20" fill="#10b981" />
        <rect x="190" y="90" width="20" height="30" rx="10" fill="#10b981" />
        <line x1="200" y1="120" x2="200" y2="130" stroke="#10b981" strokeWidth="2" />

        {/* Connection lines between people */}
        <line x1="140" y1="100" x2="180" y2="100" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="220" y1="100" x2="260" y2="100" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="140" y1="200" x2="180" y2="200" stroke="#fb923c" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="220" y1="200" x2="260" y2="200" stroke="#fb923c" strokeWidth="2" strokeDasharray="4 4" />

        {/* Chat bubbles */}
        <rect
          x="90"
          y="60"
          width="40"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="270"
          y="60"
          width="40"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="90"
          y="230"
          width="40"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#fb923c"
          strokeWidth="2"
        />
        <rect
          x="270"
          y="230"
          width="40"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#fb923c"
          strokeWidth="2"
        />
        <rect
          x="180"
          y="30"
          width="40"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Event icon in the center */}
        <rect
          x="185"
          y="135"
          width="30"
          height="30"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#10b981"
          strokeWidth="2"
        />
        <line x1="185" y1="145" x2="215" y2="145" stroke="#10b981" strokeWidth="2" />
        <line x1="190" y1="150" x2="195" y2="150" stroke="#10b981" strokeWidth="2" />
        <line x1="200" y1="150" x2="210" y2="150" stroke="#10b981" strokeWidth="2" />
        <line x1="190" y1="155" x2="200" y2="155" stroke="#10b981" strokeWidth="2" />
        <line x1="190" y1="160" x2="205" y2="160" stroke="#10b981" strokeWidth="2" />
      </svg>
    </div>
  )
}

export function WalletConnectIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[300px]", className)}>
      <svg
        viewBox="0 0 300 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="200" height="150" rx="10" fill="#f97316" fillOpacity="0.1" />

        {/* Wallet */}
        <rect
          x="75"
          y="75"
          width="150"
          height="100"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />
        <rect x="75" y="75" width="150" height="30" rx="8" fill="#f97316" />
        <circle cx="150" cy="140" r="25" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />

        {/* Lock icon */}
        <rect x="135" y="130" width="30" height="25" rx="4" fill="#10b981" />
        <rect x="140" y="120" width="20" height="15" rx="7" stroke="#10b981" strokeWidth="3" fill="transparent" />
        <circle cx="150" cy="138" r="3" fill="#ffffff" />
        <line x1="150" y1="138" x2="150" y2="145" stroke="#ffffff" strokeWidth="2" />

        {/* Connection lines */}
        <path d="M150 170 L150 190 L100 190" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M150 170 L150 190 L200 190" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />

        {/* Connected devices/services */}
        <rect
          x="75"
          y="175"
          width="50"
          height="30"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="175"
          y="175"
          width="50"
          height="30"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Ethereum logo simplified */}
        <path d="M100 185 L100 195 L90 190 Z" fill="#f97316" />
        <path d="M100 185 L100 195 L110 190 Z" fill="#f97316" />

        {/* Base logo simplified */}
        <rect x="185" y="185" width="10" height="10" rx="2" fill="#10b981" />
        <rect x="195" y="185" width="10" height="10" rx="2" fill="#f97316" />
        <rect x="205" y="185" width="10" height="10" rx="2" fill="#fb923c" />

        {/* Decorative elements */}
        <circle cx="70" cy="60" r="8" fill="#10b981" fillOpacity="0.5" />
        <circle cx="230" cy="60" r="8" fill="#f97316" fillOpacity="0.5" />
        <circle cx="70" cy="190" r="8" fill="#f97316" fillOpacity="0.5" />
        <circle cx="230" cy="190" r="8" fill="#10b981" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

export function EventCreationIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#10b981" fillOpacity="0.1" />

        {/* Form */}
        <rect
          x="100"
          y="75"
          width="200"
          height="150"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Form header */}
        <rect x="100" y="75" width="200" height="30" rx="8" fill="#f97316" />
        <rect x="120" y="85" width="100" height="10" rx="2" fill="#ffffff" />

        {/* Form fields */}
        <rect x="120" y="120" width="160" height="15" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="120" y="145" width="160" height="15" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="120" y="170" width="160" height="15" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />

        {/* Submit button */}
        <rect x="160" y="200" width="80" height="20" rx="4" fill="#10b981" />
        <rect x="180" y="205" width="40" height="10" rx="2" fill="#ffffff" />

        {/* Calendar icon */}
        <rect
          x="300"
          y="100"
          width="40"
          height="40"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect x="310" y="90" width="5" height="15" rx="2" fill="#f97316" />
        <rect x="325" y="90" width="5" height="15" rx="2" fill="#f97316" />
        <line x1="300" y1="115" x2="340" y2="115" stroke="#f97316" strokeWidth="2" />

        {/* Location pin */}
        <circle
          cx="320"
          cy="170"
          r="15"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#f97316"
          strokeWidth="2"
        />
        <path d="M320 155 L320 175 L310 165 Z" fill="#f97316" />

        {/* Decorative elements */}
        <circle cx="70" cy="100" r="10" fill="#f97316" fillOpacity="0.5" />
        <circle cx="70" cy="200" r="10" fill="#10b981" fillOpacity="0.5" />
        <circle cx="330" cy="200" r="10" fill="#f97316" fillOpacity="0.5" />
        <circle cx="330" cy="70" r="10" fill="#10b981" fillOpacity="0.5" />

        {/* People */}
        <circle cx="60" cy="150" r="15" fill="#f97316" />
        <rect x="50" y="165" width="20" height="25" rx="10" fill="#f97316" />

        <circle cx="340" cy="150" r="15" fill="#10b981" />
        <rect x="330" y="165" width="20" height="25" rx="10" fill="#10b981" />
      </svg>
    </div>
  )
}

// NEW ILLUSTRATIONS

export function NotFoundIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <circle cx="200" cy="150" r="120" fill="#f97316" fillOpacity="0.1" />

        {/* 404 text */}
        <text
          x="200"
          y="140"
          textAnchor="middle"
          fontSize="60"
          fontWeight="bold"
          fill="#f97316"
          className="dark:fill-pamoja-500"
        >
          404
        </text>

        {/* Map with pin */}
        <rect
          x="120"
          y="80"
          width="160"
          height="120"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="5 5"
        />

        {/* Map details */}
        <line x1="120" y1="110" x2="280" y2="110" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="120" y1="140" x2="280" y2="140" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="120" y1="170" x2="280" y2="170" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="150" y1="80" x2="150" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="180" y1="80" x2="180" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="210" y1="80" x2="210" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="240" y1="80" x2="240" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />

        {/* Location pin */}
        <circle cx="200" cy="140" r="15" fill="#f97316" />
        <path d="M200 125 L200 155 L185 140 Z" fill="#f97316" transform="rotate(180 200 140)" fillOpacity="0.8" />

        {/* Question marks */}
        <text
          x="150"
          y="110"
          fontSize="20"
          fontWeight="bold"
          fill="#10b981"
          className="dark:fill-unity-500"
          opacity="0.7"
        >
          ?
        </text>
        <text
          x="240"
          y="170"
          fontSize="20"
          fontWeight="bold"
          fill="#10b981"
          className="dark:fill-unity-500"
          opacity="0.7"
        >
          ?
        </text>
        <text
          x="180"
          y="190"
          fontSize="20"
          fontWeight="bold"
          fill="#10b981"
          className="dark:fill-unity-500"
          opacity="0.7"
        >
          ?
        </text>

        {/* Compass */}
        <circle
          cx="260"
          cy="100"
          r="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <line x1="260" y1="85" x2="260" y2="115" stroke="#f97316" strokeWidth="2" />
        <line x1="245" y1="100" x2="275" y2="100" stroke="#f97316" strokeWidth="2" />
        <path d="M260 85 L265 95 L255 95 Z" fill="#f97316" />

        {/* Person looking confused */}
        <circle cx="120" cy="220" r="20" fill="#10b981" />
        <rect x="110" y="240" width="20" height="30" rx="10" fill="#10b981" />
        <circle cx="115" cy="215" r="3" fill="#ffffff" />
        <circle cx="125" cy="215" r="3" fill="#ffffff" />
        <path d="M115 225 C115 225, 120 230, 125 225" stroke="#ffffff" strokeWidth="2" fill="transparent" />

        <text
          x="200"
          y="250"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#6b7280"
          className="dark:fill-gray-400"
        >
          Page not found
        </text>
      </svg>
    </div>
  )
}

export function DashboardIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#10b981" fillOpacity="0.1" />

        {/* Main dashboard panel */}
        <rect
          x="70"
          y="70"
          width="260"
          height="160"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Header */}
        <rect x="70" y="70" width="260" height="30" rx="8" fill="#f97316" />
        <rect x="85" y="80" width="80" height="10" rx="2" fill="#ffffff" />

        {/* Stats cards */}
        <rect
          x="85"
          y="115"
          width="70"
          height="50"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-700"
          stroke="#10b981"
          strokeWidth="2"
        />
        <rect x="95" y="125" width="50" height="8" rx="2" fill="#10b981" fillOpacity="0.5" />
        <rect x="95" y="145" width="30" height="10" rx="2" fill="#10b981" />

        <rect
          x="165"
          y="115"
          width="70"
          height="50"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-700"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect x="175" y="125" width="50" height="8" rx="2" fill="#f97316" fillOpacity="0.5" />
        <rect x="175" y="145" width="30" height="10" rx="2" fill="#f97316" />

        <rect
          x="245"
          y="115"
          width="70"
          height="50"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-700"
          stroke="#fb923c"
          strokeWidth="2"
        />
        <rect x="255" y="125" width="50" height="8" rx="2" fill="#fb923c" fillOpacity="0.5" />
        <rect x="255" y="145" width="30" height="10" rx="2" fill="#fb923c" />

        {/* Chart */}
        <rect x="85" y="175" width="150" height="40" rx="4" fill="#f0f0f0" className="dark:fill-gray-700" />
        <line x1="95" y1="195" x2="225" y2="195" stroke="#6b7280" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="95" y1="185" x2="95" y2="205" stroke="#6b7280" strokeWidth="1" strokeOpacity="0.5" />
        <path
          d="M95 195 L115 190 L135 200 L155 185 L175 195 L195 180 L215 190"
          stroke="#f97316"
          strokeWidth="2"
          fill="transparent"
        />
        <circle cx="115" cy="190" r="3" fill="#f97316" />
        <circle cx="135" cy="200" r="3" fill="#f97316" />
        <circle cx="155" cy="185" r="3" fill="#f97316" />
        <circle cx="175" cy="195" r="3" fill="#f97316" />
        <circle cx="195" cy="180" r="3" fill="#f97316" />
        <circle cx="215" cy="190" r="3" fill="#f97316" />

        {/* Event list */}
        <rect x="245" y="175" width="70" height="40" rx="4" fill="#f0f0f0" className="dark:fill-gray-700" />
        <rect x="250" y="180" width="60" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-600" />
        <rect x="250" y="193" width="60" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-600" />
        <rect x="250" y="206" width="60" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-600" />

        {/* Decorative elements */}
        <circle cx="330" cy="85" r="5" fill="#10b981" />
        <circle cx="345" cy="85" r="5" fill="#f97316" />
      </svg>
    </div>
  )
}

export function NFTTicketIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#f97316" fillOpacity="0.1" />

        {/* NFT Ticket */}
        <rect
          x="100"
          y="75"
          width="200"
          height="150"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="3"
        />

        {/* Ticket header */}
        <rect x="100" y="75" width="200" height="40" rx="8" fill="#f97316" />
        <text
          x="200"
          y="100"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#ffffff"
          className="dark:fill-white"
        >
          EVENT TICKET
        </text>

        {/* QR Code */}
        <rect
          x="120"
          y="130"
          width="70"
          height="70"
          rx="4"
          fill="#ffffff"
          className="dark:fill-gray-900"
          stroke="#10b981"
          strokeWidth="2"
        />
        <rect x="130" y="140" width="10" height="10" fill="#10b981" />
        <rect x="150" y="140" width="10" height="10" fill="#10b981" />
        <rect x="170" y="140" width="10" height="10" fill="#10b981" />
        <rect x="130" y="160" width="10" height="10" fill="#10b981" />
        <rect x="150" y="160" width="10" height="10" fill="#10b981" />
        <rect x="130" y="180" width="10" height="10" fill="#10b981" />
        <rect x="150" y="180" width="10" height="10" fill="#10b981" />
        <rect x="170" y="180" width="10" height="10" fill="#10b981" />

        {/* Ticket details */}
        <rect x="210" y="130" width="70" height="10" rx="2" fill="#f97316" fillOpacity="0.7" />
        <rect x="210" y="150" width="70" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="210" y="165" width="70" height="8" rx="2" fill="#e0e0e0" className="dark:fill-gray-700" />
        <rect x="210" y="180" width="40" height="20" rx="4" fill="#10b981" />
        <text
          x="230"
          y="194"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#ffffff"
          className="dark:fill-white"
        >
          #1234
        </text>

        {/* Perforation */}
        <line
          x1="100"
          y1="125"
          x2="300"
          y2="125"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />

        {/* Blockchain elements */}
        <circle cx="80" cy="100" r="15" fill="#10b981" fillOpacity="0.5" />
        <circle cx="80" cy="200" r="15" fill="#f97316" fillOpacity="0.5" />
        <circle cx="320" cy="100" r="15" fill="#f97316" fillOpacity="0.5" />
        <circle cx="320" cy="200" r="15" fill="#10b981" fillOpacity="0.5" />

        {/* Chain links */}
        <path d="M80 115 L80 185" stroke="#10b981" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
        <path d="M320 115 L320 185" stroke="#f97316" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
        <path d="M95 100 L305 100" stroke="#10b981" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
        <path d="M95 200 L305 200" stroke="#f97316" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function ChatIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#10b981" fillOpacity="0.1" />

        {/* Chat window */}
        <rect
          x="80"
          y="70"
          width="240"
          height="160"
          rx="8"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Chat header */}
        <rect x="80" y="70" width="240" height="30" rx="8" fill="#f97316" />
        <circle cx="95" cy="85" r="8" fill="#ffffff" />
        <rect x="110" y="80" width="60" height="10" rx="2" fill="#ffffff" />

        {/* Chat messages */}
        {/* Message 1 - received */}
        <rect x="90" y="110" width="100" height="30" rx="15" fill="#e0e0e0" className="dark:fill-gray-700" />
        <text x="140" y="130" textAnchor="middle" fontSize="10" fill="#6b7280" className="dark:fill-gray-300">
          Hello there!
        </text>

        {/* Message 2 - sent */}
        <rect x="210" y="150" width="100" height="30" rx="15" fill="#10b981" />
        <text x="260" y="170" textAnchor="middle" fontSize="10" fill="#ffffff" className="dark:fill-white">
          Hi! How are you?
        </text>

        {/* Chat input */}
        <rect
          x="90"
          y="190"
          width="200"
          height="30"
          rx="15"
          fill="#f0f0f0"
          className="dark:fill-gray-700"
          stroke="#e0e0e0"
          strokeWidth="1"
          className="dark:stroke-gray-600"
        />
        <circle cx="290" cy="205" r="10" fill="#f97316" />
        <path d="M285 205 L295 205 M290 200 L290 210" stroke="#ffffff" strokeWidth="2" />

        {/* XMTP logo simplified */}
        <rect x="330" y="70" width="30" height="30" rx="4" fill="#10b981" fillOpacity="0.2" />
        <path d="M335 85 L345 75 M335 75 L345 85" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <path d="M340 75 L340 95" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

        {/* Decorative elements */}
        <circle cx="60" cy="120" r="15" fill="#f97316" fillOpacity="0.5" />
        <circle cx="60" cy="170" r="15" fill="#10b981" fillOpacity="0.5" />
        <circle cx="340" cy="120" r="15" fill="#10b981" fillOpacity="0.5" />
        <circle cx="340" cy="170" r="15" fill="#f97316" fillOpacity="0.5" />

        {/* Connection lines */}
        <path d="M75 120 L90 120" stroke="#f97316" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M310 170 L325 170" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
    </div>
  )
}

export function TokenGateIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#f97316" fillOpacity="0.1" />

        {/* Gate */}
        <rect
          x="150"
          y="80"
          width="20"
          height="140"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />
        <rect
          x="230"
          y="80"
          width="20"
          height="140"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />
        <rect
          x="150"
          y="80"
          width="100"
          height="20"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Gate door */}
        <rect
          x="170"
          y="100"
          width="60"
          height="120"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <circle cx="220" cy="160" r="5" fill="#f97316" />

        {/* Lock */}
        <rect x="185" y="140" width="30" height="40" rx="4" fill="#10b981" />
        <rect x="190" y="130" width="20" height="15" rx="7" stroke="#10b981" strokeWidth="3" fill="transparent" />
        <circle cx="200" cy="150" r="5" fill="#ffffff" />
        <line x1="200" y1="150" x2="200" y2="165" stroke="#ffffff" strokeWidth="2" />

        {/* Token */}
        <circle cx="100" cy="150" r="30" fill="#f97316" fillOpacity="0.7" />
        <text x="100" y="155" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">
          TOKEN
        </text>

        {/* Person */}
        <circle cx="100" cy="150" r="10" fill="#ffffff" />
        <rect x="95" y="160" width="10" height="15" rx="5" fill="#ffffff" />

        {/* Arrow */}
        <path d="M130 150 L160 150" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M150 140 L160 150 L150 160" stroke="#10b981" strokeWidth="2" />

        {/* Event */}
        <circle cx="300" cy="150" r="30" fill="#10b981" fillOpacity="0.7" />
        <text x="300" y="155" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">
          EVENT
        </text>

        {/* Arrow */}
        <path d="M240 150 L270 150" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M260 140 L270 150 L260 160" stroke="#10b981" strokeWidth="2" />

        {/* Decorative elements */}
        <circle cx="70" cy="80" r="10" fill="#10b981" fillOpacity="0.5" />
        <circle cx="70" cy="220" r="10" fill="#f97316" fillOpacity="0.5" />
        <circle cx="330" cy="80" r="10" fill="#f97316" fillOpacity="0.5" />
        <circle cx="330" cy="220" r="10" fill="#10b981" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

export function AnnouncementIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[400px]", className)}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#10b981" fillOpacity="0.1" />

        {/* Megaphone */}
        <path
          d="M120 150 L120 180 L150 190 L150 140 L120 150 Z"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <circle
          cx="120"
          cy="165"
          r="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <path d="M150 140 L220 120 L220 210 L150 190 Z" fill="#f97316" fillOpacity="0.7" />

        {/* Sound waves */}
        <path
          d="M230 130 C240 130, 250 140, 250 165 C250 190, 240 200, 230 200"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          fill="transparent"
        />
        <path
          d="M240 140 C255 140, 270 150, 270 165 C270 180, 255 190, 240 190"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          fill="transparent"
        />
        <path
          d="M250 150 C260 150, 280 155, 280 165 C280 175, 260 180, 250 180"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Notification bell */}
        <path
          d="M300 120 C300 110, 290 100, 280 100 C270 100, 260 110, 260 120 L260 140 L300 140 L300 120 Z"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />
        <circle cx="280" cy="100" r="5" fill="#10b981" />
        <path
          d="M275 140 L285 140 L285 150 C285 155, 280 160, 275 150 Z"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#10b981"
          strokeWidth="2"
        />
        <circle cx="300" cy="120" r="8" fill="#f97316" />
        <text x="300" y="123" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">
          !
        </text>

        {/* Message bubbles */}
        <rect
          x="180"
          y="80"
          width="80"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="200"
          y="220"
          width="80"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />
        <rect
          x="300"
          y="170"
          width="60"
          height="30"
          rx="15"
          fill="#ffffff"
          className="dark:fill-gray-800"
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Decorative elements */}
        <circle cx="80" cy="100" r="15" fill="#f97316" fillOpacity="0.5" />
        <circle cx="80" cy="200" r="15" fill="#10b981" fillOpacity="0.5" />
        <circle cx="330" cy="100" r="15" fill="#10b981" fillOpacity="0.5" />
        <circle cx="330" cy="200" r="15" fill="#f97316" fillOpacity="0.5" />
      </svg>
    </div>
  )
}
