import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, MapPin, Users, Lock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/30 dark:hover:border-pamoja-800/50 group border-gray-200 hover:border-pamoja-200">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
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
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-pamoja-500 dark:text-pamoja-400" />
          <span className="text-xs text-muted-foreground tracking-wide">
            {isUpcoming ? `In ${formatDistanceToNow(eventDate)}` : `${formatDistanceToNow(eventDate)} ago`}
          </span>
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
          <Button variant="default" className="w-full font-medium tracking-wide">
            View Event
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
