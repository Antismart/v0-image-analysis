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

interface EventGroupChatProps {
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
  senderInboxId: string
}

const EventGroupChat: React.FC<EventGroupChatProps> = ({ 
  eventId, 
  eventTitle, 
  xmtpGroupId, 
  isOrganizer = false 
}) => {
  const { xmtpClient, isConnected, connect, createGroup, joinGroup, isConnecting } = useXMTP()
  const { address } = useWallet()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [groupId, setGroupId] = useState<string | null>(null)
  const [memberCount, setMemberCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<any>(null)

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Initialize or join group chat
  const initializeChat = useCallback(async () => {
    if (!xmtpClient || !isConnected) return

    setIsLoading(true)
    try {
      let currentGroupId: string | null = null

      if (xmtpGroupId) {
        // Try to join existing group
        currentGroupId = await joinGroup(xmtpGroupId)
        if (!currentGroupId) {
          console.log("Could not find existing group, may need to be invited")
          toast({
            title: "Chat Not Available",
            description: "You may need to be invited to this event chat.",
            variant: "destructive",
          })
          return
        }
      } else if (isOrganizer) {
        // Create new group if organizer and no group exists
        currentGroupId = await createGroup(
          `${eventTitle} Chat`,
          `Official chat for ${eventTitle} event`
        )
        if (currentGroupId) {
          toast({
            title: "Chat Created",
            description: "Event chat has been created successfully!",
          })
        }
      }

      if (currentGroupId) {
        setGroupId(currentGroupId)
        
        // For the older XMTP API, we'll simulate group features
        // In a real implementation, you'd store group members and messages in your backend
        setMemberCount(1) // Simulate at least the current user
        
        // Simulate loading existing messages (empty for now)
        setMessages([])
        
        console.log("Chat initialized with group ID:", currentGroupId)
      }
    } catch (error) {
      console.error("Error initializing chat:", error)
      toast({
        title: "Chat Error",
        description: "Failed to initialize event chat.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [xmtpClient, isConnected, xmtpGroupId, eventTitle, isOrganizer, joinGroup, createGroup])

  // Initialize chat when XMTP is connected
  useEffect(() => {
    if (isConnected && xmtpClient && !groupId) {
      initializeChat()
    }

    // Cleanup stream on unmount
    return () => {
      if (streamRef.current) {
        try {
          streamRef.current.return?.()
        } catch (error) {
          console.error("Error closing message stream:", error)
        }
      }
    }
  }, [isConnected, xmtpClient, groupId, initializeChat])

  // Send message (simplified for older XMTP API)
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupId || !input.trim() || isSending) return

    setIsSending(true)
    try {
      // For the older XMTP API, we'll simulate sending messages
      // In a real implementation, you'd send this to your backend or use XMTP conversations
      const simulatedMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: address || "Unknown",
        content: input,
        timestamp: new Date(),
        senderInboxId: address || "Unknown",
      }
      
      setMessages(prev => [...prev, simulatedMessage])
      setInput("")
      
      console.log("Message simulated:", simulatedMessage)
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

  // Format address for display
  const formatAddress = (addr: string) => {
    if (addr.startsWith("0x") && addr.length === 42) {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }
    return addr.length > 12 ? `${addr.slice(0, 8)}...${addr.slice(-4)}` : addr
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Show connection prompt if not connected
  if (!isConnected && !isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/50">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Join Event Chat</h3>
        <p className="text-muted-foreground mb-4">Connect to XMTP to join the conversation</p>
        <Button onClick={connect} className="min-w-[120px]">
          Connect to Chat
        </Button>
      </div>
    )
  }

  // Show loading state
  if (isConnecting || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isConnecting ? "Connecting to XMTP..." : "Loading chat..."}
        </p>
      </div>
    )
  }

  // Show no chat available if not organizer and no group ID
  if (!groupId && !isOrganizer) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/50">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Chat Not Available</h3>
        <p className="text-muted-foreground">
          This event doesn&apos;t have a chat room set up yet.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Event Chat</h3>
            <p className="text-sm text-muted-foreground">{eventTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {memberCount}
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Be the first to say hello!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderInboxId === address
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {!isOwnMessage && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {formatAddress(message.sender).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">
                          {formatAddress(message.sender)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm break-words">{message.content}</p>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {groupId && (
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export default EventGroupChat
