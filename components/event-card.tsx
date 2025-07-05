import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, MapPin, Users, Lock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  image: string
  isTokenGated: boolean
  attendees: number
  ticketPrice: number
  cancelled?: boolean
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const now = new Date()
  const eventEndDate = new Date(eventDate.getTime() + (24 * 60 * 60 * 1000)) // Assume 24h duration
  
  const isUpcoming = eventDate > now
  const isOngoing = eventDate <= now && eventEndDate > now
  const isEnded = eventEndDate <= now

  // Dynamic background color extraction
  const imgRef = useRef<HTMLImageElement>(null)
  const [bgColor, setBgColor] = useState<string>("#f3f4f6") // fallback neutral

  useEffect(() => {
    if (!imgRef.current) return
    const img = imgRef.current
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1, 1)
      const data = ctx.getImageData(0, 0, 1, 1).data
      setBgColor(`rgb(${data[0]},${data[1]},${data[2]})`)
    }
    // If already loaded
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, 1, 1)
      const data = ctx.getImageData(0, 0, 1, 1).data
      setBgColor(`rgb(${data[0]},${data[1]},${data[2]})`)
    }
  }, [event.image])

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/30 dark:hover:border-pamoja-800/50 group border-gray-200 hover:border-pamoja-200">
      <div className="relative aspect-video overflow-hidden flex items-center justify-center" style={{ background: bgColor }}>
        <img
          ref={imgRef}
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
        />
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-contain w-full h-full"
          style={{ objectFit: "contain" }}
        />
        {event.isTokenGated && (
          <div className="absolute right-2 top-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-unity-600 text-white badge-text dark:bg-unity-700 tracking-wide"
            >
              <Lock className="h-3 w-3" />
              Token-Gated
            </Badge>
          </div>
        )}
        {event.cancelled && (
          <div className="absolute left-2 top-2">
            <Badge
              variant="destructive"
              className="flex items-center gap-1 bg-red-600 text-white badge-text tracking-wide"
            >
              CANCELLED
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-pamoja-500 dark:text-pamoja-400" />
          <span className="text-xs text-muted-foreground tracking-wide">
            {isOngoing ? "Live now" : isUpcoming ? `In ${formatDistanceToNow(eventDate)}` : `${formatDistanceToNow(eventDate)} ago`}
          </span>
          {isOngoing && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">LIVE</span>
            </div>
          )}
        </div>
        <h3 className="mb-2 line-clamp-1 font-heading font-semibold text-xl dark:text-white tracking-tight">
          {event.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground dark:text-muted-foreground/90 leading-relaxed">
          {event.description}
        </p>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-pamoja-500 dark:text-pamoja-400" />
          <span className="text-xs text-muted-foreground tracking-wide">{event.location}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-pamoja-500 dark:text-pamoja-400" />
          <span className="text-xs text-muted-foreground tracking-wide font-numeric">{event.attendees} attending</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-pamoja-500 font-semibold">{event.ticketPrice > 0 ? `${event.ticketPrice} USDC` : "Free"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/event/${event.id}`} className="w-full">
          <Button 
            variant={isOngoing ? "default" : isEnded ? "secondary" : "default"} 
            className={`w-full font-medium tracking-wide ${
              isOngoing ? "bg-green-600 hover:bg-green-700" : 
              isEnded ? "opacity-75" : ""
            } ${event.cancelled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={event.cancelled}
          >
            {event.cancelled ? "Cancelled" : 
             isOngoing ? "Join Live Event" :
             isEnded ? "View Event" :
             "View Event"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
