"use client"

import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useWallet } from '@/context/wallet-context'
import { formatETHBalance, formatUSDCBalance, formatTokenBalance } from '@/lib/format-balance'
import { Wallet, TrendingUp } from 'lucide-react'

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const

export function WalletBalanceDisplay() {
  const { address, isConnected } = useWallet()
  const [mounted, setMounted] = useState(false)
  
  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  })
  
  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address: address as `0x${string}`,
    token: USDC_ADDRESS,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000,
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isConnected || !address) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Wallet className="w-4 h-4" />
        <span>Wallet Balance</span>
      </div>
      
      <div className="space-y-2">
        {/* ETH Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">Ξ</span>
            </div>
            <span className="text-sm font-medium">ETH</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {ethBalance ? formatETHBalance(ethBalance.value) : '0 ETH'}
            </div>
            {ethBalance && ethBalance.value > BigInt(0) && (
              <div className="text-xs text-muted-foreground">
                Base Sepolia
              </div>
            )}
          </div>
        </div>

        {/* USDC Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">$</span>
            </div>
            <span className="text-sm font-medium">USDC</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {usdcBalance ? formatUSDCBalance(usdcBalance.value) : '0 USDC'}
            </div>
            {usdcBalance && usdcBalance.value > BigInt(0) && (
              <div className="text-xs text-muted-foreground">
                Base Sepolia
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help text for dust balances */}
      {((ethBalance && ethBalance.value > BigInt(0) && ethBalance.value < BigInt('1000000000000000')) || 
        (usdcBalance && usdcBalance.value > BigInt(0) && usdcBalance.value < BigInt('1000'))) && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="font-medium">Small Balance Notice</span>
          </div>
          <p className="mt-1">
            Very small token amounts are displayed as &quot;&lt; 0.000001&quot; to avoid scientific notation.
            These are often dust balances with minimal value.
          </p>
        </div>
      )}
    </div>
  )
}

// Simplified version for navbar or compact display
export function CompactWalletBalance() {
  const { address, isConnected } = useWallet()
  const [mounted, setMounted] = useState(false)
  
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 30000, // Refetch every 30 seconds for compact view
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isConnected || !ethBalance) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Wallet className="w-4 h-4" />
      <span>{formatETHBalance(ethBalance.value, 3)}</span>
    </div>
  )
}
