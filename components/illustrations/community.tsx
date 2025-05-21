import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
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
