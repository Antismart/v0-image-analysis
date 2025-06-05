"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { useXMTP } from "@/context/xmtp-context"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, MessageCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface EventGroupChatV3Props {
  eventId: string
  eventTitle: string
  xmtpGroupId?: string
  isOrganizer?: boolean
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  senderInboxId?: string
}

/**
 * V3 Event Group Chat Component
 * Uses native XMTP V3 group functionality instead of DM conversations
 */
const EventGroupChatV3: React.FC<EventGroupChatV3Props> = ({ 
  eventId, 
  eventTitle, 
  xmtpGroupId, 
  isOrganizer = false 
}) => {
  const { 
    xmtpClient, 
    isConnected, 
    connect, 
    createGroup,
    getUserGroups,
    sendMessage,
    streamAllMessages,
    isConnecting,
    inboxId,
    addMembersToGroup,
    getGroupById
  } = useXMTP()
  const { address } = useWallet()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [eventGroup, setEventGroup] = useState<any>(null)
  const [memberCount, setMemberCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<(() => void) | null>(null)

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Find or create event group (V3 native groups)
  const initializeGroupChat = useCallback(async () => {
    if (!xmtpClient || !isConnected || !inboxId) return

    setIsLoading(true)
    try {
      let group = null

      // Try to find existing group first
      if (xmtpGroupId) {
        group = await getGroupById(xmtpGroupId)
        if (group) {
          console.log("Found existing group:", xmtpGroupId)
        }
      }

      // If no group found and user is organizer, create a new one
      if (!group && isOrganizer) {
        console.log("Creating new V3 group for event:", eventTitle)
        group = await createGroup(
          `${eventTitle} Chat`,
          `Official group chat for ${eventTitle} event attendees`,
          [] // Start with empty group, members will be added via group management
        )
        
        if (group) {
          console.log("Created new V3 group:", group.id)
          toast({
            title: "Group Created",
            description: "Event group chat has been created successfully!",
          })
        }
      }

      if (group) {
        setEventGroup(group)
        
        // Load existing messages from the group
        try {
          const existingMessages = await group.messages()
          const formattedMessages: Message[] = existingMessages.map((msg: any) => ({
            id: msg.id || `msg-${msg.sent?.getTime() || Date.now()}`,
            sender: msg.senderInboxId || "unknown",
            senderInboxId: msg.senderInboxId,
            content: msg.content,
            timestamp: msg.sent || new Date(),
          }))
          
          setMessages(formattedMessages.reverse()) // Reverse to show oldest first
        } catch (error) {
          console.error("Error loading existing messages:", error)
          setMessages([])
        }

        // Set up real-time message streaming for this group
        if (streamRef.current) {
          streamRef.current() // Clean up existing stream
        }

        try {
          const cleanup = await streamAllMessages((message: any) => {
            // Only add messages from our event group
            if (message.conversation?.id === group.id) {
              const newMessage: Message = {
                id: message.id || `msg-${Date.now()}`,
                sender: message.senderInboxId || "unknown",
                senderInboxId: message.senderInboxId,
                content: message.content,
                timestamp: message.sent || new Date(),
              }
              
              setMessages(prev => {
                // Avoid duplicate messages
                if (prev.some(m => m.id === newMessage.id)) {
                  return prev
                }
                return [...prev, newMessage]
              })
            }
          })
          
          streamRef.current = cleanup
        } catch (error) {
          console.error("Error setting up message stream:", error)
        }

        // Get member count
        try {
          const members = await group.members()
          setMemberCount(members.length)
        } catch (error) {
          console.log("Could not get member count")
          setMemberCount(1) // At least the current user
        }
        
        toast({
          title: "Group Chat Ready",
          description: "V3 group chat is ready for real-time messaging!",
        })
        
        console.log("V3 group chat initialized for event:", eventTitle)
      } else {
        toast({
          title: "Group Not Available",
          description: "Event group chat could not be found. Contact the organizer.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing group chat:", error)
      toast({
        title: "Group Chat Error",
        description: "Failed to initialize event group chat.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [xmtpClient, isConnected, inboxId, xmtpGroupId, eventTitle, isOrganizer, getGroupById, createGroup, streamAllMessages, toast])

  // Initialize group chat when XMTP is connected
  useEffect(() => {
    if (isConnected && xmtpClient && !eventGroup && inboxId) {
      initializeGroupChat()
    }

    // Cleanup stream on unmount
    return () => {
      if (streamRef.current) {
        try {
          streamRef.current()
        } catch (error) {
          console.error("Error closing message stream:", error)
        }
      }
    }
  }, [isConnected, xmtpClient, eventGroup, inboxId, initializeGroupChat])

  // Send message to the group
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventGroup || !input.trim() || isSending) return

    setIsSending(true)
    try {
      const success = await sendMessage(eventGroup, input)
      
      if (success) {
        setInput("")
        console.log("V3 group message sent:", input)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Send Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Format inbox ID for display
  const formatInboxId = (inboxId: string) => {
    if (!inboxId) return "Unknown"
    return `${inboxId.slice(0, 8)}...${inboxId.slice(-4)}`
  }

  // Check if message is from current user
  const isOwnMessage = (senderInboxId?: string) => {
    return senderInboxId === inboxId
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Event Group Chat</h3>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {memberCount}
          </Badge>
        </div>
        
        {!isConnected && (
          <Button
            onClick={connect}
            disabled={isConnecting}
            size="sm"
            className="flex items-center gap-2"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Connect to Chat
              </>
            )}
          </Button>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Connect to XMTP</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your wallet to XMTP to join the event group chat
                </p>
                <Button onClick={connect} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect to Chat"}
                </Button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-sm text-gray-600">Setting up group chat...</p>
            </div>
          </div>
        ) : !eventGroup ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Group Chat Not Available</h4>
                <p className="text-sm text-gray-600">
                  Event group chat could not be found or you don't have access
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwnMessage(message.senderInboxId) && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {isOwnMessage(message.senderInboxId) 
                            ? "You" 
                            : formatInboxId(message.senderInboxId || "").slice(0, 2).toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2",
                          isOwnMessage(message.senderInboxId)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {isOwnMessage(message.senderInboxId) 
                              ? "You" 
                              : formatInboxId(message.senderInboxId || "")
                            }
                          </span>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isSending}
                  size="sm"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EventGroupChatV3
