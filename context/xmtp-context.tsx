"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Client } from "@xmtp/browser-sdk"
import { useWallet } from "@/context/wallet-context"
import { upsertUser, createGroup as createDbGroup, addUserToGroup, sendMessage as sendDbMessage, getGroupMessages } from '@/lib/group-chat-service'

interface XMTPContextType {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  xmtpClient: any | null
  createConversation: (inboxId: string) => Promise<any | null>
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
  inboxId: string | null
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
  inboxId: null,
})

export const useXMTP = () => useContext(XMTPContext)

// Generate a database encryption key for V3
function generateDbEncryptionKey(): Uint8Array {
  const key = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(key)
  } else {
    // Fallback for server-side or older browsers
    for (let i = 0; i < 32; i++) {
      key[i] = Math.floor(Math.random() * 256)
    }
  }
  return key
}

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { isConnected: isWalletConnected, address, getEthers5Signer } = useWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [xmtpClient, setXmtpClient] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [inboxId, setInboxId] = useState<string | null>(null)

  // Create a V3 compatible signer from ethers5 signer
  const createV3Signer = useCallback(async () => {
    if (!address || typeof window === 'undefined') return null

    try {
      // Get the ethers5 signer first
      const ethers5Signer = await getEthers5Signer()
      if (!ethers5Signer) {
        throw new Error("No ethers5 signer available")
      }

      console.log("Creating V3 signer from ethers5 signer...")

      // Wrap the ethers5 signer for V3 compatibility
      const v3Signer = {
        type: "EOA" as const,
        getIdentifier: async () => {
          const signerAddress = await ethers5Signer.getAddress()
          return {
            identifierKind: "Ethereum" as const,
            identifier: signerAddress,
          }
        },
        signMessage: async (message: string) => {
          try {
            console.log("Signing message with ethers5 signer:", message)
            const signature = await ethers5Signer.signMessage(message)
            console.log("Message signed successfully")
            // Convert hex string to Uint8Array for XMTP V3
            if (typeof signature === "string" && signature.startsWith("0x")) {
              return Uint8Array.from(Buffer.from(signature.slice(2), "hex"))
            }
            return signature
          } catch (error) {
            console.error("Error signing message:", error)
            throw error
          }
        },
        getChainId: () => {
          // Get chain ID from the signer's provider if available
          if (ethers5Signer.provider && ethers5Signer.provider.network) {
            return BigInt(ethers5Signer.provider.network.chainId)
          }
          return BigInt(84532) // Base Sepolia fallback
        },
        getBlockNumber: () => BigInt(0), // Default block number
      }

      return v3Signer
    } catch (error) {
      console.error("Error creating V3 signer:", error)
      return null
    }
  }, [address, getEthers5Signer])

  // Connect to XMTP V3
  const connect = useCallback(async () => {
    if (!isWalletConnected || !address) {
      const errorMsg = "Wallet must be connected before connecting to XMTP"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
    if (xmtpClient || isConnecting) return
    
    setIsConnecting(true)
    setError(null)
    
    try {
      console.log("Creating V3 signer...")
      const signer = await createV3Signer()
      if (!signer) {
        throw new Error("Failed to create V3 signer")
      }
      
      console.log("Creating XMTP V3 client...")
      
      // Generate or retrieve database encryption key
      const dbEncryptionKey = generateDbEncryptionKey()
      
      const client = await Client.create(signer, {
        env: process.env.XMTP_ENV === 'prod' ? 'production' : 'dev',
        dbEncryptionKey: dbEncryptionKey,
      })
      
      console.log("XMTP V3 client created successfully")
      setXmtpClient(client)
      setIsConnected(true)
      setInboxId(client.inboxId || null)
      setError(null)
      
      // Load existing conversations
      try {
        const convs = await client.conversations.list()
        setConversations(convs)
        console.log(`Loaded ${convs.length} conversations`)
      } catch (conversationError) {
        console.warn("Could not load conversations:", conversationError)
      }
      
    } catch (error) {
      console.error("Error connecting to XMTP V3:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown XMTP connection error"
      setError(errorMessage)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [isWalletConnected, address, isConnecting, xmtpClient, createV3Signer, getEthers5Signer])

  // Disconnect from XMTP
  const disconnect = useCallback(() => {
    setXmtpClient(null)
    setIsConnected(false)
    setConversations([])
    setInboxId(null)
    setError(null)
  }, [])

  // Create a new DM conversation (V3 style)
  const createConversation = useCallback(async (targetInboxId: string) => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return null
    }

    try {
      console.log("Creating DM conversation with inbox ID:", targetInboxId)
      const conversation = await xmtpClient.conversations.findOrCreateDm(targetInboxId)
      console.log("DM conversation created/found:", conversation.id)
      
      // Update conversations list
      const convs = await xmtpClient.conversations.list()
      setConversations(convs)
      
      return conversation
    } catch (error) {
      console.error("Error creating conversation:", error)
      return null
    }
  }, [xmtpClient])

  // Create a group conversation (V3 native)
  const createGroup = useCallback(async (name: string, description?: string, inboxIds: string[] = []) => {
    // Check if client exists and is properly initialized
    if (!xmtpClient) {
      console.error("XMTP client not available")
      return null
    }

    // Additional check to ensure client is ready
    try {
      if (!xmtpClient.inboxId) {
        console.error("XMTP client not properly initialized - missing inbox ID")
        return null
      }
    } catch (error) {
      console.error("XMTP client not properly initialized:", error)
      return null
    }

    try {
      console.log("Creating group conversation:", name, "with inboxIds:", inboxIds)
      
      const group = await xmtpClient.conversations.newGroup(inboxIds, {
        name: name,
        description: description || '',
      })
      
      console.log("Group created successfully:", group.id)
      
      // Update conversations list
      try {
        const updatedConversations = await xmtpClient.conversations.list()
        setConversations(updatedConversations)
      } catch (listError) {
        console.warn("Could not refresh conversations list:", listError)
      }
      
      return group
    } catch (error) {
      console.error("Error creating group:", error)
      return null
    }
  }, [xmtpClient])

  // Get user's groups
  const getUserGroups = useCallback(async () => {
    if (!xmtpClient) {
      console.log("No XMTP client available")
      return []
    }

    try {
      const conversations = await xmtpClient.conversations.list()
      // Filter for group conversations
      const groups = conversations.filter((conv: any) => conv.conversationType === 'group')
      return groups
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

  // Stream all messages
  const streamAllMessages = useCallback(async (onMessage: (message: any) => void) => {
    if (!xmtpClient) return () => {}
    
    try {
      const stream = await xmtpClient.conversations.streamAllMessages()
      
      const processStream = async () => {
        for await (const message of stream) {
          onMessage(message)
        }
      }
      
      processStream()
      
      return () => {
        if (stream && typeof stream.return === 'function') {
          stream.return()
        }
      }
    } catch (error) {
      console.error("Error streaming messages:", error)
      return () => {}
    }
  }, [xmtpClient])

  // Find inbox ID by address (V3 method)
  const findInboxIdByAddress = useCallback(async (address: string) => {
    if (!xmtpClient) return null
    
    try {
      const inboxId = await xmtpClient.getInboxIdByAddress(address)
      return inboxId
    } catch (error) {
      console.error("Error finding inbox ID:", error)
      return null
    }
  }, [xmtpClient])

  // Add members to group (V3 method)
  const addMembersToGroup = useCallback(async (groupId: string, inboxIds: string[]): Promise<boolean> => {
    if (!xmtpClient) return false
    
    try {
      const conversations = await xmtpClient.conversations.list()
      const group = conversations.find((conv: any) => conv.id === groupId && conv.conversationType === 'group')
      
      if (!group) {
        console.error(`Group ${groupId} not found`)
        return false
      }

      await group.addMembers(inboxIds)
      console.log(`Successfully added ${inboxIds.length} members to group ${groupId}`)
      return true
    } catch (error) {
      console.error("Error adding members to group:", error)
      return false
    }
  }, [xmtpClient])

  // Get group by ID
  const getGroupById = useCallback(async (groupId: string) => {
    if (!xmtpClient) return null
    
    try {
      const conversations = await xmtpClient.conversations.list()
      const group = conversations.find((conv: any) => conv.id === groupId && conv.conversationType === 'group')
      return group || null
    } catch (error) {
      console.error("Error getting group:", error)
      return null
    }
  }, [xmtpClient])

  // Example: When a user joins an event chat, ensure they exist in the DB and are added to the group
  async function ensureUserInDbAndGroup(address: string, groupId: string, groupName: string) {
    // Upsert user in DB
    const user = await upsertUser(address)
    // Upsert group in DB
    let group = null
    try {
      group = await createDbGroup(groupName)
    } catch (e) {
      // Group may already exist, ignore error
    }
    // Add user to group in DB
    await addUserToGroup(user.id, groupId)
  }

  // Example: When sending a message, also store it in the DB
  async function handleSendMessageDb(senderAddress: string, groupId: string, content: string) {
    const user = await upsertUser(senderAddress)
    await sendDbMessage(user.id, groupId, content)
  }

  // Example: Fetch messages for a group from the DB
  async function fetchGroupMessagesDb(groupId: string, limit = 50) {
    return getGroupMessages(groupId, limit)
  }

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
        inboxId,
      }}
    >
      {children}
    </XMTPContext.Provider>
  )
}
