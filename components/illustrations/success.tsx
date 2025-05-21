import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
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
