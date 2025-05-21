"use client"

import type React from "react"

import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { WalletConnectIllustration } from "@/components/illustrations"

interface WalletRequiredProps {
  children: React.ReactNode
}

export function WalletRequired({ children }: WalletRequiredProps) {
  const { isConnected, connect } = useWallet()

  if (!isConnected) {
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
