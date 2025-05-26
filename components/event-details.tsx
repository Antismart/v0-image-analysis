"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Users, Clock, Share2, Heart, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentModal } from "@/components/payment-modal"
import { EventCheckin } from "@/components/event-checkin"
import { SocialShare } from "@/components/social-share"
import { useWallet } from "@/context/wallet-context"
import { SuccessIllustration } from "@/components/illustrations"
import EventGroupChat from "@/components/event-group-chat"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { rsvpToEvent, checkUserRSVP } from "@/hooks/use-blockchain-profile"

interface EventDetailsProps {
  id: string
}

export function EventDetails({ id }: EventDetailsProps) {
  const { isConnected, address, walletClient } = useWallet()
  const { events, loading, error } = useOnChainEvents()
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Find the event first
  const event = events.find(e => e.id === id)

  // Check if current user is the organizer
  const isOrganizer = address?.toLowerCase() === event?.organizer.toLowerCase()

  const handleShare = async () => {
    if (!event) return
    
    const eventUrl = `${window.location.origin}/event/${event.id}`
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: eventUrl
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Error sharing:', error)
        // Fallback to clipboard
        navigator.clipboard.writeText(eventUrl)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(eventUrl)
      // You could add a toast notification here
    }
  }

  // Check if user has already RSVPed when component loads or address changes
  useEffect(() => {
    const checkRSVPStatus = async () => {
      if (address && event) {
        try {
          const hasRSVP = await checkUserRSVP(event.id.toString(), address)
          setIsRSVPed(hasRSVP)
        } catch (error) {
          console.error('Error checking RSVP status:', error)
        }
      }
    }
    
    checkRSVPStatus()
  }, [address, event])

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center">Loading event...</div>
  }
  if (error) {
    return <div className="flex min-h-[400px] items-center justify-center text-red-500">{error}</div>
  }
  if (!event) {
    return <div className="flex min-h-[400px] items-center justify-center">Event not found.</div>
  }

  const handleRSVP = async () => {
    if (event.ticketPrice > 0) {
      setIsPaymentModalOpen(true)
    } else {
      // Free event - RSVP directly to blockchain
      if (address && walletClient) {
        try {
          await rsvpToEvent(event.id.toString(), address, walletClient)
          setIsRSVPed(true)
        } catch (error) {
          console.error('Error RSVPing:', error)
          // Could show error toast here
        }
      }
    }
  }

  const handlePaymentComplete = async () => {
    setIsPaymentModalOpen(false)
    // After successful payment, the blockchain transaction will handle RSVP
    // We can check the RSVP status again
    if (address) {
      try {
        const hasRSVP = await checkUserRSVP(event.id.toString(), address)
        setIsRSVPed(hasRSVP)
      } catch (error) {
        console.error('Error checking RSVP after payment:', error)
      }
    }
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
          <p className="text-muted-foreground">Organized by {event.organizer}</p>
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
          <SocialShare 
            title={event.title}
            description={event.description}
            eventId={event.id.toString()}
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <CalendarIcon className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-muted-foreground truncate">{event.date ? new Date(event.date).toLocaleDateString() : "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <Clock className="h-5 w-5 text-pamoja-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-muted-foreground truncate">{event.date ? new Date(event.date).toLocaleTimeString() : "-"}</p>
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
            <p className="text-sm text-muted-foreground truncate">{event.attendees} / {event.capacity}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          {event.speakers && event.speakers.length > 0 && (
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
          )}
          {event.schedule && event.schedule.length > 0 && (
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          )}
          {isOrganizer && (
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="about" className="mt-4">
          <div className="prose max-w-none dark:prose-invert">
            {event.description}
          </div>
        </TabsContent>
        {event.speakers && event.speakers.length > 0 && (
          <TabsContent value="speakers" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.speakers.map((speaker: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center rounded-lg border p-4">
                  {speaker.avatar ? (
                    <img src={speaker.avatar} alt={speaker.name} className="w-16 h-16 rounded-full object-cover mb-2 border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground border mb-2">No Image</div>
                  )}
                  <div className="font-semibold text-lg">{speaker.name}</div>
                  <div className="text-sm text-muted-foreground mb-1">{speaker.title}</div>
                  <div className="text-xs text-muted-foreground text-center">{speaker.bio}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
        {event.schedule && event.schedule.length > 0 && (
          <TabsContent value="schedule" className="mt-4">
            <div className="space-y-4">
              {event.schedule.map((item: any, idx: number) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-muted-foreground mb-1">{item.time}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
        {isOrganizer && (
          <TabsContent value="checkin" className="mt-4">
            <EventCheckin eventId={event.id.toString()} isOrganizer={isOrganizer} />
          </TabsContent>
        )}
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
                {event.ticketPrice > 0 ? `Ticket price: ${event.ticketPrice} USDC` : "This is a free event"}
              </p>
            </div>

            {isConnected ? (
              <Button onClick={handleRSVP} className="w-full bg-pamoja-500 hover:bg-pamoja-600">
                {event.ticketPrice > 0 ? "Purchase Ticket" : "RSVP"}
              </Button>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Connect your wallet to RSVP for this event</p>
                <Button variant="outline" className="w-full">Connect Wallet</Button>
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
        organizer={event.organizer}
      />

      {/* XMTP Group Chat */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Event Chat</h2>
        <EventGroupChat 
          eventId={event.id}
          eventTitle={event.title}
          xmtpGroupId={event.xmtpGroupId}
          isOrganizer={event.organizer === address}
        />
      </div>
    </div>
  )
}
