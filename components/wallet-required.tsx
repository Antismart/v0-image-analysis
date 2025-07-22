"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { WalletConnectIllustration } from "@/components/illustrations"

interface WalletRequiredProps {
  children: React.ReactNode
}

export function WalletRequired({ children }: WalletRequiredProps) {
  const { isConnected, connect, address } = useWallet()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Give a small delay to ensure wallet state is fully synchronized
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Show loading state while checking wallet connection
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Checking wallet connection...</p>
      </div>
    )
  }

  // Check if wallet is connected and has an address
  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <WalletConnectIllustration className="mb-6 max-w-[200px]" />
        <h3 className="mb-2 text-xl font-semibold">Wallet Connection Required</h3>
        <p className="mb-4 text-muted-foreground">Please connect your wallet to access this feature.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    )
  }

  return <>{children}</>
}
