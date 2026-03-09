/**
 * Event Chat Integration Hook
 * Manages automatic XMTP group membership for event attendees
 */

import { useEffect, useCallback } from 'react'
import { useXMTP } from '@/context/xmtp-context'
import { useWallet } from '@/context/wallet-context'
import { useOnChainEvents } from '@/hooks/use-onchain-events'
import { getEventAttendees, syncGroupMembership, useAutoGroupManagement } from '@/lib/xmtp-group-manager'

interface UseEventChatIntegrationProps {
  eventId: string
  xmtpGroupId?: string
  autoSync?: boolean
  enableMonitoring?: boolean
}

export function useEventChatIntegration({
  eventId,
  xmtpGroupId,
  autoSync = true,
  enableMonitoring = true
}: UseEventChatIntegrationProps) {
  const { xmtpClient, isConnected } = useXMTP()
  const { address } = useWallet()
  const { events } = useOnChainEvents()
  
  // Find the event
  const event = events.find(e => e.id === eventId)
  const groupId = xmtpGroupId || event?.xmtpGroupId
  
  const { monitorNewAttendees } = useAutoGroupManagement(eventId, xmtpClient ?? undefined, groupId)

  // Sync group membership with current attendees
  const syncAttendees = useCallback(async () => {
    if (!isConnected || !xmtpClient || !groupId) {
      return
    }

    try {
      await syncGroupMembership(eventId, groupId, xmtpClient)
    } catch (error: unknown) {
      // If group not found and user is organizer, create group and retry
      const errorMessage = error instanceof Error ? error.message : ''
      if (
        errorMessage.includes('Group') &&
        errorMessage.includes('not found') &&
        event &&
        xmtpClient &&
        address &&
        event.organizer?.toLowerCase() === address.toLowerCase()
      ) {
        try {
          const groupName = `${event.title} - Event Chat`
          const groupDescription = `Discussion group for the event: ${event.title}`
          const newGroup = await xmtpClient.conversations.newGroup([], {
            name: groupName,
            description: groupDescription,
          })
          if (newGroup) {
            await syncGroupMembership(eventId, newGroup.id, xmtpClient)
          }
        } catch (createError) {
          console.error('Error creating group as organizer:', createError)
        }
      } else {
        console.error('Error syncing group membership:', error)
      }
    }
  }, [isConnected, xmtpClient, groupId, event, eventId, address])

  // Get current attendees count
  const getAttendeesCount = useCallback(async (): Promise<number> => {
    try {
      const attendees = await getEventAttendees(eventId)
      return attendees.length
    } catch (error) {
      console.error('Error getting attendees count:', error)
      return 0
    }
  }, [eventId])

  // Initial sync when XMTP becomes available
  useEffect(() => {
    if (autoSync && isConnected && xmtpClient && groupId) {
      syncAttendees()
    }
  }, [autoSync, isConnected, xmtpClient, groupId, syncAttendees])

  // Set up monitoring for new attendees
  useEffect(() => {
    if (!enableMonitoring || !isConnected || !xmtpClient) {
      return
    }

    let cleanup: (() => void) | undefined

    const setupMonitoring = async () => {
      try {
        cleanup = await monitorNewAttendees()
      } catch (error) {
        console.error('Error setting up attendee monitoring:', error)
      }
    }

    setupMonitoring()

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [enableMonitoring, isConnected, xmtpClient, eventId, monitorNewAttendees])

  return {
    syncAttendees,
    getAttendeesCount,
    isReady: isConnected && !!xmtpClient && !!groupId,
    event,
    groupId
  }
}

export default useEventChatIntegration
