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
    // Find inbox ID for the attendee's address (V3 method)
    const inboxId = await xmtpClient.getInboxIdByAddress(attendeeAddress)
    
    if (!inboxId) {
      console.log(`Attendee ${attendeeAddress} is not on XMTP network yet`)
      return false
    }

    // If no group ID provided, try to get it from the event data
    let eventGroupId = groupId
    if (!eventGroupId) {
      console.log(`No group ID provided for event ${eventId}`)
      return false
    }
    
    console.log(`Adding attendee ${attendeeAddress} (inbox: ${inboxId}) to group ${eventGroupId}`)
    
    // Get the group conversation (V3 method)
    const conversations = await xmtpClient.conversations.list()
    const group = conversations.find((conv: any) => conv.id === eventGroupId && conv.conversationType === 'group')
    
    if (!group) {
      console.error(`Group ${eventGroupId} not found`)
      return false
    }

    // Add the member to the group (V3 method)
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

    // Get the group conversation (V3 method)
    const conversations = await xmtpClient.conversations.list()
    const group = conversations.find((conv: any) => conv.id === groupId && conv.conversationType === 'group')
    
    if (!group) {
      console.error(`Group ${groupId} not found`)
      return
    }

    // Get current group members (V3 method)
    let currentMembers: string[] = []
    try {
      const memberList = await group.members()
      currentMembers = memberList.map((member: any) => member.inboxId).filter(Boolean)
    } catch (error) {
      console.log('Could not get current group members')
    }

    // Find attendees who need to be added (convert addresses to inbox IDs)
    const attendeeInboxIds: string[] = []
    for (const attendee of attendees) {
      try {
        const inboxId = await xmtpClient.getInboxIdByAddress(attendee)
        if (inboxId && !currentMembers.includes(inboxId)) {
          attendeeInboxIds.push(inboxId)
        }
      } catch (error) {
        console.log(`Could not get inbox ID for ${attendee}`)
      }
    }

    if (attendeeInboxIds.length === 0) {
      console.log('All attendees are already in the group')
      return
    }

    console.log(`Adding ${attendeeInboxIds.length} new attendees to group`)

    // Add members to the group (V3 batch method)
    try {
      await group.addMembers(attendeeInboxIds)
      console.log(`Successfully added ${attendeeInboxIds.length} members to group ${groupId}`)
    } catch (error) {
      console.error('Error adding members to group:', error)
      // Fallback: try adding members one by one
      for (const inboxId of attendeeInboxIds) {
        try {
          await group.addMembers([inboxId])
          console.log(`Successfully added member ${inboxId} to group`)
        } catch (memberError) {
          console.error(`Failed to add member ${inboxId}:`, memberError)
        }
      }
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
