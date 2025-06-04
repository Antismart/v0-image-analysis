/**
 * XMTP Group Management Utility
 * Handles automatic group membership for event attendees
 */

import { getEventContract, publicClient } from "@/lib/contract"
import { parseAbiItem } from "viem"

// Event signatures for filtering logs
const RSVP_EVENT = parseAbiItem('event RSVP(uint256 indexed eventId, address indexed attendee)')
const TICKET_PURCHASED_EVENT = parseAbiItem('event TicketPurchased(uint256 indexed eventId, address indexed attendee)')

export interface GroupMembershipManager {
  addAttendeeToGroup: (eventId: string, attendeeAddress: string, xmtpClient?: any, groupId?: string) => Promise<boolean>
  getEventAttendees: (eventId: string) => Promise<string[]>
  syncGroupMembership: (eventId: string, groupId: string, xmtpClient?: any) => Promise<void>
}

/**
 * Get all attendees for an event (both RSVP and ticket purchasers)
  */
export async function getEventAttendees(eventId: string): Promise<string[]> {
  try {
    const contract = getEventContract()
    
    // Get RSVP logs for this event
    const rsvpLogs = await publicClient.getLogs({
      address: contract.address,
      event: RSVP_EVENT,
      args: {
        eventId: BigInt(eventId),
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    })

    // Get ticket purchase logs for this event
    const ticketLogs = await publicClient.getLogs({
      address: contract.address,
      event: TICKET_PURCHASED_EVENT,
      args: {
        eventId: BigInt(eventId),
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    })

    // Extract unique attendee addresses
    const rsvpAttendees = rsvpLogs.map(log => log.args.attendee as string).filter(Boolean)
    const ticketAttendees = ticketLogs.map(log => log.args.attendee as string).filter(Boolean)
    
    // Combine and deduplicate
    const allAttendees = [...new Set([...rsvpAttendees, ...ticketAttendees])]
    
    return allAttendees
  } catch (error) {
    console.error('Error fetching event attendees:', error)
    return []
  }
}

/**
 * Add a new attendee to the event's XMTP group
 */
export async function addAttendeeToGroup(
  eventId: string, 
  attendeeAddress: string, 
  xmtpClient?: any,
  groupId?: string
): Promise<boolean> {
  if (!xmtpClient) {
    console.log('No XMTP client available for group management')
    return false
  }

  try {
    // Find inbox ID for the attendee's address
    const inboxId = await xmtpClient.getInboxIdByAddress(attendeeAddress)
    
    if (!inboxId) {
      console.log(`Attendee ${attendeeAddress} is not on XMTP network yet`)
      return false
    }

    // If no group ID provided, try to get it from the event data
    let eventGroupId = groupId
    if (!eventGroupId) {
      // In a real implementation, you'd fetch this from your event storage
      // For now, we'll just log and return
      console.log(`No group ID provided for event ${eventId}`)
      return false
    }

    console.log(`Adding attendee ${attendeeAddress} (inbox: ${inboxId}) to group ${eventGroupId}`)
    
    // Get the group
    const groups = await xmtpClient.conversations.listGroups()
    const group = groups.find((g: any) => g.id === eventGroupId)
    
    if (!group) {
      console.error(`Group ${eventGroupId} not found`)
      return false
    }

    // Add the member to the group
    await group.addMembers([inboxId])
    console.log(`Successfully added ${attendeeAddress} to group ${eventGroupId}`)
    
    return true
  } catch (error) {
    console.error(`Error adding attendee ${attendeeAddress} to group:`, error)
    return false
  }
}

/**
 * Sync group membership with current event attendees
 * This ensures all current attendees are in the group
 */
export async function syncGroupMembership(
  eventId: string, 
  groupId: string, 
  xmtpClient?: any
): Promise<void> {
  if (!xmtpClient) {
    console.log('No XMTP client available for group sync')
    return
  }

  try {
    // Get all current attendees from blockchain
    const attendees = await getEventAttendees(eventId)
    
    if (attendees.length === 0) {
      console.log(`No attendees found for event ${eventId}`)
      return
    }

    console.log(`Syncing group membership for ${attendees.length} attendees`)

    // Get the group
    const groups = await xmtpClient.conversations.listGroups()
    const group = groups.find((g: any) => g.id === groupId)
    
    if (!group) {
      console.error(`Group ${groupId} not found`)
      return
    }

    // Get current group members
    let currentMembers: string[] = []
    try {
      const memberList = await group.members()
      currentMembers = memberList.map((member: any) => member.addresses[0]).filter(Boolean)
    } catch (error) {
      console.log('Could not get current group members')
    }

    // Find attendees who need to be added
    const attendeesToAdd = attendees.filter(attendee => 
      !currentMembers.includes(attendee.toLowerCase())
    )

    if (attendeesToAdd.length === 0) {
      console.log('All attendees are already in the group')
      return
    }

    console.log(`Adding ${attendeesToAdd.length} new attendees to group`)

    // Add each attendee to the group
    for (const attendee of attendeesToAdd) {
      await addAttendeeToGroup(eventId, attendee, xmtpClient, groupId)
    }

  } catch (error) {
    console.error('Error syncing group membership:', error)
  }
}

/**
 * Hook to monitor blockchain events and automatically add attendees to groups
 */
export function useAutoGroupManagement(eventId: string, xmtpClient?: any, groupId?: string) {
  const monitorNewAttendees = async () => {
    if (!xmtpClient || !groupId) return

    try {
      const contract = getEventContract()
      
      // Monitor new RSVP events
      const rsvpUnwatch = publicClient.watchContractEvent({
        address: contract.address,
        abi: contract.abi,
        eventName: 'RSVP',
        args: { eventId: BigInt(eventId) },
        onLogs: async (logs) => {
          for (const log of logs) {
            // Type assertion for the log with proper args structure
            const typedLog = log as any
            const attendeeAddress = typedLog.args?.attendee as string
            if (attendeeAddress) {
              console.log(`New RSVP detected for event ${eventId}: ${attendeeAddress}`)
              await addAttendeeToGroup(eventId, attendeeAddress, xmtpClient, groupId)
            }
          }
        }
      })

      // Monitor new ticket purchases
      const ticketUnwatch = publicClient.watchContractEvent({
        address: contract.address,
        abi: contract.abi,
        eventName: 'TicketPurchased',
        args: { eventId: BigInt(eventId) },
        onLogs: async (logs) => {
          for (const log of logs) {
            // Type assertion for the log with proper args structure
            const typedLog = log as any
            const attendeeAddress = typedLog.args?.attendee as string
            if (attendeeAddress) {
              console.log(`New ticket purchase detected for event ${eventId}: ${attendeeAddress}`)
              await addAttendeeToGroup(eventId, attendeeAddress, xmtpClient, groupId)
            }
          }
        }
      })

      return () => {
        rsvpUnwatch()
        ticketUnwatch()
      }
    } catch (error) {
      console.error('Error setting up group management monitoring:', error)
    }
  }

  return { monitorNewAttendees }
}

export default {
  getEventAttendees,
  addAttendeeToGroup,
  syncGroupMembership,
  useAutoGroupManagement
}
