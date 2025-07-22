"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-context"
import { Copy, ExternalLink, LogOut } from "lucide-react"
import { usePrivy, useWallets } from '@privy-io/react-auth';

export function WalletConnect() {
  const { address, isConnected, connect, disconnect, connectors } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { ready, authenticated, login, linkWallet, logout } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => { setMounted(true); }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleConnect = async () => {
    if (!ready) return;
    if (!authenticated) {
      await login();
    } else {
      await linkWallet(); // Link additional wallet if already authenticated
    }
  };

  const handleDisconnect = () => {
    // Disconnect from both Wagmi and Privy
    disconnect();
    if (authenticated) {
      logout();
    }
    setIsOpen(false);
    setShowWalletOptions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Listen for custom 'wallet-disconnect' event
  useEffect(() => {
    const handler = () => {
      setIsOpen(false);
      setShowWalletOptions(false);
    };
    window.addEventListener('wallet-disconnect', handler);
    return () => window.removeEventListener('wallet-disconnect', handler);
  }, []);

  if (!mounted) return null;

  if (!isConnected) {
    // Prefer Privy modal if available
    if (ready) {
      return (
        <Button onClick={handleConnect} className="touch-button text-sm sm:text-base">
          Connect Wallet
        </Button>
      );
    }
    // Fallback: show wagmi connector options
    return (
      <div className="relative">
        <Button onClick={() => setShowWalletOptions(true)} className="touch-button text-sm sm:text-base">
          Connect Wallet
        </Button>
        {showWalletOptions && (
          <div className="absolute z-50 mt-2 w-64 sm:w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:bg-gray-800 dark:border-gray-700 right-0 sm:right-auto">
            <div className="px-2 py-2 text-sm font-semibold">Select Wallet</div>
            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            {connectors.map((connector: any) => (
              <button
                key={connector.id}
                className="w-full text-left px-3 py-3 sm:py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
                onClick={async () => {
                  await connect(connector);
                  setShowWalletOptions(false);
                }}
                disabled={!connector.ready}
              >
                {connector.name} {connector.ready ? '' : '(Unavailable)'}
              </button>
            ))}
            <button
              className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-2"
              onClick={() => setShowWalletOptions(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)} 
        className="border-gray-200 dark:border-gray-800 touch-button text-sm sm:text-base min-w-[120px] sm:min-w-auto"
      >
        <span className="truncate">
          {address ? truncateAddress(address) : "Connected"}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-2 py-2 text-sm font-semibold">Wallet</div>
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-sm px-3 py-3 sm:py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
            onClick={copyAddress}
          >
            <span className="truncate pr-2">{address ? truncateAddress(address) : ""}</span>
            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 flex-shrink-0" />
              {isCopied && <span className="text-xs text-green-500 whitespace-nowrap">Copied!</span>}
            </div>
          </div>

          <a
            href={`https://base-sepolia.blockscout.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-3 sm:py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
          >
            <span>View on BaseScan</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </a>

          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>

          <div
            onClick={handleDisconnect}
            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-3 sm:py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
          >
            <span>Disconnect</span>
            <LogOut className="h-4 w-4 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  )
}
