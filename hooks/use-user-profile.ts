"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/context/wallet-context"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { getEventContract, publicClient } from "@/lib/contract"

export interface UserTicket {
  id: string
  eventId: string
  eventTitle: string
  tokenId: string
  image: string
}

export interface UserProfileData {
  attendingEvents: any[]
  organizedEvents: any[]
  tickets: UserTicket[]
  loading: boolean
  error: string | null
}

export function useUserProfile(): UserProfileData {
  const { address } = useWallet()
  const { events, loading: eventsLoading, error: eventsError } = useOnChainEvents()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address || eventsLoading || eventsError) {
      return
    }

    const fetchUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        // For now, we'll use localStorage to track which events the user has RSVPed to
        // This is a temporary solution until we implement proper event logs tracking
        const attendedEventIds = JSON.parse(localStorage.getItem(`attended-events-${address}`) || '[]')
        
        // Filter events user is attending (based on localStorage for now)
        const attendingEvents = events.filter(event => 
          attendedEventIds.includes(event.id.toString())
        )

        // Filter events user has organized
        const organizedEvents = events.filter(event => 
          event.organizer?.toLowerCase() === address.toLowerCase()
        )

        // Generate mock NFT tickets for events the user is attending
        // In a real implementation, this would query an NFT contract
        const userTickets: UserTicket[] = attendingEvents
          .filter(event => event.ticketPrice > 0) // Only paid events have NFT tickets
          .map((event, index) => ({
            id: `ticket-${event.id}`,
            eventId: event.id.toString(),
            eventTitle: event.title,
            tokenId: `${Date.now()}${index}`, // Mock token ID
            image: event.image || "/placeholder.svg"
          }))

        setTickets(userTickets)
      } catch (err: any) {
        setError(err.message || "Failed to fetch user profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [address, events, eventsLoading, eventsError])

  // Filter events by user relationship
  const attendingEvents = address ? events.filter(event => {
    const attendedEventIds = JSON.parse(localStorage.getItem(`attended-events-${address}`) || '[]')
    return attendedEventIds.includes(event.id.toString())
  }) : []

  const organizedEvents = address ? events.filter(event => 
    event.organizer?.toLowerCase() === address.toLowerCase()
  ) : []

  return {
    attendingEvents,
    organizedEvents,
    tickets,
    loading: loading || eventsLoading,
    error: error || eventsError
  }
}

// Helper function to check if user has already RSVPed to an event
export function hasUserRSVPed(eventId: string, userAddress: string): boolean {
  if (!userAddress) return false
  const key = `attended-events-${userAddress}`
  const attendedEvents = JSON.parse(localStorage.getItem(key) || '[]')
  return attendedEvents.includes(eventId)
}

// Helper function to mark an event as attended (called after RSVP/payment)
export function markEventAsAttended(eventId: string, userAddress: string) {
  const key = `attended-events-${userAddress}`
  const attendedEvents = JSON.parse(localStorage.getItem(key) || '[]')
  
  if (!attendedEvents.includes(eventId)) {
    attendedEvents.push(eventId)
    localStorage.setItem(key, JSON.stringify(attendedEvents))
  }
}

// Helper function to remove event from attended list
export function removeEventFromAttended(eventId: string, userAddress: string) {
  const key = `attended-events-${userAddress}`
  const attendedEvents = JSON.parse(localStorage.getItem(key) || '[]')
  const filtered = attendedEvents.filter((id: string) => id !== eventId)
  localStorage.setItem(key, JSON.stringify(filtered))
}
