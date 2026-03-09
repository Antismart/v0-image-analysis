/**
 * XMTP Group Management Utility
 * Handles automatic group membership for event attendees
 */

import { getEventContract, publicClient } from "@/lib/contract"
import { parseAbiItem } from "viem"
import type { Client } from "@xmtp/browser-sdk"

// Event signatures for filtering logs
const RSVP_EVENT = parseAbiItem('event RSVP(uint256 indexed eventId, address indexed attendee)')
const TICKET_PURCHASED_EVENT = parseAbiItem('event TicketPurchased(uint256 indexed eventId, address indexed attendee)')

export interface GroupMembershipManager {
  addAttendeeToGroup: (eventId: string, attendeeAddress: string, xmtpClient?: Client, groupId?: string) => Promise<boolean>
  getEventAttendees: (eventId: string) => Promise<string[]>
  syncGroupMembership: (eventId: string, groupId: string, xmtpClient?: Client) => Promise<void>
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
  xmtpClient?: Client,
  groupId?: string
): Promise<boolean> {
  if (!xmtpClient) {
    return false
  }

  try {
    // Find inbox ID for the attendee's address (V3 method)
    // @ts-expect-error XMTP SDK type mismatch
    const inboxId = await xmtpClient.getInboxIdByAddress(attendeeAddress)

    if (!inboxId) {
      return false
    }

    // If no group ID provided, try to get it from the event data
    let eventGroupId = groupId
    if (!eventGroupId) {
      return false
    }

    // Get the group conversation (V3 method)
    const conversations = await xmtpClient.conversations.list()
    const group = conversations.find((conv: { id: string; conversationType?: string }) => conv.id === eventGroupId && conv.conversationType === 'group')

    if (!group) {
      console.error(`Group ${eventGroupId} not found`)
      return false
    }

    // Add the member to the group (V3 method)
    // @ts-expect-error XMTP SDK type mismatch
    await group.addMembers([inboxId])

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
  xmtpClient?: Client
): Promise<void> {
  if (!xmtpClient) {
    return
  }

  try {
    // Get all current attendees from blockchain
    const attendees = await getEventAttendees(eventId)

    if (attendees.length === 0) {
      return
    }

    // Get the group conversation (V3 method)
    const conversations = await xmtpClient.conversations.list()
    const group = conversations.find((conv: { id: string; conversationType?: string }) => conv.id === groupId && conv.conversationType === 'group')

    if (!group) {
      const errMsg = `Group ${groupId} not found`;
      console.error(errMsg)
      throw new Error(errMsg)
    }

    // Get current group members (V3 method)
    let currentMembers: string[] = []
    try {
      const memberList = await group.members()
      currentMembers = memberList.map((member: { inboxId: string }) => member.inboxId).filter(Boolean)
    } catch (error) {
      // Could not get current group members
    }

    // Find attendees who need to be added (convert addresses to inbox IDs)
    const attendeeInboxIds: string[] = []
    for (const attendee of attendees) {
      try {
        // @ts-expect-error XMTP SDK type mismatch
        const inboxId = await xmtpClient.getInboxIdByAddress(attendee)
        if (inboxId && !currentMembers.includes(inboxId)) {
          attendeeInboxIds.push(inboxId)
        }
      } catch (error) {
        // Could not get inbox ID for attendee
      }
    }

    if (attendeeInboxIds.length === 0) {
      return
    }

    // Add members to the group (V3 batch method)
    try {
      // @ts-expect-error XMTP SDK type mismatch
      await group.addMembers(attendeeInboxIds)
    } catch (error) {
      console.error('Error adding members to group:', error)
      // Fallback: try adding members one by one
      for (const inboxId of attendeeInboxIds) {
        try {
          // @ts-expect-error XMTP SDK type mismatch
          await group.addMembers([inboxId])
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
export function useAutoGroupManagement(eventId: string, xmtpClient?: Client, groupId?: string) {
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
            const typedLog = log as { args?: { attendee?: string } }
            const attendeeAddress = typedLog.args?.attendee
            if (attendeeAddress) {
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
            const typedLog = log as { args?: { attendee?: string } }
            const attendeeAddress = typedLog.args?.attendee
            if (attendeeAddress) {
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
