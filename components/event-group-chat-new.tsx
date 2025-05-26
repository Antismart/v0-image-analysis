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
  conversationTopic?: string
}

const EventGroupChat: React.FC<EventGroupChatProps> = ({ 
  eventId, 
  eventTitle, 
  xmtpGroupId, 
  isOrganizer = false 
}) => {
  const { 
    xmtpClient, 
    isConnected, 
    connect, 
    createConversation, 
    getConversations, 
    sendMessage,
    streamAllMessages,
    isConnecting,
    conversations 
  } = useXMTP()
  const { address } = useWallet()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [eventConversation, setEventConversation] = useState<any>(null)
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

  // Find or create event conversation
  const initializeChat = useCallback(async () => {
    if (!xmtpClient || !isConnected || !address) return

    setIsLoading(true)
    try {
      // For simplicity, we'll use a hardcoded "event organizer" address for demonstration
      // In a real app, you'd get this from your event data
      const eventOrganizerAddress = "0x1234567890123456789012345678901234567890" // Demo address
      
      // Check if we already have a conversation with the event organizer
      const allConversations = await getConversations()
      let conversation = allConversations.find(conv => 
        conv.peerAddress.toLowerCase() === eventOrganizerAddress.toLowerCase()
      )

      // If no conversation exists and we're the organizer, create one with ourselves
      if (!conversation && isOrganizer) {
        // For demo purposes, create a conversation (this would normally be with participants)
        conversation = await createConversation(eventOrganizerAddress)
      }

      if (conversation) {
        setEventConversation(conversation)
        
        // Load existing messages from this conversation
        try {
          const existingMessages = await conversation.messages()
          const formattedMessages: Message[] = existingMessages.map((msg: any) => ({
            id: msg.id || `msg-${msg.sent.getTime()}`,
            sender: msg.senderAddress,
            content: msg.content,
            timestamp: msg.sent,
            conversationTopic: conversation.topic,
          }))
          
          setMessages(formattedMessages.reverse()) // Reverse to show oldest first
        } catch (error) {
          console.error("Error loading existing messages:", error)
          setMessages([])
        }

        // Set up real-time message streaming
        if (streamRef.current) {
          streamRef.current() // Clean up existing stream
        }

        try {
          const cleanup = await streamAllMessages((message: any) => {
            // Only add messages from our event conversation
            if (message.conversation?.topic === conversation.topic) {
              const newMessage: Message = {
                id: message.id || `msg-${message.sent.getTime()}`,
                sender: message.senderAddress,
                content: message.content,
                timestamp: message.sent,
                conversationTopic: conversation.topic,
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

        setMemberCount(2) // Simplified: just sender and receiver
        
        toast({
          title: "Chat Connected",
          description: "Event chat is ready for real-time messaging!",
        })
        
        console.log("Real XMTP chat initialized for event:", eventTitle)
      } else {
        toast({
          title: "Chat Not Available",
          description: "Event chat could not be initialized. Try connecting to XMTP first.",
          variant: "destructive",
        })
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
  }, [xmtpClient, isConnected, address, eventTitle, isOrganizer, getConversations, createConversation, streamAllMessages, toast])

  // Initialize chat when XMTP is connected
  useEffect(() => {
    if (isConnected && xmtpClient && !eventConversation && address) {
      initializeChat()
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
  }, [isConnected, xmtpClient, eventConversation, address, initializeChat])

  // Send real XMTP message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventConversation || !input.trim() || isSending) return

    setIsSending(true)
    try {
      const success = await sendMessage(eventConversation, input)
      
      if (success) {
        setInput("")
        console.log("Real XMTP message sent:", input)
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

  // Format sender address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "Unknown"
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Check if message is from current user
  const isOwnMessage = (sender: string) => {
    return sender?.toLowerCase() === address?.toLowerCase()
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Event Chat</h3>
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
                  Connect your wallet to XMTP to join the event chat
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
              <p className="text-sm text-gray-600">Setting up event chat...</p>
            </div>
          </div>
        ) : !eventConversation ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Chat Not Available</h4>
                <p className="text-sm text-gray-600">
                  Event chat could not be initialized
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
                        isOwnMessage(message.sender) && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {formatAddress(message.sender).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2",
                          isOwnMessage(message.sender)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {isOwnMessage(message.sender) ? "You" : formatAddress(message.sender)}
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

export default EventGroupChat
