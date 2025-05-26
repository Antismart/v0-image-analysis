"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageSquare, BarChart, Plus } from "lucide-react"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { useWallet } from "@/context/wallet-context"

export function OrganizerDashboard() {
	const [activeTab, setActiveTab] = useState("upcoming")
	const router = useRouter()
	const { address } = useWallet ? useWallet() : { address: undefined }
	const { events, loading, error } = useOnChainEvents()

	// Only show events where the user is the organizer, or all if no wallet
	const myEvents = address
		? events.filter((event) => event.organizer?.toLowerCase() === address.toLowerCase())
		: events

	const filteredEvents = myEvents.filter(
		(event) =>
			(activeTab === "upcoming" && new Date(event.date) > new Date() && !event.cancelled) ||
			(activeTab === "past" && new Date(event.date) <= new Date()),
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
						<div className="text-2xl font-bold">{myEvents.length}</div>
						<p className="text-xs text-muted-foreground">+1 from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{myEvents.reduce((sum, event) => sum + (event.attendees || 0), 0)}</div>
						<p className="text-xs text-muted-foreground">+85 from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Engagement</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
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
					{loading ? (
						<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-muted-foreground">Loading events...</span>
						</div>
					) : error ? (
						<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-muted-foreground">{error}</span>
						</div>
					) : filteredEvents.length > 0 ? (
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
												<Badge>{new Date(event.date) > new Date() ? "Upcoming" : "Past"}</Badge>
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
													<p className="text-sm text-muted-foreground">-</p>
												</div>
												<div className="flex items-end justify-end">
													<div className="flex gap-2">
														<Link href={`/event/${event.id}`}>
															<Button variant="outline" size="sm">
																View
															</Button>
														</Link>
														<Button
															variant="outline"
															size="sm"
															onClick={() => router.push(`/event/${event.id}/edit`)}
														>
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
					{loading ? (
						<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-muted-foreground">Loading events...</span>
						</div>
					) : error ? (
						<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-muted-foreground">{error}</span>
						</div>
					) : filteredEvents.length > 0 ? (
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
													<p className="text-sm text-muted-foreground">-</p>
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
