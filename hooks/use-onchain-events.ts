import { useEffect, useState } from "react"
import { publicClient, CONTRACT_ADDRESS } from "@/lib/contract"
import EventContractABI from "@/contracts/EventContractABI.json"
import { Address } from "viem"

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
  schedule?: any[]
  speakers?: any[]
}

export function useOnChainEvents() {
  const [events, setEvents] = useState<OnChainEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false;
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        // Get the nextEventId (number of events)
        const nextEventId = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EventContractABI,
          functionName: "nextEventId",
        }) as bigint
        const count = Number(nextEventId)
        if (count === 0) {
          setEvents([])
          setLoading(false)
          return
        }
        // Fetch all events by index in parallel, but limit concurrency for performance
        const concurrency = 5;
        let allEvents: OnChainEvent[] = [];
        for (let i = 0; i < count; i += concurrency) {
          if (cancelled) return;
          const chunk = Array.from({ length: Math.min(concurrency, count - i) }).map(async (_, j) => {
            const idx = i + j;
            const event = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: EventContractABI,
              functionName: "events",
              args: [BigInt(idx)],
            }) as [
              string, // title
              string, // description
              bigint, // dateTime
              string, // location
              string, // organizer
              bigint, // capacity
              bigint, // ticketPrice
              string, // imageUrl
              string, // usdcToken
              string, // gateToken
              bigint, // minTokenBalance
              boolean, // isERC721Gate
              boolean, // nftTicketing
              string, // nftTicketAddress
              string, // xmtpGroupId
              bigint, // attendeeCount
              boolean // cancelled
            ];
            return {
              id: idx.toString(),
              title: event[0],
              description: event[1],
              date: new Date(Number(event[2]) * 1000).toISOString(),
              location: event[3],
              organizer: event[4],
              capacity: Number(event[5]),
              ticketPrice: Number(event[6]) / 1e6, // USDC has 6 decimals
              image: event[7],
              // Token-gated if gateToken is not zero address and minTokenBalance > 0
              isTokenGated:
                (event[9] && event[9] !== "0x0000000000000000000000000000000000000000" && BigInt(event[10]) > 0),
              attendees: Number(event[15]), // attendeeCount
              xmtpGroupId: event[14],
              cancelled: Boolean(event[16]),
              // Hydrate schedule and speakers from localStorage if available (not on-chain)
              schedule: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`event-schedule-${idx}`) || '[]') : [],
              speakers: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`event-speakers-${idx}`) || '[]') : [],
            } as OnChainEvent;
          });
          const results = await Promise.all(chunk);
          allEvents = allEvents.concat(results);
        }
        if (!cancelled) setEvents(allEvents)
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to fetch events")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchEvents()
    return () => { cancelled = true; };
  }, [])

  return { events, loading, error }
}
