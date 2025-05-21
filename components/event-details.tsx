"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Users, Clock, Share2, Heart, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentModal } from "@/components/payment-modal"
import { useWallet } from "@/context/wallet-context"
import { SuccessIllustration } from "@/components/illustrations"

interface EventDetailsProps {
  id: string
}

export function EventDetails({ id }: EventDetailsProps) {
  const { isConnected } = useWallet()
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock event data for demonstration
  const event = {
    id,
    title: "Web3 Developer Meetup",
    description:
      "Join us for a night of coding, learning, and networking with fellow web3 developers. We'll have talks on the latest developments in the Base ecosystem, hands-on workshops, and plenty of time for networking.\n\nOur speakers include leading developers from the Base ecosystem who will share insights on building decentralized applications, optimizing smart contracts, and leveraging the latest tools and frameworks.\n\nFood and drinks will be provided!",
    date: new Date("2025-06-15T18:00:00"),
    endTime: new Date("2025-06-15T21:00:00"),
    location: "Tech Hub, 123 Blockchain St, San Francisco, CA",
    organizer: "0x1234...5678",
    organizerName: "Web3 SF Community",
    image: "/placeholder.svg?height=400&width=800",
    isTokenGated: false,
    attendees: 42,
    capacity: 100,
    ticketPrice: 0.05,
  }

  const handleRSVP = () => {
    if (event.ticketPrice > 0) {
      setIsPaymentModalOpen(true)
    } else {
      setIsRSVPed(true)
    }
  }

  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false)
    setIsRSVPed(true)
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        {event.isTokenGated && (
          <div className="absolute right-4 top-4">
            <Badge variant="secondary" className="flex items-center gap-1 bg-unity-600 text-white badge-text">
              <Lock className="h-3 w-3" />
              Token-Gated
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-balance">{event.title}</h1>
          <p className="text-muted-foreground">Organized by {event.organizerName}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={isFavorite ? "border-pamoja-200 bg-pamoja-50 dark:border-pamoja-800 dark:bg-pamoja-950/30" : ""}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-pamoja-500 text-pamoja-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" aria-label="Share event">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <CalendarIcon className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-muted-foreground truncate">{format(event.date, "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <Clock className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-muted-foreground truncate">
              {format(event.date, "h:mm a")} - {format(event.endTime, "h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <MapPin className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground truncate">{event.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <Users className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Attendees</p>
            <p className="text-sm text-muted-foreground truncate">
              {event.attendees} / {event.capacity}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4">
          <div className="prose max-w-none dark:prose-invert">
            {event.description.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Welcome & Introduction</h3>
                <span className="text-sm text-muted-foreground">6:00 PM - 6:15 PM</span>
              </div>
              <p className="text-sm text-muted-foreground">Opening remarks and overview of the evening's agenda.</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Keynote: Building on Base</h3>
                <span className="text-sm text-muted-foreground">6:15 PM - 7:00 PM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A deep dive into the Base ecosystem and best practices for developers.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Workshop: XMTP Integration</h3>
                <span className="text-sm text-muted-foreground">7:00 PM - 7:45 PM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Hands-on session on implementing secure messaging with XMTP.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Networking & Refreshments</h3>
                <span className="text-sm text-muted-foreground">7:45 PM - 9:00 PM</span>
              </div>
              <p className="text-sm text-muted-foreground">Connect with fellow developers and enjoy food and drinks.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="speakers" className="mt-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border p-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-muted flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Speaker"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">Jane Smith</h3>
                <p className="text-sm text-muted-foreground">Blockchain Developer, Ethereum Foundation</p>
                <p className="mt-2 text-sm">
                  Jane is a core contributor to several Base ecosystem projects and specializes in smart contract
                  optimization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Speaker"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">Founder, DeFi Protocol</p>
                <p className="mt-2 text-sm">
                  John has been building in web3 for over 5 years and will share insights on creating user-friendly
                  dApps.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border p-6">
        {isRSVPed ? (
          <div className="space-y-4 text-center">
            <SuccessIllustration className="mx-auto max-w-[150px]" />
            <h3 className="text-xl font-semibold text-unity-700 dark:text-unity-300">You're attending this event!</h3>
            <p className="text-sm text-muted-foreground">The event details have been added to your profile.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold">Ready to join this event?</h2>
              <p className="text-muted-foreground">
                {event.ticketPrice > 0 ? `Ticket price: ${event.ticketPrice} ETH` : "This is a free event"}
              </p>
            </div>

            {isConnected ? (
              <Button onClick={handleRSVP} className="w-full bg-pamoja-500 hover:bg-pamoja-600">
                {event.ticketPrice > 0 ? "Purchase Ticket" : "RSVP"}
              </Button>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Connect your wallet to RSVP for this event</p>
                <Button variant="outline" className="w-full">
                  Connect Wallet
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onComplete={handlePaymentComplete}
        amount={event.ticketPrice}
        eventId={event.id}
        eventTitle={event.title}
      />
    </div>
  )
}
