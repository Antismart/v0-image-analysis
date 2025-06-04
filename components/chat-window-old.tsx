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
  const { isConnected: isXmtpConnected, connect: connectXmtp, isConnecting } = useXMTP()
  const [message, setMessage] = useState("")
  const [showAI, setShowAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock messages for demonstration - replace with real XMTP integration
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "0xabcd...1234",
      content: "Hello everyone! Welcome to the event chat.",
      timestamp: new Date(Date.now() - 3600000),
      isAnnouncement: true,
    },
    {
      id: "2",
      sender: "0x7890...5678",
      content: "Hi there! Looking forward to this event.",
      timestamp: new Date(Date.now() - 2400000),
    },
    {
      id: "3",
      sender: "0xefgh...9012",
      content: "Does anyone know if there will be a recording available afterward?",
      timestamp: new Date(Date.now() - 1200000),
    },
    {
      id: "4",
      sender: "0xabcd...1234",
      content: "Yes, we'll share the recording with all attendees after the event.",
      timestamp: new Date(Date.now() - 600000),
    },
  ])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: address || "0x0000...0000",
      content: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

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

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b p-3 sm:p-4">
        <h3 className="font-semibold">Event Chat</h3>
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
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === address ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                        msg.sender === address
                          ? "bg-pamoja-500 text-white"
                          : msg.isAnnouncement
                            ? "bg-unity-50 border dark:bg-unity-950/30"
                            : "bg-muted"
                      }`}
                    >
                      {msg.sender !== address && (
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-unity-200 text-unity-700">
                              {msg.sender.slice(2, 4)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium truncate">{truncateAddress(msg.sender)}</span>
                        </div>
                      )}
                      <p className="text-sm break-words">{msg.content}</p>
                      <div
                        className={`mt-1 text-right text-xs ${
                          msg.sender === address ? "text-white/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages
                  .filter((msg) => msg.isAnnouncement)
                  .map((msg) => (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg border bg-unity-50 p-3 dark:bg-unity-950/30">
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-unity-200 text-unity-700">
                              {msg.sender.slice(2, 4)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{truncateAddress(msg.sender)}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <div className="mt-1 text-right text-xs text-muted-foreground">{formatTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  ))}
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
