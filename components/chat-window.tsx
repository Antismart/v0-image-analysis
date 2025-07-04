"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Smile, PanelRightOpen, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useXMTP } from "@/context/xmtp-context"
import { useWallet } from "@/context/wallet-context"
import { AIChatAssistant } from "@/components/ai-chat-assistant"
import { ChatIllustration } from "@/components/illustrations"
import { useOnChainEvents } from "@/hooks/use-onchain-events"
import { checkUserRSVP } from "@/hooks/use-blockchain-profile"
import { useEventChatIntegration } from "@/hooks/use-event-chat-integration"
import { upsertUser, createGroup as createDbGroup, addUserToGroup, sendMessage as sendDbMessage, getGroupMessages } from '@/lib/group-chat-service'

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: Date
  isAnnouncement?: boolean
}

interface ChatWindowProps {
  eventId: string
}

export function ChatWindow({ eventId }: ChatWindowProps) {
  const { address } = useWallet()
  const { events } = useOnChainEvents()
  const { isConnected: isXmtpConnected, connect: connectXmtp, isConnecting, xmtpClient, getUserGroups, sendMessage, streamAllMessages, createGroup, findInboxIdByAddress, inboxId } = useXMTP()
  
  // Use the event chat integration hook for automatic group management
  const { syncAttendees, getAttendeesCount, isReady, event, groupId } = useEventChatIntegration({
    eventId,
    autoSync: true,
    enableMonitoring: true
  })
  
  const [message, setMessage] = useState("")
  const [showAI, setShowAI] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [eventGroup, setEventGroup] = useState<any>(null)
  const [realTimeMessages, setRealTimeMessages] = useState<ChatMessage[]>([])
  const [isLoadingGroup, setIsLoadingGroup] = useState(false)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Find the current event (use the one from integration hook if available)
  const currentEvent = event || events.find(e => e.id === eventId)

  // Check if user has access to the chat (has RSVP'd or bought ticket)
  useEffect(() => {
    const checkChatAccess = async () => {
      if (!address || !currentEvent) {
        setCheckingAccess(false)
        return
      }

      try {
        // Check if user has RSVP'd or purchased a ticket for this event
        const userHasRSVP = await checkUserRSVP(eventId, address)
        const isOrganizer = address.toLowerCase() === currentEvent.organizer.toLowerCase()
        
        // Grant access if user has RSVP'd/bought ticket OR is the organizer
        setHasAccess(userHasRSVP || isOrganizer)
        
        // If user has access and integration is ready, sync attendees
        if ((userHasRSVP || isOrganizer) && isReady) {
          try {
            await syncAttendees()
            const count = await getAttendeesCount()
            setAttendeeCount(count)
          } catch (error) {
            console.error('Error syncing attendees:', error)
          }
        }
      } catch (error) {
        console.error('Error checking chat access:', error)
        setHasAccess(false)
      } finally {
        setCheckingAccess(false)
      }
    }

    checkChatAccess()
  }, [address, eventId, currentEvent, isReady, syncAttendees, getAttendeesCount])

  // Find and join the event group chat
  useEffect(() => {
    const findEventGroup = async () => {
      if (!isXmtpConnected || !hasAccess || !currentEvent?.xmtpGroupId) return
      setIsLoadingGroup(true)
      try {
        const groups = await getUserGroups()
        let group = groups.find(g => g.id === currentEvent.xmtpGroupId)
        if (group) {
          setEventGroup(group)
          console.log('Found event group:', group.id)
          // Get group member count
          try {
            const memberList = await group.members()
            setAttendeeCount(memberList.length)
          } catch (error) {
            console.log('Could not get member count')
          }
        } else {
          // If not found and user is organizer, create the group
          const isOrganizer = address && currentEvent && address.toLowerCase() === currentEvent.organizer.toLowerCase()
          if (isOrganizer) {
            try {
              const groupName = `${currentEvent.title} - Event Chat`
              const groupDescription = `Discussion group for the event: ${currentEvent.title}`
              const newGroup = await createGroup(groupName, groupDescription)
              if (newGroup) {
                setEventGroup(newGroup)
                console.log('Created new event group:', newGroup.id)
                // Optionally: update event.xmtpGroupId in your backend here
                // Optionally: show a toast or notification
                try {
                  const memberList = await newGroup.members()
                  setAttendeeCount(memberList.length)
                } catch (error) {
                  console.log('Could not get member count after creation')
                }
              } else {
                console.warn('Failed to create event group as organizer')
              }
            } catch (error) {
              console.error('Error creating event group as organizer:', error)
            }
          } else {
            console.log('Event group not found, user may need to be added')
          }
        }
      } catch (error) {
        console.error('Error finding event group:', error)
      } finally {
        setIsLoadingGroup(false)
      }
    }

    findEventGroup()
  }, [isXmtpConnected, hasAccess, currentEvent?.xmtpGroupId, getUserGroups])

  // Stream messages from the event group
  useEffect(() => {
    if (!eventGroup || !isXmtpConnected) return

    const setupMessageStream = async () => {
      try {
        const cleanup = await streamAllMessages((message: any) => {
          // Only show messages from the event group
          if (message.conversation?.id === eventGroup.id) {
            const newMessage: ChatMessage = {
              id: message.id,
              sender: message.senderInboxId || message.senderAddress || "unknown", // V3 uses senderInboxId
              content: message.content,
              timestamp: new Date(message.sent),
              isAnnouncement: false // Could add logic to detect announcements
            }
            
            setRealTimeMessages(prev => {
              // Avoid duplicates
              if (prev.find(m => m.id === newMessage.id)) return prev
              return [...prev, newMessage].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            })
          }
        })

        return cleanup
      } catch (error) {
        console.error('Error setting up message stream:', error)
      }
    }

    const cleanup = setupMessageStream()
    return () => {
      cleanup?.then(fn => fn?.())
    }
  }, [eventGroup, isXmtpConnected, streamAllMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [realTimeMessages])

  // After successfully joining/creating a group, ensure user and group are in DB
  useEffect(() => {
    if (eventGroup && address) {
      (async () => {
        try {
          if (typeof address === 'string') {
            await upsertUser(address)
            try {
              await createDbGroup(eventGroup.name || currentEvent?.title || 'Event Chat')
            } catch (e) { /* ignore if already exists */ }
            await addUserToGroup(address, eventGroup.id)
          }
        } catch (e) {
          console.error('DB sync error:', e)
        }
      })()
    }
  }, [eventGroup, address, currentEvent])

  // When sending a message, also store it in the DB
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !eventGroup || typeof address !== 'string') return

    try {
      await sendMessage(eventGroup, message.trim())
      await upsertUser(address)
      await sendDbMessage(address, eventGroup.id, message.trim())
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      // Could show error toast here
    }
  }

  // Optionally, fetch messages from DB on group join (for server-side history)
  useEffect(() => {
    if (eventGroup) {
      (async () => {
        try {
          const dbMessages = await getGroupMessages(eventGroup.id)
          // Optionally merge dbMessages with realTimeMessages
          // setRealTimeMessages([...dbMessages, ...realTimeMessages])
        } catch (e) {
          console.error('DB fetch error:', e)
        }
      })()
    }
  }, [eventGroup])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback>EV</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-sm font-semibold">{currentEvent?.title}</div>
            <div className="text-xs text-gray-400">{attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAI(prev => !prev)}>
          <Smile className="w-4 h-4 mr-2" />
          Talk to AI
        </Button>
      </div>

      {/* AI Assistant */}
      {showAI && (
        <div className="p-4 bg-gray-900 text-white">
          <AIChatAssistant eventId={eventId} />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Placeholder for no access */}
        {!hasAccess && (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            {checkingAccess ? (
              <>Checking your access to the chat...</>
            ) : (
              <>
                <Lock className="w-5 h-5 mb-2" />
                <div className="text-sm font-semibold">Chat Access Required</div>
                <div className="text-xs">You need to RSVP or purchase a ticket to access the chat.</div>
                <div className="mt-2">
                  <Button asChild>
                    <a href={currentEvent?.url} target="_blank" rel="noopener noreferrer">
                      View Event
                    </a>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actual chat UI */}
        {hasAccess && (
          <>
            {/* Messages List */}
            <div>
              {realTimeMessages.map(message => (
                <div key={message.id} className={`py-2 ${message.sender === address ? 'text-right' : 'text-left'}`}>
                  <div className={`text-xs ${message.sender === address ? 'text-blue-400' : 'text-gray-500'}`}>
                    {message.sender}
                  </div>
                  <div className={`inline-block px-3 py-2 rounded-lg ${message.sender === address ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Messages end spacer */}
            <div ref={messagesEndRef} className="h-4"></div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white border-t">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 mr-2"
                disabled={!hasAccess || isLoadingGroup}
              />
              <Button type="submit" disabled={!hasAccess || isLoadingGroup}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-800 text-white text-center text-xs">
        {hasAccess ? 'You are now connected to the event chat.' : 'Please wait while we check your access to the chat.'}
      </div>
    </div>
  )
}
