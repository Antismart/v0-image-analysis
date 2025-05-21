import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
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
