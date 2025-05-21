"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-context"
import { Copy, ExternalLink, LogOut } from "lucide-react"

export function WalletConnect() {
  const { address, isConnected, connect, disconnect } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  if (!isConnected) {
    return <Button onClick={connect}>Connect Wallet</Button>
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="border-gray-200 dark:border-gray-800">
        {address ? truncateAddress(address) : "Connected"}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-2 py-1.5 text-sm font-semibold">Wallet</div>
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={copyAddress}
          >
            <span>{address ? truncateAddress(address) : ""}</span>
            <Copy className="h-4 w-4" />
            {isCopied && <span className="absolute right-8 text-xs text-green-500">Copied!</span>}
          </div>

          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            View on BaseScan
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>

          <div
            onClick={() => {
              disconnect()
              setIsOpen(false)
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Disconnect
            <LogOut className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}
