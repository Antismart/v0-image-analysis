"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@/context/wallet-context"

interface UserProfile {
  reputation: number
  eventsAttended: string[]
  eventsOrganized: string[]
  ownedTickets: string[]
}

interface UserContextType {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType>({
  profile: null,
  isLoading: false,
  error: null,
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (isConnected && address) {
      setIsLoading(true)
      setError(null)

      try {
        // TODO: Replace mock data with real user profile from blockchain
        timeoutId = setTimeout(() => {
          const mockProfile: UserProfile = {
            reputation: 85,
            eventsAttended: ["1", "2", "3"],
            eventsOrganized: ["4"],
            ownedTickets: ["1", "2"],
          }

          setProfile(mockProfile)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to load user profile")
        setIsLoading(false)
      }
    } else {
      setProfile(null)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [address, isConnected])

  return <UserContext.Provider value={{ profile, isLoading, error }}>{children}</UserContext.Provider>
}
