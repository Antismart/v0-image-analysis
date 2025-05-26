"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-context"
import { Loading } from "@/components/ui/loading"
import { getEventContract, publicClient } from "@/lib/contract"
import { erc20Abi } from "viem"
import { baseSepolia } from "@/lib/base-sepolia"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  amount: number
  eventId: string
  eventTitle: string
  organizer: string // Add organizer prop
}

const CONTRACT_ADDRESS = "0x568B91fA6de99ef3C6287C60C18a0F964718a9Ad" // Replace with your contract address

export function PaymentModal({ isOpen, onClose, onComplete, amount, eventId, eventTitle, organizer }: PaymentModalProps) {
  const { address, walletClient } = useWallet()
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base Sepolia USDC

  // Check USDC balance and approval on open
  useEffect(() => {
    const checkBalanceAndApproval = async () => {
      if (!walletClient || !address) return
      try {
        // Check USDC balance using public client
        const balance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        })
        setUsdcBalance(balance)
        
        // Check USDC allowance for the contract using public client
        const allowance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as `0x${string}`, CONTRACT_ADDRESS as `0x${string}`],
        })
        
        // Check if allowance is sufficient for the ticket price
        const ticketPriceUsdc = BigInt(Math.floor(Number(amount) * 1_000_000)) // Convert to USDC 6 decimals
        console.log("USDC allowance:", allowance.toString(), "Required:", ticketPriceUsdc.toString())
        
      } catch (err) {
        console.error("Failed to check USDC balance/allowance:", err)
        setErrorMessage("Failed to check USDC balance.")
      }
    }
    if (isOpen) checkBalanceAndApproval()
  }, [isOpen, walletClient, address, amount])

  const handlePayment = async () => {
    if (status === "processing") return
    if (!walletClient || !address) {
      setStatus("error")
      setErrorMessage("No wallet client connected.")
      console.error("No wallet client connected")
      return
    }
    
    setStatus("processing")
    setErrorMessage(null)
    
    try {
      const ticketPriceUsdc = BigInt(Math.floor(Number(amount) * 1_000_000)) // Convert to USDC 6 decimals
      
      // Step 1: Check and approve USDC if needed
      console.log("Checking USDC allowance for contract:", CONTRACT_ADDRESS)
      
      const currentAllowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address as `0x${string}`, CONTRACT_ADDRESS as `0x${string}`],
      })
      
      console.log("Current USDC allowance:", currentAllowance.toString())
      console.log("Required amount:", ticketPriceUsdc.toString())
      
      // If allowance is insufficient, approve first
      if (currentAllowance < ticketPriceUsdc) {
        console.log("Insufficient allowance, requesting USDC approval...")
        
        // Show user that we're requesting approval first
        setErrorMessage("Please approve USDC spending in your wallet...")
        
        const approveTxHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, ticketPriceUsdc],
          chain: baseSepolia,
        })
        
        console.log("USDC approval transaction sent:", approveTxHash)
        setErrorMessage("USDC approval pending confirmation...")
        
        // Wait for approval confirmation
        if (walletClient.waitForTransactionReceipt) {
          const approvalReceipt = await walletClient.waitForTransactionReceipt({ hash: approveTxHash })
          if (approvalReceipt.status !== "success") {
            throw new Error("USDC approval transaction failed")
          }
          console.log("USDC approval confirmed")
          setErrorMessage(null)
        }
      } else {
        console.log("Sufficient USDC allowance already exists")
      }
      
      // Step 2: Call rsvpOrPurchase - this will transfer USDC to organizer
      console.log("Calling rsvpOrPurchase - this will transfer", amount, "USDC to organizer:", organizer)
      
      const contract = getEventContract(walletClient)
      const eventIdBigInt = typeof eventId === "bigint" ? eventId : BigInt(eventId)
      
      const txHash = await walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "rsvpOrPurchase",
        args: [eventIdBigInt],
        chain: baseSepolia,
      })
      
      console.log("Purchase transaction sent:", txHash)
      console.log("USDC will be transferred from", address, "to", organizer)
      setTxHash(txHash)
      
      // Wait for confirmation
      if (walletClient.waitForTransactionReceipt) {
        try {
          const receipt = await walletClient.waitForTransactionReceipt({ hash: txHash })
          if (receipt.status === "success" || receipt.status === 1) {
            setStatus("success")
            console.log("✅ Purchase successful! USDC transferred to organizer.")
          } else {
            setStatus("error")
            setErrorMessage("Transaction failed or reverted. Please check your USDC balance and try again.")
          }
        } catch (waitErr: any) {
          setStatus("error")
          setErrorMessage(waitErr?.message || "Transaction failed to confirm.")
          console.error("Transaction failed:", waitErr)
        }
      } else {
        // If we can't wait for receipt, assume success if we got a hash
        setStatus("success")
      }
      
    } catch (err: any) {
      setStatus("error")
      setTxHash(null)
      if (err?.message?.includes("insufficient allowance")) {
        setErrorMessage("USDC approval required. Please try again.")
      } else if (err?.message?.includes("insufficient balance")) {
        setErrorMessage("Insufficient USDC balance to purchase ticket.")
      } else if (err?.message?.includes("User rejected")) {
        setErrorMessage("Transaction cancelled by user.")
      } else {
        setErrorMessage(err?.message || "Payment transaction failed. Please try again.")
      }
      console.error("Payment failed:", err)
    }
  }

  const handleClose = () => {
    if (status === "success") {
      onComplete()
    } else {
      onClose()
    }

    // Reset state after closing
    setTimeout(() => {
      setStatus("idle")
      setTxHash(null)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
          <DialogDescription>You're purchasing a ticket for {eventTitle}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount</span>
              <span className="font-medium">{amount} USDC</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>≈ USD Value</span>
              <span>${amount.toFixed(2)}</span> {/* 1 USDC = $1 */}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">From</span>
              <span className="font-mono text-sm">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">To</span>
              <span className="font-mono text-sm">{organizer ? `${organizer.slice(0, 6)}...${organizer.slice(-4)}` : "..."}</span>
            </div>
          </div>

          {status === "success" && txHash && (
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <p className="mb-2 font-medium text-green-600 dark:text-green-400">Transaction successful!</p>
              <p className="text-sm text-muted-foreground">
                Transaction hash:{" "}
                <span className="font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </span>
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="font-medium text-red-600 dark:text-red-400">Transaction failed. Please try again.</p>
              {errorMessage && (
                <p className="mt-2 text-xs text-red-700 dark:text-red-300 break-all">{errorMessage}</p>
              )}
            </div>
          )}

          {status === "processing" && errorMessage && (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <p className="font-medium text-blue-600 dark:text-blue-400">Processing...</p>
              <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">{errorMessage}</p>
            </div>
          )}

          {usdcBalance !== null && usdcBalance < BigInt(Math.floor(Number(amount) * 1_000_000)) ? (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950 text-red-600 dark:text-red-400 text-center">
              Insufficient USDC balance to purchase ticket.
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleClose} disabled={status === "processing"}>
            {status === "success" ? "Done" : "Cancel"}
          </Button>
          {status !== "success" && (
            usdcBalance !== null && usdcBalance < BigInt(Math.floor(Number(amount) * 1_000_000)) ? (
              <Button disabled className="mt-2 sm:mt-0">Insufficient Balance</Button>
            ) : (
              <Button onClick={handlePayment} disabled={status === "processing"} className="mt-2 sm:mt-0">
                {status === "processing" ? (
                  <><Loading variant="spinner" size="xs" className="mr-2" /> Processing...</>
                ) : (
                  "Purchase Ticket"
                )}
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
