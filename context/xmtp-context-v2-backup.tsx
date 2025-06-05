"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { useWallet } from "@/context/wallet-context"

// Dynamic import to avoid SSR issues
let Client: any = null

interface XMTPContextType {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  xmtpClient: any | null
  createConversation: (peerAddress: string) => Promise<any | null>
  createGroup: (name: string, description?: string, inboxIds?: string[]) => Promise<any | null>
  getUserGroups: () => Promise<any[]>
  getConversations: () => Promise<any[]>
  sendMessage: (conversation: any, content: string) => Promise<boolean>
  streamAllMessages: (onMessage: (message: any) => void) => Promise<() => void>
  findInboxIdByAddress: (address: string) => Promise<string | null>
  addMembersToGroup: (groupId: string, inboxIds: string[]) => Promise<boolean>
  getGroupById: (groupId: string) => Promise<any | null>
  isConnecting: boolean
  conversations: any[]
  error: string | null
}

const XMTPContext = createContext<XMTPContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  xmtpClient: null,
  createConversation: async () => null,
  createGroup: async () => null,
  getUserGroups: async () => [],
  getConversations: async () => [],
  sendMessage: async () => false,
  streamAllMessages: async () => () => {},
  findInboxIdByAddress: async () => null,
  addMembersToGroup: async () => false,
  getGroupById: async () => null,
  isConnecting: false,
  conversations: [],
  error: null,
})

export const useXMTP = () => useContext(XMTPContext)

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { isConnected: isWalletConnected, getEthers5Signer } = useWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [xmtpClient, setXmtpClient] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Dynamic import of XMTP to avoid SSR issues
  const loadXMTP = useCallback(async () => {
    if (typeof window === 'undefined') return null
    
    try {
      // Use the correct XMTP package
      const xmtp = await import('@xmtp/xmtp-js')
      Client = xmtp.Client
      return xmtp
    } catch (error) {
      console.error('Failed to load XMTP:', error)
      setError('Failed to load XMTP SDK')
      return null
    }
  }, [])

  // Connect to XMTP
  const connect = useCallback(async () => {
    if (!isWalletConnected || !getEthers5Signer) {
      const errorMsg = "Wallet must be connected before connecting to XMTP"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
    if (xmtpClient || isConnecting) return
    
    setIsConnecting(true)
    setError(null)
    
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

      // Check for Privy provider issues but don't block
      if (signer.provider && signer.provider.connection && signer.provider.connection.url && signer.provider.connection.url.includes('privy')) {
        console.warn("[XMTP] Privy provider detected. XMTP may have compatibility issues with Privy signers.")
      }

      // Basic signer validation
      if (typeof signer.getAddress !== "function" || typeof signer.signMessage !== "function") {
        throw new Error("Signer is not a valid ethers v5 JsonRpcSigner. XMTP requires a compatible signer.")
      }
      
      console.log("Creating XMTP client...")
      const client = await Client.create(signer, { 
        env: process.env.XMTP_ENV === 'prod' ? 'production' : 'dev',
        codecs: []
      })
      
      console.log("XMTP client created successfully")
      setXmtpClient(client)
      setIsConnected(true)
      setError(null)
      
      // Load existing conversations
      try {
        const convs = await client.conversations.list()
        setConversations(convs)
      } catch (conversationError) {
        console.warn("Could not load conversations:", conversationError)
        // Don't fail the connection for this
      }
      
    } catch (error) {
      console.error("Error connecting to XMTP:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown XMTP connection error"
      setError(errorMessage)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [isWalletConnected, getEthers5Signer, isConnecting, xmtpClient, loadXMTP])

  // Disconnect from XMTP
  const disconnect = useCallback(() => {
    setXmtpClient(null)
    setIsConnected(false)
    setConversations([])
    setError(null)
  }, [])

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

  // Create a group conversation (simplified for V2)
  const createGroup = useCallback(async (name: string, description?: string, inboxIds: string[] = []) => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return null
    }

    try {
      console.log("Creating group conversation:", name)
      
      // For XMTP V2, we'll create a mock group structure
      // In production with V3, you'd use proper group creation
      const mockGroup = {
        id: `group_${Date.now()}`,
        name: name,
        description: description || '',
        members: inboxIds,
        createdAt: new Date()
      }
      
      console.log("Mock group created:", mockGroup.id)
      return mockGroup
    } catch (error) {
      console.error("Error creating group:", error)
      return null
    }
  }, [xmtpClient])

  // Get user's groups (simplified)
  const getUserGroups = useCallback(async () => {
    if (!xmtpClient) {
      console.log("No XMTP client available")
      return []
    }

    try {
      // For XMTP V2, return empty array for now
      // In production with V3, you'd implement proper group listing
      return []
    } catch (error) {
      console.error("Error fetching user groups:", error)
      return []
    }
  }, [xmtpClient])

  // Get conversations
  const getConversations = useCallback(async () => {
    if (!xmtpClient) return []
    
    try {
      const convs = await xmtpClient.conversations.list()
      setConversations(convs)
      return convs
    } catch (error) {
      console.error("Error fetching conversations:", error)
      return []
    }
  }, [xmtpClient])

  // Send message
  const sendMessage = useCallback(async (conversation: any, content: string) => {
    if (!conversation || !content) return false
    
    try {
      await conversation.send(content)
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }, [])

  // Stream all messages (simplified)
  const streamAllMessages = useCallback(async (onMessage: (message: any) => void) => {
    if (!xmtpClient) return () => {}
    
    try {
      // Simplified message streaming
      const stream = await xmtpClient.conversations.streamAllMessages()
      
      const processStream = async () => {
        for await (const message of stream) {
          onMessage(message)
        }
      }
      
      processStream()
      
      return () => {
        // Cleanup function
        if (stream && typeof stream.return === 'function') {
          stream.return()
        }
      }
    } catch (error) {
      console.error("Error streaming messages:", error)
      return () => {}
    }
  }, [xmtpClient])

  // Find inbox ID by address (simplified)
  const findInboxIdByAddress = useCallback(async (address: string) => {
    if (!xmtpClient) return null
    
    try {
      // For V2, the address is essentially the inbox ID
      return address
    } catch (error) {
      console.error("Error finding inbox ID:", error)
      return null
    }
  }, [xmtpClient])

  // Add members to group (simplified)
  const addMembersToGroup = useCallback(async (groupId: string, inboxIds: string[]): Promise<boolean> => {
    if (!xmtpClient) return false
    
    try {
      console.log(`Adding members to group ${groupId}:`, inboxIds)
      // In production with V3, implement actual group member addition
      return true
    } catch (error) {
      console.error("Error adding members to group:", error)
      return false
    }
  }, [xmtpClient])

  // Get group by ID (simplified)
  const getGroupById = useCallback(async (groupId: string) => {
    if (!xmtpClient) return null
    
    try {
      // In production with V3, implement actual group retrieval
      return null
    } catch (error) {
      console.error("Error getting group:", error)
      return null
    }
  }, [xmtpClient])

  return (
    <XMTPContext.Provider 
      value={{
        isConnected,
        connect,
        disconnect,
        xmtpClient,
        createConversation,
        createGroup,
        getUserGroups,
        getConversations,
        sendMessage,
        streamAllMessages,
        findInboxIdByAddress,
        addMembersToGroup,
        getGroupById,
        isConnecting,
        conversations,
        error,
      }}
    >
      {children}
    </XMTPContext.Provider>
  )
}
