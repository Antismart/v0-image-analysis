"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-context"
import { useUser } from "@/context/user-context"
import { Ticket, Calendar, Award, Settings, ExternalLink } from "lucide-react"
import { NFTTicketIllustration } from "@/components/illustrations"
import { Loading } from "@/components/ui/loading"
import { SettingsModal } from "@/components/settings-modal"

// Mock data for demonstration
const mockEvents = [
  {
    id: "1",
    title: "Web3 Developer Meetup",
    date: "2025-06-15T18:00:00",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "2",
    title: "NFT Art Exhibition",
    date: "2025-06-20T19:00:00",
    location: "New York, NY",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "3",
    title: "DeFi Workshop",
    date: "2025-06-25T14:00:00",
    location: "Virtual",
    image: "/placeholder.svg?height=100&width=200",
  },
]

const mockTickets = [
  {
    id: "1",
    eventId: "1",
    eventTitle: "Web3 Developer Meetup",
    tokenId: "12345",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    eventId: "2",
    eventTitle: "NFT Art Exhibition",
    tokenId: "67890",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export function ProfileView() {
  const { address } = useWallet()
  const { profile, isLoading } = useUser()
  const [activeTab, setActiveTab] = useState("events")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loading variant="spinner" size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-muted flex-shrink-0">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Profile"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="outline" className="font-normal">
                <Award className="mr-1 h-3 w-3" />
                Reputation: {profile?.reputation || 0}
              </Badge>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View on BaseScan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="sm:self-start cursor-pointer"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="events" className="flex items-center justify-center gap-2 py-3">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center justify-center gap-2 py-3">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="organized" className="flex items-center justify-center gap-2 py-3">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Organized</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Events You're Attending</h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mockEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={200}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-3 sm:p-4 pb-2">
                    <CardTitle className="line-clamp-1 text-base sm:text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-xl font-semibold">Your NFT Tickets</h3>
            <NFTTicketIllustration className="max-w-[150px] sm:max-w-[200px]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={ticket.image || "/placeholder.svg"}
                    alt={ticket.eventTitle}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="line-clamp-1 text-lg">{ticket.eventTitle}</CardTitle>
                  <CardDescription>Token ID: {ticket.tokenId}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organized" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Events You've Organized</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockEvents.slice(0, 1).map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={200}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <Badge>Organizer</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Link href="/create">
              <Card className="flex h-full flex-col items-center justify-center p-6 transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Create New Event</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Organize your next event on Pamoja Events
                </p>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
