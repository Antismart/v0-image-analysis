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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !eventGroup) return

    try {
      await sendMessage(eventGroup, message.trim())
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      // Could show error toast here
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isOwnMessage = (senderInboxId: string) => {
    return senderInboxId === inboxId || senderInboxId === address
  }

  const truncateAddress = (identifier: string) => {
    if (identifier === inboxId || identifier === address) return "You"
    return `${identifier.slice(0, 6)}...${identifier.slice(-4)}`
  }

  // Show loading state while checking access
  if (checkingAccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Checking access permissions...</p>
      </div>
    )
  }

  // Show access denied if user hasn't RSVP'd or bought ticket
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Event Chat Access Required</h3>
          <p className="text-muted-foreground mb-4">
            You need to RSVP or purchase a ticket to access the event chat group.
          </p>
          <p className="text-sm text-muted-foreground">
            Only event attendees can participate in the group discussion.
          </p>
        </div>
      </div>
    )
  }

  // Show XMTP connection UI if not connected
  if (!isXmtpConnected && !isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <ChatIllustration className="mb-6 max-w-[200px]" />
        <h3 className="mb-2 text-xl font-semibold">Connect to XMTP</h3>
        <p className="mb-4 text-muted-foreground">Connect to XMTP to join the event chat and interact with other attendees.</p>
        <Button onClick={connectXmtp} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect to XMTP"}
        </Button>
      </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Connecting to XMTP...</p>
      </div>
    )
  }

  // Show loading state while finding/joining group
  if (isLoadingGroup) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Joining event chat group...</p>
      </div>
    )
  }

  // Show error if group not found
  if (!eventGroup && currentEvent?.xmtpGroupId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Chat Group Not Available</h3>
          <p className="text-muted-foreground mb-4">
            The event chat group could not be found or you don't have access yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact the event organizer if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  // Show placeholder if no group ID configured
  if (!currentEvent?.xmtpGroupId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center space-y-4">
        <ChatIllustration className="mb-6 max-w-[200px]" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Chat Not Configured</h3>
          <p className="text-muted-foreground">
            This event doesn't have a chat group configured yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Event Chat</h3>
          {attendeeCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {attendeeCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAI(!showAI)}
          aria-label="Toggle AI Assistant"
          className="flex items-center gap-1"
        >
          <PanelRightOpen className="h-4 w-4" />
          <span className="hidden sm:inline">{showAI ? "Hide Assistant" : "Show Assistant"}</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className={`flex flex-1 flex-col ${showAI ? "md:w-1/2" : "w-full"}`}>
          <Tabs defaultValue="chat" className="flex-1">
            <div className="border-b px-4">
              <TabsList className="h-10">
                <TabsTrigger value="chat" className="data-[state=active]:bg-background">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="announcements" className="data-[state=active]:bg-background">
                  Announcements
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 overflow-y-auto p-4 data-[state=active]:flex-1">
              <div className="space-y-4">
                {realTimeMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto mb-4">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Welcome to the event chat! Start the conversation.
                    </p>
                  </div>
                ) : (
                  realTimeMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${isOwnMessage(msg.sender) ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                          isOwnMessage(msg.sender)
                            ? "bg-pamoja-500 text-white"
                            : msg.isAnnouncement
                              ? "bg-unity-50 border dark:bg-unity-950/30"
                              : "bg-muted"
                        }`}
                      >
                        {!isOwnMessage(msg.sender) && (
                          <div className="mb-1 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-unity-200 text-unity-700">
                                {msg.sender.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium truncate">{truncateAddress(msg.sender)}</span>
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.content}</p>
                        <div
                          className={`mt-1 text-right text-xs ${
                            isOwnMessage(msg.sender) ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {realTimeMessages
                  .filter((msg) => msg.isAnnouncement)
                  .map((msg) => (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg border bg-unity-50 p-3 dark:bg-unity-950/30">
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-unity-200 text-unity-700">
                              {msg.sender.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{truncateAddress(msg.sender)}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <div className="mt-1 text-right text-xs text-muted-foreground">{formatTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                {realTimeMessages.filter(msg => msg.isAnnouncement).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No announcements yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t p-3 sm:p-4">
            <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()} className="flex-shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {showAI && (
          <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l">
            <AIChatAssistant eventId={eventId} />
          </div>
        )}
      </div>
    </div>
  )
}
