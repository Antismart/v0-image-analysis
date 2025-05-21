"use client"

import { useState } from "react"
import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { EmptyStateIllustration } from "@/components/illustrations"
import { MobileFilters } from "@/components/mobile-filters"

// Mock data for demonstration
const mockEvents = [
  {
    id: "1",
    title: "Web3 Developer Meetup",
    description: "Join us for a night of coding, learning, and networking with fellow web3 developers.",
    date: "2025-06-15T18:00:00",
    location: "San Francisco, CA",
    organizer: "0x1234...5678",
    image: "/placeholder.svg?height=300&width=400",
    isTokenGated: false,
    attendees: 42,
  },
  {
    id: "2",
    title: "NFT Art Exhibition",
    description: "Exclusive showcase of digital art from top NFT creators. Token-gated entry for collectors.",
    date: "2025-06-20T19:00:00",
    location: "New York, NY",
    organizer: "0xabcd...efgh",
    image: "/placeholder.svg?height=300&width=400",
    isTokenGated: true,
    attendees: 75,
  },
  {
    id: "3",
    title: "DeFi Workshop",
    description: "Learn about the latest in decentralized finance and how to build DeFi applications.",
    date: "2025-06-25T14:00:00",
    location: "Virtual",
    organizer: "0x7890...1234",
    image: "/placeholder.svg?height=300&width=400",
    isTokenGated: false,
    attendees: 120,
  },
  {
    id: "4",
    title: "DAO Governance Summit",
    description: "Discussing the future of decentralized governance and coordination.",
    date: "2025-07-05T10:00:00",
    location: "Berlin, Germany",
    organizer: "0xijkl...mnop",
    image: "/placeholder.svg?height=300&width=400",
    isTokenGated: true,
    attendees: 85,
  },
]

export default function EventDiscovery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "public") return matchesSearch && !event.isTokenGated
    if (activeTab === "token-gated") return matchesSearch && event.isTokenGated

    return matchesSearch
  })

  return (
    <section className="py-8 sm:py-12" id="events">
      <h2 className="section-heading mb-6 sm:mb-8">Discover Events</h2>

      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <MobileFilters />
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="token-gated">Token-Gated</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <EmptyStateIllustration className="mb-6 max-w-[200px]" />
          <h3 className="mb-2 text-xl font-semibold">No events found</h3>
          <p className="text-muted-foreground">Try a different search or filter criteria.</p>
        </div>
      )}
    </section>
  )
}
