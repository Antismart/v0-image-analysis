"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Send, Eye, QrCode, Download, Share2 } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import QRCode from "qrcode"
import { UserTicket } from "@/hooks/use-blockchain-profile"

interface NFTTicketCardProps {
  ticket: UserTicket
  onTransfer?: (tokenId: string, toAddress: string) => void
}

export function NFTTicketCard({ ticket, onTransfer }: NFTTicketCardProps) {
  const { address } = useWallet()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [transferAddress, setTransferAddress] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")

  // Generate QR code for ticket verification
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const ticketData = JSON.stringify({
          eventId: ticket.eventId,
          tokenId: ticket.tokenId,
          owner: address,
          txHash: ticket.txHash
        })
        const qrCodeUrl = await QRCode.toDataURL(ticketData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeDataUrl(qrCodeUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    if (address) {
      generateQRCode()
    }
  }, [ticket, address])

  const handleTransfer = async () => {
    if (!transferAddress || !onTransfer) return
    
    setIsTransferring(true)
    try {
      await onTransfer(ticket.tokenId, transferAddress)
      setIsTransferModalOpen(false)
      setTransferAddress("")
    } catch (error) {
      console.error('Transfer failed:', error)
    } finally {
      setIsTransferring(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openInExplorer = () => {
    window.open(`https://sepolia.basescan.org/tx/${ticket.txHash}`, '_blank')
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = `ticket-${ticket.tokenId}-qr.png`
      link.href = qrCodeDataUrl
      link.click()
    }
  }

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NFT Ticket: ${ticket.eventTitle}`,
          text: `Check out my NFT ticket for ${ticket.eventTitle}!`,
          url: `${window.location.origin}/ticket/${ticket.tokenId}`
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/ticket/${ticket.tokenId}`
      navigator.clipboard.writeText(url)
    }
  }

  const ticketMetadata = {
    name: `${ticket.eventTitle} - Ticket #${ticket.tokenId}`,
    description: `NFT Ticket for ${ticket.eventTitle}`,
    image: ticket.image,
    attributes: [
      { trait_type: "Event", value: ticket.eventTitle },
      { trait_type: "Token ID", value: ticket.tokenId },
      { trait_type: "Purchase Date", value: new Date(ticket.timestamp * 1000).toLocaleDateString() }
    ]
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={ticket.image || "/placeholder.svg"}
          alt={ticket.eventTitle}
          width={300}
          height={300}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white">
            #{ticket.tokenId}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-lg">{ticket.eventTitle}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          Token ID: {ticket.tokenId}
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={() => copyToClipboard(ticket.tokenId)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex gap-2 mb-3">
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>NFT Ticket Details</DialogTitle>
                <DialogDescription>
                  View your NFT ticket metadata and QR code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={ticket.image || "/placeholder.svg"}
                    alt={ticket.eventTitle}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{ticketMetadata.name}</h4>
                  <p className="text-sm text-muted-foreground">{ticketMetadata.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {ticketMetadata.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-muted-foreground">{attr.trait_type}:</span>
                        <span className="font-medium">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  {qrCodeDataUrl && (
                    <Image
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      width={150}
                      height={150}
                      className="mx-auto border rounded"
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Ticket QR Code</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Button onClick={downloadQRCode} size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button onClick={shareTicket} size="sm" variant="outline">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Send className="mr-1 h-3 w-3" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Transfer NFT Ticket</DialogTitle>
                <DialogDescription>
                  Transfer this ticket to another wallet address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-address">Recipient Address</Label>
                  <Input
                    id="transfer-address"
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleTransfer}
                    disabled={!transferAddress || isTransferring}
                    className="flex-1"
                  >
                    {isTransferring ? "Transferring..." : "Transfer"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsTransferModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={openInExplorer}
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          View on BaseScan
        </Button>
      </CardContent>
    </Card>
  )
}
