import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
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
        <rect x="50" cy="165" width="20" height="25" rx="10" fill="#f97316" />

        <circle cx="340" cy="150" r="15" fill="#10b981" />
        <rect x="330" cy="165" width="20" height="25" rx="10" fill="#10b981" />
      </svg>
    </div>
  )
}
