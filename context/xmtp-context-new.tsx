"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useWallet } from "@/context/wallet-context"

// Dynamic import to avoid SSR issues
let Client: any = null
let Conversation: any = null

interface XMTPContextType {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  xmtpClient: any | null
  createConversation: (peerAddress: string) => Promise<any | null>
  getConversations: () => Promise<any[]>
  sendMessage: (conversation: any, content: string) => Promise<boolean>
  streamAllMessages: (onMessage: (message: any) => void) => Promise<() => void>
  isConnecting: boolean
  conversations: any[]
}

const XMTPContext = createContext<XMTPContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  xmtpClient: null,
  createConversation: async () => null,
  getConversations: async () => [],
  sendMessage: async () => false,
  streamAllMessages: async () => () => {},
  isConnecting: false,
  conversations: [],
})

export const useXMTP = () => useContext(XMTPContext)

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { isConnected: isWalletConnected, getEthers5Signer } = useWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [xmtpClient, setXmtpClient] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])

  // Dynamic import of XMTP to avoid SSR issues
  const loadXMTP = useCallback(async () => {
    if (typeof window === 'undefined') return null
    
    try {
      const xmtp = await import('@xmtp/xmtp-js')
      Client = xmtp.Client
      return xmtp
    } catch (error) {
      console.error('Failed to load XMTP:', error)
      return null
    }
  }, [])

  // Connect to XMTP
  const connect = useCallback(async () => {
    if (!isWalletConnected || !getEthers5Signer) {
      throw new Error("Wallet must be connected before connecting to XMTP")
    }
    if (xmtpClient || isConnecting) return
    
    setIsConnecting(true)
    
    try {
      console.log("Loading XMTP...")
      const xmtp = await loadXMTP()
      if (!xmtp || !Client) {
        throw new Error("Failed to load XMTP")
      }
      
      console.log("Getting signer...")
      const signer = await getEthers5Signer()
      if (!signer) {
        throw new Error("No ethers v5 signer available")
      }
      
      console.log("Creating XMTP client...")
      const client = await Client.create(signer, { env: "dev" })
      
      console.log("XMTP client created successfully")
      setXmtpClient(client)
      setIsConnected(true)
      
      // Load existing conversations
      const convs = await client.conversations.list()
      setConversations(convs)
      
    } catch (error) {
      console.error("Error connecting to XMTP:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [isWalletConnected, getEthers5Signer, isConnecting, xmtpClient, loadXMTP])

  // Create a new conversation
  const createConversation = useCallback(async (peerAddress: string) => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return null
    }

    try {
      console.log("Creating conversation with:", peerAddress)
      const conversation = await xmtpClient.conversations.newConversation(peerAddress)
      console.log("Conversation created:", conversation.peerAddress)
      
      // Update conversations list
      const convs = await xmtpClient.conversations.list()
      setConversations(convs)
      
      return conversation
    } catch (error) {
      console.error("Error creating conversation:", error)
      return null
    }
  }, [xmtpClient])

  // Get all conversations
  const getConversations = useCallback(async () => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return []
    }

    try {
      const convs = await xmtpClient.conversations.list()
      setConversations(convs)
      return convs
    } catch (error) {
      console.error("Error fetching conversations:", error)
      return []
    }
  }, [xmtpClient])

  // Send message to a conversation
  const sendMessage = useCallback(async (conversation: any, content: string): Promise<boolean> => {
    if (!conversation || !content.trim()) {
      return false
    }

    try {
      await conversation.send(content)
      console.log("Message sent:", content)
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }, [])

  // Stream all messages from all conversations
  const streamAllMessages = useCallback(async (onMessage: (message: any) => void) => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return () => {}
    }

    try {
      const stream = await xmtpClient.conversations.streamAllMessages()
      
      // Process the stream
      const processStream = async () => {
        for await (const message of stream) {
          if (message) {
            onMessage(message)
          }
        }
      }
      
      processStream().catch(console.error)
      
      // Return cleanup function
      return () => {
        try {
          stream.return?.()
        } catch (error) {
          console.error("Error closing message stream:", error)
        }
      }
    } catch (error) {
      console.error("Error setting up message stream:", error)
      return () => {}
    }
  }, [xmtpClient])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setXmtpClient(null)
    setConversations([])
    setIsConnecting(false)
    console.log("XMTP disconnected")
  }, [])

  useEffect(() => {
    if (!isWalletConnected) {
      disconnect()
    }
  }, [isWalletConnected, disconnect])

  return (
    <XMTPContext.Provider 
      value={{ 
        isConnected, 
        connect, 
        disconnect, 
        xmtpClient, 
        createConversation, 
        getConversations, 
        sendMessage,
        streamAllMessages,
        isConnecting,
        conversations
      }}
    >
      {children}
    </XMTPContext.Provider>
  )
}
