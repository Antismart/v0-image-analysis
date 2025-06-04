/**
 * Event Chat Integration Hook
 * Manages automatic XMTP group membership for event attendees
 */

import { useEffect, useCallback } from 'react'
import { useXMTP } from '@/context/xmtp-context'
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
  const { events } = useOnChainEvents()
  
  // Find the event
  const event = events.find(e => e.id === eventId)
  const groupId = xmtpGroupId || event?.xmtpGroupId
  
  const { monitorNewAttendees } = useAutoGroupManagement(eventId, xmtpClient, groupId)

  // Sync group membership with current attendees
  const syncAttendees = useCallback(async () => {
    if (!isConnected || !xmtpClient || !groupId) {
      console.log('Cannot sync attendees: missing requirements')
      return
    }

    try {
      console.log(`Syncing attendees for event ${eventId} with group ${groupId}`)
      await syncGroupMembership(eventId, groupId, xmtpClient)
      console.log('Successfully synced group membership')
    } catch (error) {
      console.error('Error syncing group membership:', error)
    }
  }, [isConnected, xmtpClient, eventId, groupId])

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
        console.log(`Monitoring new attendees for event ${eventId}`)
      } catch (error) {
        console.error('Error setting up attendee monitoring:', error)
      }
    }

    setupMonitoring()

    return () => {
      if (cleanup) {
        cleanup()
        console.log(`Stopped monitoring attendees for event ${eventId}`)
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
