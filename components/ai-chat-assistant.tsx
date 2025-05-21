"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AIChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIChatAssistantProps {
  eventId: string
}

export function AIChatAssistant({ eventId }: AIChatAssistantProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your event assistant. I can help answer questions about this event, summarize discussions, or provide other information. How can I help you today?",
    },
  ])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    // Add user message
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setQuery("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (query.toLowerCase().includes("time") || query.toLowerCase().includes("when")) {
        response = "This event is scheduled for June 15th, 2025 at 6:00 PM local time."
      } else if (query.toLowerCase().includes("location") || query.toLowerCase().includes("where")) {
        response = "The event will take place at the Tech Hub Conference Center in San Francisco, CA."
      } else if (query.toLowerCase().includes("speaker") || query.toLowerCase().includes("who")) {
        response =
          "The main speakers for this event are Jane Smith, a blockchain developer at Ethereum Foundation, and John Doe, the founder of DeFi Protocol."
      } else if (query.toLowerCase().includes("ticket") || query.toLowerCase().includes("cost")) {
        response =
          "This event uses NFT tickets. The current price is 0.05 ETH per ticket. You can purchase directly from the event page."
      } else if (query.toLowerCase().includes("summary") || query.toLowerCase().includes("recap")) {
        response =
          "Based on the chat discussion so far, attendees are discussing the event schedule, asking about recordings, and introducing themselves. The organizer confirmed that recordings will be available after the event."
      } else {
        response =
          "I don't have specific information about that. You might want to ask the event organizer directly in the main chat."
      }

      const assistantMessage: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Bot className="h-5 w-5 text-unity-600" />
          AI Assistant
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user" ? "bg-pamoja-500 text-white" : "bg-unity-50 dark:bg-unity-950/30"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="mb-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-unity-200 text-unity-700">AI</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">Assistant</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-unity-50 p-3 dark:bg-unity-950/30">
                <div className="mb-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-unity-200 text-unity-700">AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Assistant</span>
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-unity-600"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-unity-600"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-unity-600"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendQuery} className="flex items-center gap-2 border-t p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about this event..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={!query.trim() || isLoading}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
