"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWallet } from "@/context/wallet-context"
import { getEventContract, publicClient } from "@/lib/contract"
import { QrCode, CheckCircle, UserCheck, Users, Camera } from "lucide-react"
import { QrReader } from 'react-qr-reader'

interface EventCheckinProps {
  eventId: string
  isOrganizer: boolean
}

interface CheckinData {
  attendeeAddress: string
  tokenId: string
  checkinTime: number
  txHash?: string
}

export function EventCheckin({ eventId, isOrganizer }: EventCheckinProps) {
  const { walletClient, address } = useWallet()
  const [checkinHistory, setCheckinHistory] = useState<CheckinData[]>([])
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [manualAddress, setManualAddress] = useState("")
  const [manualTokenId, setManualTokenId] = useState("")
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [scannerError, setScannerError] = useState<string>("")
  const [checkinsCount, setCheckinsCount] = useState(0)

  useEffect(() => {
    if (isOrganizer) {
      fetchCheckinHistory()
    }
  }, [eventId, isOrganizer])

  const fetchCheckinHistory = async () => {
    try {
      // Fetch checkin events from blockchain
      const logs = await publicClient.getLogs({
        address: getEventContract(walletClient!).address,
        event: {
          type: 'event',
          name: 'AttendanceMarked',
          inputs: [
            { name: 'eventId', type: 'uint256', indexed: true },
            { name: 'attendee', type: 'address', indexed: true },
            { name: 'tokenId', type: 'uint256', indexed: false },
            { name: 'timestamp', type: 'uint256', indexed: false }
          ]
        },
        args: {
          eventId: BigInt(eventId)
        },
        fromBlock: 'earliest'
      })

      const checkins = logs.map(log => ({
        attendeeAddress: log.args.attendee as string,
        tokenId: (log.args.tokenId as bigint).toString(),
        checkinTime: Number(log.args.timestamp as bigint),
        txHash: log.transactionHash
      }))

      setCheckinHistory(checkins)
      setCheckinsCount(checkins.length)
    } catch (error) {
      console.error('Failed to fetch checkin history:', error)
    }
  }

  const handleQrScan = async (result: any) => {
    if (!result) return

    try {
      const data = JSON.parse(result.text)
      if (data.eventId === eventId && data.tokenId && data.owner) {
        await checkInAttendee(data.owner, data.tokenId)
        setIsQrScannerOpen(false)
      } else {
        setScannerError("Invalid QR code or wrong event")
      }
    } catch (error) {
      setScannerError("Failed to parse QR code")
    }
  }

  const handleManualCheckin = async () => {
    if (!manualAddress || !manualTokenId) return
    await checkInAttendee(manualAddress, manualTokenId)
    setManualAddress("")
    setManualTokenId("")
  }

  const checkInAttendee = async (attendeeAddress: string, tokenId: string) => {
    if (!walletClient || !isOrganizer) return

    setIsCheckingIn(true)
    try {
      const contract = getEventContract(walletClient)
      
      // Call the smart contract to mark attendance
      const tx = await walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'markAttendance',
        args: [BigInt(eventId), attendeeAddress, BigInt(tokenId)],
        chain: contract.client.chain,
      })

      // Update local state
      const newCheckin: CheckinData = {
        attendeeAddress,
        tokenId,
        checkinTime: Date.now() / 1000,
        txHash: tx
      }
      
      setCheckinHistory(prev => [...prev, newCheckin])
      setCheckinsCount(prev => prev + 1)

    } catch (error) {
      console.error('Checkin failed:', error)
      setScannerError("Check-in failed. Please try again.")
    } finally {
      setIsCheckingIn(false)
    }
  }

  if (!isOrganizer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Event Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Only event organizers can access the check-in system.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Event Check-in System
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {checkinsCount} checked in
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scan">QR Scan</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-4">
              <div className="text-center space-y-4">
                <Dialog open={isQrScannerOpen} onOpenChange={setIsQrScannerOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <QrCode className="mr-2 h-5 w-5" />
                      Start QR Scanner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Scan Ticket QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="aspect-square border rounded-lg overflow-hidden">
                        <QrReader
                          onResult={handleQrScan}
                          constraints={{ facingMode: 'environment' }}
                          containerStyle={{ width: '100%', height: '100%' }}
                        />
                      </div>
                      {scannerError && (
                        <p className="text-sm text-red-500 text-center">{scannerError}</p>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => setIsQrScannerOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-muted-foreground">
                  Ask attendees to show their NFT ticket QR code
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="attendee-address">Attendee Address</Label>
                  <Input
                    id="attendee-address"
                    placeholder="0x..."
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="token-id">Token ID</Label>
                  <Input
                    id="token-id"
                    placeholder="Token ID"
                    value={manualTokenId}
                    onChange={(e) => setManualTokenId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleManualCheckin}
                  disabled={!manualAddress || !manualTokenId || isCheckingIn}
                  className="w-full"
                >
                  {isCheckingIn ? "Checking in..." : "Check In Attendee"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {checkinHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No check-ins yet
                  </p>
                ) : (
                  checkinHistory.map((checkin, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">
                              {checkin.attendeeAddress.slice(0, 6)}...{checkin.attendeeAddress.slice(-4)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Token #{checkin.tokenId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(checkin.checkinTime * 1000).toLocaleString()}
                          </p>
                          {checkin.txHash && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-xs"
                              onClick={() => window.open(`https://sepolia.basescan.org/tx/${checkin.txHash}`, '_blank')}
                            >
                              View Tx
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
