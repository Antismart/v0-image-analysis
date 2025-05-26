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

  // Filter events by search and tab
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      if (activeTab === "all") return matchesSearch
      if (activeTab === "public") return matchesSearch && !event.isTokenGated
      if (activeTab === "token-gated") return matchesSearch && event.isTokenGated
      return matchesSearch
    })
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
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 dark:border-border">
          <EmptyStateIllustration className="mb-6 max-w-[200px]" />
          <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">No events found</h3>
          <p className="text-muted-foreground dark:text-gray-400">Try a different search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-background border border-neutral-200 dark:border-border rounded-lg shadow-sm transition-colors duration-300">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
