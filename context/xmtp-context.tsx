"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useWallet } from "@/context/wallet-context"

interface XMTPContextType {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const XMTPContext = createContext<XMTPContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
})

export const useXMTP = () => useContext(XMTPContext)

export function XMTPProvider({ children }: { children: ReactNode }) {
  const { isConnected: isWalletConnected } = useWallet()
  const [isConnected, setIsConnected] = useState(false)

  // Mock XMTP connection
  const connect = async () => {
    if (!isWalletConnected) {
      throw new Error("Wallet must be connected before connecting to XMTP")
    }

    try {
      // In a real implementation, this would initialize the XMTP client
      // For demo purposes, we'll just set the connected state
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting to XMTP:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
  }

  return <XMTPContext.Provider value={{ isConnected, connect, disconnect }}>{children}</XMTPContext.Provider>
}
