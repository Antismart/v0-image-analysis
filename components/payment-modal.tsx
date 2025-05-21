"use client"

import { useState } from "react"
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

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  amount: number
  eventId: string
  eventTitle: string
}

export function PaymentModal({ isOpen, onClose, onComplete, amount, eventId, eventTitle }: PaymentModalProps) {
  const { address } = useWallet()
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)

  const handlePayment = async () => {
    if (status === "processing") return

    setStatus("processing")

    // Simulate blockchain transaction
    setTimeout(() => {
      const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

      setTxHash(mockTxHash)
      setStatus("success")
    }, 3000)
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
              <span className="font-medium">{amount} ETH</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>≈ USD Value</span>
              <span>${(amount * 3500).toFixed(2)}</span>
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
              <span className="font-mono text-sm">0x1234...5678</span>
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
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleClose} disabled={status === "processing"}>
            {status === "success" ? "Done" : "Cancel"}
          </Button>

          {status !== "success" && (
            <Button onClick={handlePayment} disabled={status === "processing"} className="mt-2 sm:mt-0">
              {status === "processing" ? (
                <>
                  <Loading variant="spinner" size="xs" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
