"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageSquare, BarChart, Plus, Wallet, Filter, Eye, Edit, Share2, MapPin } from "lucide-react"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { useWallet } from "@/context/wallet-context"

export function OrganizerDashboard() {
	const [activeTab, setActiveTab] = useState("upcoming")
	const [eventFilter, setEventFilter] = useState("all")
	const router = useRouter()
	const { address, isConnected } = useWallet ? useWallet() : { address: undefined, isConnected: false }
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
		<div className="space-y-6 sm:space-y-8">
			{/* Wallet Status and Quick Actions */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card light-shadow dark-shadow rounded-lg p-4 sm:p-6 border dark:border-border light-card-hover dark-card-hover">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
					<div className="flex items-center gap-2">
						<Wallet className={`h-4 w-4 ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
						<span className="text-sm font-medium light-text-enhanced dark-text-enhanced">
							{isConnected ? 'Wallet Connected' : 'No Wallet Connected'}
						</span>
					</div>
					{isConnected && address && (
						<div className="text-xs text-muted-foreground light-text-muted dark-text-muted font-mono bg-muted dark:bg-input px-2 py-1 rounded">
							{address.slice(0, 6)}...{address.slice(-4)}
						</div>
					)}
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-green-500"></div>
						<span className="text-sm text-muted-foreground light-text-muted dark-text-muted">System Active</span>
					</div>
				</div>
				<Link href="/create" className="w-full sm:w-auto">
					<Button className="w-full sm:w-auto light:button-primary dark:button-primary light-shadow dark-shadow">
						<Plus className="mr-2 h-4 w-4" />
						Create New Event
					</Button>
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-background light-shadow-elevated dark-shadow light-card-hover dark-card-hover">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-primary light-text-enhanced dark-text-enhanced">Total Events</CardTitle>
						<Calendar className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary light-text-enhanced dark-text-enhanced">{myEvents.length}</div>
						<p className="text-xs text-muted-foreground light-text-muted dark-text-muted">+1 from last month</p>
					</CardContent>
				</Card>
				<Card className="border-l-4 border-l-secondary bg-gradient-to-r from-secondary/5 to-background light-shadow-elevated dark-shadow light-card-hover dark-card-hover">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-secondary light-text-enhanced dark-text-enhanced">Total Attendees</CardTitle>
						<Users className="h-4 w-4 text-secondary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-secondary light-text-enhanced dark-text-enhanced">{myEvents.reduce((sum, event) => sum + (event.attendees || 0), 0)}</div>
						<p className="text-xs text-muted-foreground light-text-muted dark-text-muted">+85 from last month</p>
					</CardContent>
				</Card>
				<Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/3 via-background to-secondary/3 light-shadow-elevated dark-shadow light-card-hover dark-card-hover">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium light-text-enhanced dark-text-enhanced">Engagement</CardTitle>
						<MessageSquare className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold light-text-enhanced dark-text-enhanced">-</div>
						<p className="text-xs text-muted-foreground light-text-muted dark-text-muted">+32 from last month</p>
					</CardContent>
				</Card>
			</div>

			{/* Your Events Section */}
			<Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:inline-flex bg-muted border border-primary/20">
					<TabsTrigger 
						value="upcoming" 
						className="flex-1 sm:flex-initial data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
					>
						<span className="sm:hidden">Upcoming</span>
						<span className="hidden sm:inline">Upcoming Events</span>
					</TabsTrigger>
					<TabsTrigger 
						value="past" 
						className="flex-1 sm:flex-initial data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
					>
						<span className="sm:hidden">Past</span>
						<span className="hidden sm:inline">Past Events</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming" className="mt-4 sm:mt-6">
					{loading ? (
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-sm text-muted-foreground">Loading events...</span>
						</div>
					) : error ? (
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-sm text-muted-foreground">{error}</span>
						</div>
					) : filteredEvents.length > 0 ? (
						<div className="space-y-4">
							{filteredEvents.map((event) => (
								<Card key={event.id} className="overflow-hidden border-l-4 border-l-primary bg-gradient-to-r from-primary/5 via-background to-secondary/5 hover:shadow-lg light-shadow-elevated dark-shadow-elevated light-card-hover dark-card-hover transition-all duration-300">
									<div className="flex flex-col lg:flex-row">
										<div className="aspect-video w-full lg:w-48 lg:aspect-square relative">
											<Image
												src={event.image || "/placeholder.svg"}
												alt={event.title}
												width={200}
												height={100}
												className="h-full w-full object-cover"
											/>
											<div className="absolute top-2 right-2">
												<Badge className="bg-primary/90 text-primary-foreground border-primary dark-shadow">
													{new Date(event.date) > new Date() ? "Upcoming" : "Past"}
												</Badge>
											</div>
										</div>
										<div className="flex flex-1 flex-col p-4">
											<div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-base sm:text-lg truncate text-primary light-text-enhanced dark-text-enhanced">{event.title}</h3>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted mt-1">
														{format(new Date(event.date), "EEEE, MMMM d, yyyy")} • {event.location}
													</p>
												</div>
											</div>

											<div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-primary/20 dark:border-primary/30 pt-4">
												<div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-3 light-card-hover dark-card-hover">
													<p className="text-sm font-medium text-primary light-text-enhanced dark-text-enhanced">Attendees</p>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted font-semibold">
														{event.attendees} / {event.capacity}
													</p>
												</div>
												<div className="hidden sm:block bg-secondary/10 dark:bg-secondary/20 rounded-lg p-3 light-card-hover dark-card-hover">
													<p className="text-sm font-medium text-secondary light-text-enhanced dark-text-enhanced">Messages</p>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted font-semibold">-</p>
												</div>
												<div className="col-span-2 sm:col-span-1 flex items-end justify-end">
													<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
														<Link href={`/event/${event.id}`} className="w-full sm:w-auto">
															<Button variant="outline" size="sm" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground light-shadow dark-shadow">
																View
															</Button>
														</Link>
														<Button
															variant="outline"
															size="sm"
															onClick={() => router.push(`/event/${event.id}/edit`)}
															className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground light-shadow dark-shadow"
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
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed border-primary/30 bg-primary/5">
							<div className="text-center">
								<p className="text-sm text-muted-foreground">No upcoming events</p>
								<Link href="/create" className="mt-2 inline-block">
									<Button variant="outline" size="sm" className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
										Create Event
									</Button>
								</Link>
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent value="past" className="mt-4 sm:mt-6">
					{loading ? (
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-sm text-muted-foreground">Loading events...</span>
						</div>
					) : error ? (
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed">
							<span className="text-sm text-muted-foreground">{error}</span>
						</div>
					) : filteredEvents.length > 0 ? (
						<div className="space-y-4">
							{filteredEvents.map((event) => (
								<Card key={event.id} className="overflow-hidden border-l-4 border-l-secondary bg-gradient-to-r from-secondary/5 via-background to-primary/5 hover:shadow-lg light-shadow-elevated dark-shadow-elevated light-card-hover dark-card-hover transition-all duration-300 opacity-90">
									<div className="flex flex-col lg:flex-row">
										<div className="aspect-video w-full lg:w-48 lg:aspect-square relative">
											<Image
												src={event.image || "/placeholder.svg"}
												alt={event.title}
												width={200}
												height={100}
												className="h-full w-full object-cover grayscale-[0.3] dark:grayscale-[0.5]"
											/>
											<div className="absolute top-2 right-2">
												<Badge variant="outline" className="bg-secondary/90 text-secondary border-secondary light-shadow dark-shadow">Past</Badge>
											</div>
										</div>
										<div className="flex flex-1 flex-col p-4">
											<div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-base sm:text-lg truncate text-secondary light-text-enhanced dark-text-enhanced">{event.title}</h3>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted mt-1">
														{format(new Date(event.date), "EEEE, MMMM d, yyyy")} • {event.location}
													</p>
												</div>
											</div>

											<div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-secondary/20 dark:border-secondary/30 pt-4">
												<div className="bg-secondary/10 dark:bg-secondary/20 rounded-lg p-3 light-card-hover dark-card-hover">
													<p className="text-sm font-medium text-secondary light-text-enhanced dark-text-enhanced">Attendees</p>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted font-semibold">
														{event.attendees} / {event.capacity}
													</p>
												</div>
												<div className="hidden sm:block bg-primary/10 dark:bg-primary/20 rounded-lg p-3 light-card-hover dark-card-hover">
													<p className="text-sm font-medium text-primary light-text-enhanced dark-text-enhanced">Messages</p>
													<p className="text-sm text-muted-foreground light-text-muted dark-text-muted font-semibold">-</p>
												</div>
												<div className="col-span-2 sm:col-span-1 flex items-end justify-end">
													<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
														<Link href={`/event/${event.id}`} className="w-full sm:w-auto">
															<Button variant="outline" size="sm" className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground light-shadow dark-shadow">
																View
															</Button>
														</Link>
														<Button variant="outline" size="sm" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground dark-shadow">
															<BarChart className="mr-2 h-4 w-4" />
															<span className="hidden sm:inline">Analytics</span>
															<span className="sm:hidden">Stats</span>
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
						<div className="flex h-32 sm:h-40 items-center justify-center rounded-lg border border-dashed border-secondary/30 bg-secondary/5">
							<p className="text-sm text-muted-foreground">No past events</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
