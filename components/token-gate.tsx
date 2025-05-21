"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { TokenGateIllustration } from "@/components/illustrations"
import { Loading } from "@/components/ui/loading"

interface TokenGateProps {
  eventId: string
  children: React.ReactNode
}

export function TokenGate({ eventId, children }: TokenGateProps) {
  const { address, isConnected, connect } = useWallet()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Mock token-gating check
  useEffect(() => {
    if (isConnected && address) {
      setIsChecking(true)

      // Simulate checking token ownership
      setTimeout(() => {
        // For demo purposes, we'll grant access to all connected wallets
        // In a real implementation, this would check token ownership
        setHasAccess(true)
        setIsChecking(false)
      }, 1500)
    } else {
      setIsChecking(false)
      setHasAccess(false)
    }
  }, [address, isConnected, eventId])

  if (isChecking) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Loading variant="spinner" size="md" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
        <TokenGateIllustration className="mb-6 max-w-[200px]" />
        <h3 className="mb-2 text-xl font-semibold">Connect Your Wallet</h3>
        <p className="mb-4 max-w-md text-center text-muted-foreground">
          You need to connect your wallet to view this event.
        </p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
        <TokenGateIllustration className="mb-6 max-w-[200px]" />
        <h3 className="mb-2 text-xl font-semibold">Access Restricted</h3>
        <p className="mb-4 max-w-md text-center text-muted-foreground">
          This is a token-gated event. You need to own the required tokens to access this event.
        </p>
        <Button variant="outline">Learn More</Button>
      </div>
    )
  }

  return <>{children}</>
}
