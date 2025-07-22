import { useEffect, useState } from 'react'
import { useWallet } from '@/context/wallet-context'

export function useWalletConnection() {
  const { isConnected, address } = useWallet()
  const [isReady, setIsReady] = useState(false)
  const [connectionState, setConnectionState] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    // Give time for wallet state to synchronize
    const checkConnection = () => {
      if (isConnected && address) {
        setConnectionState('connected')
        setIsReady(true)
      } else {
        setConnectionState('disconnected')
        setIsReady(true)
      }
    }

    // Initial check with delay
    const timer = setTimeout(checkConnection, 1000)

    // Immediate check
    checkConnection()

    return () => clearTimeout(timer)
  }, [isConnected, address])

  return {
    isReady,
    isConnected: connectionState === 'connected',
    address,
    connectionState
  }
}
