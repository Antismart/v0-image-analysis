"use client"

import { useState, useMemo } from "react"
import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { EmptyStateIllustration } from "@/components/illustrations"
import { MobileFilters } from "@/components/mobile-filters"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventDiscovery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { events, loading, error } = useOnChainEvents()

  // Filter and organize events by status and date
  const organizedEvents = useMemo(() => {
    const now = new Date()
    
    // Filter events by search and tab first
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (activeTab === "all") return matchesSearch
      if (activeTab === "public") return matchesSearch && !event.isTokenGated
      if (activeTab === "token-gated") return matchesSearch && event.isTokenGated
      
      // Status-based filtering
      const eventDate = new Date(event.date)
      const eventEndDate = new Date(eventDate.getTime() + (24 * 60 * 60 * 1000))
      
      if (activeTab === "upcoming") return matchesSearch && eventDate > now && !event.cancelled
      if (activeTab === "live") return matchesSearch && eventDate <= now && eventEndDate > now && !event.cancelled
      
      return matchesSearch
    })

    // Categorize events by status
    const upcoming = filtered.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate > now && !event.cancelled
    })
    
    const ongoing = filtered.filter(event => {
      const eventDate = new Date(event.date)
      const eventEndDate = new Date(eventDate.getTime() + (24 * 60 * 60 * 1000)) // Assume 24h duration
      return eventDate <= now && eventEndDate > now && !event.cancelled
    })
    
    const ended = filtered.filter(event => {
      const eventDate = new Date(event.date)
      const eventEndDate = new Date(eventDate.getTime() + (24 * 60 * 60 * 1000)) // Assume 24h duration
      return eventEndDate <= now && !event.cancelled
    })
    
    const cancelled = filtered.filter(event => event.cancelled)

    // Sort each category: newest first (by creation order - lower ID = newer)
    const sortByNewest = (a: any, b: any) => parseInt(b.id) - parseInt(a.id)
    
    return {
      upcoming: upcoming.sort(sortByNewest),
      ongoing: ongoing.sort(sortByNewest),
      ended: ended.sort(sortByNewest),
      cancelled: cancelled.sort(sortByNewest)
    }
  }, [events, searchTerm, activeTab])

  return (
    <section
      className="py-8 sm:py-12 min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300"
      id="events"
    >
      <h2 className="section-heading mb-6 sm:mb-8 text-gray-900 dark:text-gray-100">Discover Events</h2>
      <div className="mb-2 text-sm text-muted-foreground dark:text-gray-400">
        All ticket prices are shown in <span className="font-semibold">USDC</span> (Base Sepolia Testnet)
      </div>
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8 bg-white dark:bg-background border border-neutral-200 dark:border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <MobileFilters />
          <Button variant="outline" className="hidden sm:flex items-center gap-2 dark:bg-background dark:text-gray-200 dark:border-border">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="dark:bg-background dark:border-border">
          <TabsTrigger value="all" className="dark:text-gray-200">All Events</TabsTrigger>
          <TabsTrigger value="upcoming" className="dark:text-gray-200">Upcoming</TabsTrigger>
          <TabsTrigger value="live" className="dark:text-gray-200">Live</TabsTrigger>
          <TabsTrigger value="public" className="dark:text-gray-200">Public</TabsTrigger>
          <TabsTrigger value="token-gated" className="dark:text-gray-200">Token-Gated</TabsTrigger>
        </TabsList>
      </Tabs>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-4 border border-neutral-200 dark:border-border rounded-lg bg-white dark:bg-background shadow-sm animate-pulse"
            >
              <Skeleton className="h-40 w-full rounded-md bg-neutral-100 dark:bg-muted/30" />
              <Skeleton className="h-6 w-3/4 bg-neutral-100 dark:bg-muted/30" />
              <Skeleton className="h-4 w-1/2 bg-neutral-100 dark:bg-muted/30" />
              <Skeleton className="h-4 w-1/3 bg-neutral-100 dark:bg-muted/30" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <EmptyStateIllustration className="mb-6 max-w-[200px]" />
          <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">Error loading events</h3>
          <p className="text-muted-foreground dark:text-gray-400">{error}</p>
        </div>
      ) : (organizedEvents.upcoming.length === 0 && organizedEvents.ongoing.length === 0 && organizedEvents.ended.length === 0 && organizedEvents.cancelled.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 dark:border-border">
          <EmptyStateIllustration className="mb-6 max-w-[200px]" />
          <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">No events found</h3>
          <p className="text-muted-foreground dark:text-gray-400">Try a different search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Show only relevant sections based on active tab */}
          {(activeTab === "all" || activeTab === "live") && organizedEvents.ongoing.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Live Events</h3>
                <div className="h-px bg-gradient-to-r from-green-500/50 to-transparent flex-1"></div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {organizedEvents.ongoing.map((event) => (
                  <div key={event.id} className="relative bg-white dark:bg-background border-2 border-green-200 dark:border-green-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-pulse-border">
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      LIVE
                    </div>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "upcoming") && organizedEvents.upcoming.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-3 w-3 rounded-full bg-blue-500"></div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Upcoming Events</h3>
                <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1"></div>
                <span className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
                  {organizedEvents.upcoming.length} event{organizedEvents.upcoming.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {organizedEvents.upcoming.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-background border border-neutral-200 dark:border-border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "all" && organizedEvents.ended.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-3 w-3 rounded-full bg-gray-400"></div>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Past Events</h3>
                <div className="h-px bg-gradient-to-r from-gray-400/50 to-transparent flex-1"></div>
                <span className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-950/30 px-3 py-1 rounded-full">
                  {organizedEvents.ended.length} event{organizedEvents.ended.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {organizedEvents.ended.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-background border border-neutral-200 dark:border-border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md opacity-75 hover:opacity-100 grayscale hover:grayscale-0">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "all" && organizedEvents.cancelled.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-3 w-3 rounded-full bg-red-500"></div>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Cancelled Events</h3>
                <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent flex-1"></div>
                <span className="text-sm text-muted-foreground bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-full">
                  {organizedEvents.cancelled.length} event{organizedEvents.cancelled.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {organizedEvents.cancelled.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-background border border-red-200 dark:border-red-800 rounded-lg shadow-sm transition-all duration-300 opacity-50 hover:opacity-75 grayscale">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/10 rounded-lg flex items-center justify-center z-10">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          CANCELLED
                        </span>
                      </div>
                      <EventCard event={event} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
