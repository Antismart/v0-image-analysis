"use client"

import { useQuery } from "@tanstack/react-query"
import { type Abi } from "viem"
import { getEventContract, publicClient } from "@/lib/contract"

export interface OnChainEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  image: string
  isTokenGated: boolean
  attendees: number
  capacity: number
  ticketPrice: number
  xmtpGroupId?: string
  cancelled?: boolean
  schedule?: Array<{ title: string; time: string; description: string }>
  speakers?: Array<{ name: string; title: string; bio: string; avatar?: string }>
}

async function fetchEvents(): Promise<OnChainEvent[]> {
  const contract = getEventContract()

  // Get total number of events
  const nextEventId = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'nextEventId',
  }) as bigint

  const count = Number(nextEventId)
  if (count === 0) return []

  // Batch all event reads using multicall
  const calls = Array.from({ length: count }, (_, i) => ({
    address: contract.address as `0x${string}`,
    abi: contract.abi as Abi,
    functionName: 'events' as const,
    args: [BigInt(i)],
  }))

  const results = await publicClient.multicall({ contracts: calls })

  const events: OnChainEvent[] = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.status !== 'success' || !result.result) continue

    // Struct field order from the contract:
    //  [0]  title          (string)
    //  [1]  description    (string)
    //  [2]  dateTime       (bigint)
    //  [3]  location       (string)
    //  [4]  organizer      (string)
    //  [5]  capacity       (bigint)
    //  [6]  ticketPrice    (bigint)
    //  [7]  imageUrl       (string)
    //  [8]  usdcToken      (string)
    //  [9]  gateToken      (string)
    //  [10] minTokenBalance(bigint)
    //  [11] isERC721Gate   (boolean)
    //  [12] nftTicketing   (boolean)
    //  [13] nftTicketAddress(string)
    //  [14] xmtpGroupId    (string)
    //  [15] attendeeCount  (bigint)
    //  [16] cancelled      (boolean)
    const data = result.result as unknown[]

    try {
      const event: OnChainEvent = {
        id: i.toString(),
        title: String(data[0] || ''),
        description: String(data[1] || ''),
        date: new Date(Number(data[2]) * 1000).toISOString(),
        location: String(data[3] || ''),
        organizer: String(data[4] || ''),
        capacity: Number(data[5] || 0),
        ticketPrice: Number(data[6] || 0) / 1e6, // USDC has 6 decimals
        image: String(data[7] || ''),
        // Token-gated if gateToken is not zero address and minTokenBalance > 0
        isTokenGated:
          Boolean(data[9]) &&
          String(data[9]) !== '0x0000000000000000000000000000000000000000' &&
          BigInt(data[10] as bigint) > BigInt(0),
        attendees: Number(data[15] || 0),
        xmtpGroupId: data[14] ? String(data[14]) : undefined,
        cancelled: Boolean(data[16]),
      }

      // Hydrate schedule and speakers from localStorage (not on-chain)
      if (typeof window !== 'undefined') {
        try {
          const scheduleStr = localStorage.getItem(`event-schedule-${i}`)
          if (scheduleStr) event.schedule = JSON.parse(scheduleStr)
          const speakersStr = localStorage.getItem(`event-speakers-${i}`)
          if (speakersStr) event.speakers = JSON.parse(speakersStr)
        } catch (e) {
          // Ignore localStorage parse errors
        }
      }

      events.push(event)
    } catch (e) {
      console.error(`Error parsing event ${i}:`, e)
    }
  }

  return events.reverse() // Newest first
}

export function useOnChainEvents() {
  const { data: events = [], isLoading: loading, error } = useQuery({
    queryKey: ['onchain-events'],
    queryFn: fetchEvents,
    staleTime: 30_000, // 30 seconds
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined', // Only run on client
  })

  return {
    events,
    loading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch events') : null,
  }
}
