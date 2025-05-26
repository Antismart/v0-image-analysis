"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useRef, useCallback } from "react"
import { useWallet } from "@/context/wallet-context"

// Mock XMTP Client interface
interface MockXMTPClient {
  address: string
}

interface XMTPContextType {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  xmtpClient: MockXMTPClient | null
  createGroup: (name: string, description?: string) => Promise<string | null>
  joinGroup: (groupId: string) => Promise<string | null>
  getUserGroups: () => Promise<string[]>
  isConnecting: boolean
}

const XMTPContext = createContext<XMTPContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  xmtpClient: null,
  createGroup: async () => null,
  joinGroup: async () => null,
  getUserGroups: async () => [],
  isConnecting: false,
})

export const useXMTP = () => useContext(XMTPContext)

export function XMTPProvider({ children }: { children: ReactNode }) {
  const { isConnected: isWalletConnected, address } = useWallet();
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [xmtpClient, setXmtpClient] = useState<MockXMTPClient | null>(null)
  const connecting = useRef(false)

  // Mock XMTP connection
  const connect = async () => {
    if (!isWalletConnected || !address) {
      throw new Error("Wallet must be connected before connecting to XMTP")
    }
    if (xmtpClient || connecting.current) return
    
    connecting.current = true
    setIsConnecting(true)
    
    try {
      console.log("Connecting to mock XMTP...")
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock client
      const mockClient: MockXMTPClient = {
        address: address
      }
      
      console.log("Mock XMTP client created successfully")
      setXmtpClient(mockClient)
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting to mock XMTP:", error)
      throw error
    } finally {
      connecting.current = false
      setIsConnecting(false)
    }
  }

  // Create a new group (mock)
  const createGroup = useCallback(async (name: string, description?: string): Promise<string | null> => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return null
    }

    try {
      console.log("Creating mock group:", name)
      // Simulate group creation with a unique ID
      const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log("Mock group created:", groupId)
      return groupId
    } catch (error) {
      console.error("Error creating mock group:", error)
      return null
    }
  }, [xmtpClient])

  // Join an existing group (mock)
  const joinGroup = useCallback(async (groupId: string): Promise<string | null> => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return null
    }

    try {
      console.log("Joining mock group:", groupId)
      // Simulate joining by returning the group ID
      return groupId
    } catch (error) {
      console.error("Error joining mock group:", error)
      return null
    }
  }, [xmtpClient])

  // Get user's groups (mock)
  const getUserGroups = useCallback(async (): Promise<string[]> => {
    if (!xmtpClient) {
      console.error("XMTP client not connected")
      return []
    }

    try {
      // Return empty array for mock
      console.log("Getting mock user groups...")
      return []
    } catch (error) {
      console.error("Error fetching mock user groups:", error)
      return []
    }
  }, [xmtpClient])

  const disconnect = () => {
    setIsConnected(false)
    setXmtpClient(null)
    setIsConnecting(false)
    console.log("Mock XMTP disconnected")
  }

  useEffect(() => {
    if (!isWalletConnected) disconnect()
  }, [isWalletConnected])

  return (
    <XMTPContext.Provider 
      value={{ 
        isConnected, 
        connect, 
        disconnect, 
        xmtpClient, 
        createGroup, 
        joinGroup, 
        getUserGroups,
        isConnecting 
      }}
    >
      {children}
    </XMTPContext.Provider>
  )
}
