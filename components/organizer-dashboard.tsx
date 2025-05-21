"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageSquare, BarChart, Plus } from "lucide-react"

// Mock data for demonstration
const mockEvents = [
  {
    id: "1",
    title: "Web3 Developer Meetup",
    date: "2025-06-15T18:00:00",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=100&width=200",
    attendees: 42,
    capacity: 100,
    messageCount: 24,
    status: "upcoming",
  },
  {
    id: "4",
    title: "DAO Governance Summit",
    date: "2025-07-05T10:00:00",
    location: "Berlin, Germany",
    image: "/placeholder.svg?height=100&width=200",
    attendees: 85,
    capacity: 150,
    messageCount: 56,
    status: "upcoming",
  },
  {
    id: "5",
    title: "Crypto Art Festival",
    date: "2025-05-10T11:00:00",
    location: "Miami, FL",
    image: "/placeholder.svg?height=100&width=200",
    attendees: 120,
    capacity: 120,
    messageCount: 87,
    status: "past",
  },
]

export function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const filteredEvents = mockEvents.filter(
    (event) =>
      (activeTab === "upcoming" && event.status === "upcoming") || (activeTab === "past" && event.status === "past"),
  )

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.reduce((sum, event) => sum + event.attendees, 0)}</div>
            <p className="text-xs text-muted-foreground">+85 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.reduce((sum, event) => sum + event.messageCount, 0)}</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <Link href="/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="aspect-video w-full sm:w-48">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={200}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.date), "EEEE, MMMM d, yyyy")} • {event.location}
                          </p>
                        </div>
                        <Badge>{event.status === "upcoming" ? "Upcoming" : "Past"}</Badge>
                      </div>

                      <div className="mt-auto grid grid-cols-3 gap-4 border-t pt-4">
                        <div>
                          <p className="text-sm font-medium">Attendees</p>
                          <p className="text-sm text-muted-foreground">
                            {event.attendees} / {event.capacity}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">{event.messageCount}</p>
                        </div>
                        <div className="flex items-end justify-end">
                          <div className="flex gap-2">
                            <Link href={`/event/${event.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-muted-foreground">No upcoming events</p>
                <Link href="/create" className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="aspect-video w-full sm:w-48">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={200}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.date), "EEEE, MMMM d, yyyy")} • {event.location}
                          </p>
                        </div>
                        <Badge variant="outline">Past</Badge>
                      </div>

                      <div className="mt-auto grid grid-cols-3 gap-4 border-t pt-4">
                        <div>
                          <p className="text-sm font-medium">Attendees</p>
                          <p className="text-sm text-muted-foreground">
                            {event.attendees} / {event.capacity}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">{event.messageCount}</p>
                        </div>
                        <div className="flex items-end justify-end">
                          <div className="flex gap-2">
                            <Link href={`/event/${event.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <BarChart className="mr-2 h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No past events</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
