"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/context/wallet-context"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { getEventContract, publicClient } from "@/lib/contract"
import { parseAbiItem } from 'viem'

export interface UserTicket {
  id: string
  eventId: string
  eventTitle: string
  tokenId: string
  image: string
  txHash: string
  timestamp: number
}

export interface UserProfileData {
  attendingEvents: any[]
  organizedEvents: any[]
  tickets: UserTicket[]
  loading: boolean
  error: string | null
  transferTicket: (tokenId: string, toAddress: string) => Promise<void>
}

// Event signatures for filtering logs
const RSVP_EVENT = parseAbiItem('event RSVP(uint256 indexed eventId, address indexed attendee)')
const TICKET_PURCHASED_EVENT = parseAbiItem('event TicketPurchased(uint256 indexed eventId, address indexed attendee)')

export function useBlockchainUserProfile(): UserProfileData {
  const { address, walletClient } = useWallet()
  const { events, loading: eventsLoading, error: eventsError } = useOnChainEvents()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [rsvpedEventIds, setRsvpedEventIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address || eventsLoading || eventsError || !events.length) {
      return
    }

    const fetchUserAttendanceData = async () => {
      setLoading(true)
      setError(null)

      try {
        const contract = getEventContract()
        
        // Get RSVP logs for this user
        const rsvpLogs = await publicClient.getLogs({
          address: contract.address,
          event: RSVP_EVENT,
          args: {
            attendee: address as `0x${string}`,
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        })

        // Get ticket purchase logs for this user
        const ticketLogs = await publicClient.getLogs({
          address: contract.address,
          event: TICKET_PURCHASED_EVENT,
          args: {
            attendee: address as `0x${string}`,
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        })

        // Extract event IDs from logs
        const rsvpEventIds = rsvpLogs.map(log => log.args.eventId?.toString()).filter(Boolean) as string[]
        const ticketEventIds = ticketLogs.map(log => log.args.eventId?.toString()).filter(Boolean) as string[]
        
        // Combine all attended event IDs
        const allAttendedEventIds = [...new Set([...rsvpEventIds, ...ticketEventIds])]
        setRsvpedEventIds(allAttendedEventIds)

        // Generate tickets for purchased events
        const userTickets: UserTicket[] = await Promise.all(ticketLogs.map(async (log, index) => {
          const eventId = log.args.eventId?.toString() || ''
          const event = events.find(e => e.id.toString() === eventId)
          
          // Get the actual block timestamp instead of block number
          let timestamp = Date.now() / 1000 // fallback to current time
          try {
            if (log.blockNumber) {
              const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
              timestamp = Number(block.timestamp)
            }
          } catch (error) {
            console.warn('Failed to get block timestamp, using current time')
          }
          
          return {
            id: `${eventId}-${log.transactionHash}`,
            eventId,
            eventTitle: event?.title || 'Unknown Event',
            tokenId: `${log.blockNumber}-${log.logIndex}`, // Use block and log index as token ID
            image: event?.image || "/placeholder.svg",
            txHash: log.transactionHash || '',
            timestamp: Math.floor(timestamp)
          }
        }))

        setTickets(userTickets)
      } catch (err: any) {
        console.error('Error fetching blockchain user data:', err)
        setError(err.message || "Failed to fetch user profile data from blockchain")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAttendanceData()
  }, [address, events, eventsLoading, eventsError])

  // Filter events by user relationship
  const attendingEvents = address ? events.filter(event => 
    rsvpedEventIds.includes(event.id.toString())
  ) : []

  const organizedEvents = address ? events.filter(event =>
    event.organizer.toLowerCase() === address.toLowerCase()
  ) : []

  // Function to transfer a ticket NFT
  const transferTicket = async (tokenId: string, toAddress: string): Promise<void> => {
    try {
      if (!walletClient) {
        throw new Error("Wallet not connected")
      }

      const contract = getEventContract()

      // Transfer the NFT ticket using safeTransferFrom
      await walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'safeTransferFrom',
        args: [address as `0x${string}`, toAddress as `0x${string}`, BigInt(tokenId)],
      })
      
      // Refresh tickets after successful transfer
      // The useEffect will automatically refetch the user's tickets
    } catch (error: any) {
      console.error('Error transferring ticket:', error)
      throw new Error(error.message || 'Failed to transfer ticket')
    }
  }

  return {
    attendingEvents,
    organizedEvents,
    tickets,
    loading: loading || eventsLoading,
    error: error || eventsError,
    transferTicket
  }
}

// Blockchain-based functions for RSVP management
export async function rsvpToEvent(eventId: string, userAddress: string, walletClient?: any): Promise<void> {
  try {
    if (!walletClient) {
      throw new Error("Wallet not connected")
    }

    const contract = getEventContract()

    await walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'rsvpOrPurchase',
      args: [BigInt(eventId)],
    })
  } catch (error: any) {
    console.error('Error RSVPing to event:', error)
    throw new Error(error.message || 'Failed to RSVP to event')
  }
}

export async function checkUserRSVP(eventId: string, userAddress: string): Promise<boolean> {
  try {
    const contract = getEventContract()
    
    const hasRSVP = await publicClient.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'hasRSVPed',
      args: [BigInt(eventId), userAddress as `0x${string}`],
    }) as boolean

    return hasRSVP
  } catch (error: any) {
    console.error('Error checking RSVP status:', error)
    return false
  }
}

export async function markEventAttendance(eventId: string, attendeeAddress: string, walletClient?: any): Promise<void> {
  try {
    if (!walletClient) {
      throw new Error("Wallet not connected")
    }

    const contract = getEventContract()

    await walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'markAttendance',
      args: [BigInt(eventId), attendeeAddress as `0x${string}`],
    })
  } catch (error: any) {
    console.error('Error marking attendance:', error)
    throw new Error(error.message || 'Failed to mark attendance')
  }
}

// Legacy functions for backward compatibility (now using blockchain)
export const markEventAsAttended = rsvpToEvent
export const hasUserRSVPed = checkUserRSVP
