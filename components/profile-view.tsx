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
import { useBlockchainUserProfile } from "@/hooks/use-blockchain-profile"
import { Ticket, Calendar, Award, Settings, ExternalLink } from "lucide-react"
import { NFTTicketIllustration } from "@/components/illustrations"
import { NFTTicketCard } from "@/components/nft-ticket-card"
import { Loading } from "@/components/ui/loading"
import { SettingsModal } from "@/components/settings-modal"

export function ProfileView() {
  const { address } = useWallet()
  const { profile, isLoading: userLoading } = useUser()
  const { attendingEvents, organizedEvents, tickets, loading: profileLoading, transferTicket } = useBlockchainUserProfile()
  const [activeTab, setActiveTab] = useState("events")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isLoading = userLoading || profileLoading

  const handleTicketTransfer = async (tokenId: string, toAddress: string) => {
    try {
      await transferTicket(tokenId, toAddress)
      // The hook will automatically refresh the tickets list
    } catch (error) {
      console.error('Transfer failed:', error)
      throw error
    }
  }

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
          {attendingEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h4 className="mb-2 text-lg font-medium">No events yet</h4>
              <p className="text-muted-foreground">
                When you RSVP to events, they'll appear here.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {attendingEvents.map((event) => (
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
          )}
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-xl font-semibold">Your NFT Tickets</h3>
            <NFTTicketIllustration className="max-w-[150px] sm:max-w-[200px]" />
          </div>
          {tickets.length === 0 ? (
            <Card className="p-8 text-center">
              <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h4 className="mb-2 text-lg font-medium">No tickets yet</h4>
              <p className="text-muted-foreground">
                When you attend paid events, your NFT tickets will appear here.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <NFTTicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onTransfer={handleTicketTransfer}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="organized" className="mt-6">
          <h3 className="mb-4 text-xl font-semibold">Events You've Organized</h3>
          {organizedEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h4 className="mb-2 text-lg font-medium">No events organized yet</h4>
              <p className="text-muted-foreground">
                When you create events, they'll appear here.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizedEvents.map((event) => (
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
          )}
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
