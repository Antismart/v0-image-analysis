"use client"

import { useWallet } from "@/context/wallet-context"
import { useAccount } from 'wagmi'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export function WalletDebugInfo() {
  const { address, isConnected } = useWallet()
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
  const { authenticated, ready } = usePrivy()
  const { wallets } = useWallets()

  const privyWallet = wallets[0]

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm space-y-3">
      <h4 className="font-semibold mb-2">🔍 Wallet Connection Debug:</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-blue-600 dark:text-blue-400">Wagmi State</h5>
          <div className="space-y-1 mt-1">
            <p><strong>Connected:</strong> {wagmiConnected ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Address:</strong> {wagmiAddress ? `${wagmiAddress.slice(0, 6)}...${wagmiAddress.slice(-4)}` : '❌ None'}</p>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-purple-600 dark:text-purple-400">Privy State</h5>
          <div className="space-y-1 mt-1">
            <p><strong>Ready:</strong> {ready ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Authenticated:</strong> {authenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Wallets Count:</strong> {wallets.length}</p>
            <p><strong>Address:</strong> {privyWallet?.address ? `${privyWallet.address.slice(0, 6)}...${privyWallet.address.slice(-4)}` : '❌ None'}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-3">
        <h5 className="font-medium text-green-600 dark:text-green-400">Final Context State</h5>
        <div className="space-y-1 mt-1">
          <p><strong>Is Connected:</strong> {isConnected ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Final Address:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '❌ None'}</p>
        </div>
      </div>
      
      {!isConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ Wallet not detected. Try:
          </p>
          <ul className="text-yellow-700 dark:text-yellow-300 text-xs mt-1 space-y-1">
            <li>• Wait a few seconds for state sync</li>
            <li>• Refresh the page</li>
            <li>• Reconnect your wallet</li>
          </ul>
        </div>
      )}
    </div>
  )
}
