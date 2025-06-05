"use client"

import React, { useState, useEffect } from "react"
import { useXMTP } from "@/context/xmtp-context"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Loader2, MessageCircle, Users, Send } from "lucide-react"

export function XmtpV3Test() {
  const { isConnected: isWalletConnected, address } = useWallet()
  const { 
    isConnected: isXmtpConnected, 
    connect: connectXmtp, 
    isConnecting, 
    error, 
    inboxId,
    createGroup,
    getUserGroups,
    findInboxIdByAddress,
    xmtpClient
  } = useXMTP()

  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({
    walletConnection: null,
    xmtpConnection: null,
    inboxIdGeneration: null,
    groupCreation: null,
    inboxIdLookup: null,
  })

  const [testGroup, setTestGroup] = useState<any>(null)
  const [testAddress, setTestAddress] = useState("")
  const [foundInboxId, setFoundInboxId] = useState<string | null>(null)

  // Update test results based on current state
  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      walletConnection: isWalletConnected,
      xmtpConnection: isXmtpConnected,
      inboxIdGeneration: inboxId ? true : (isXmtpConnected ? false : null)
    }))
  }, [isWalletConnected, isXmtpConnected, inboxId])

  const runXmtpConnection = async () => {
    try {
      console.log("Testing XMTP V3 connection...")
      await connectXmtp()
      console.log("XMTP V3 connection successful!")
    } catch (error) {
      console.error("XMTP V3 connection failed:", error)
    }
  }

  const testGroupCreation = async () => {
    if (!isXmtpConnected) return

    try {
      console.log("Testing V3 group creation...")
      const group = await createGroup(
        `Test Group ${Date.now()}`,
        "Test group for V3 validation",
        []
      )
      
      if (group) {
        setTestGroup(group)
        setTestResults(prev => ({ ...prev, groupCreation: true }))
        console.log("Group creation successful:", group.id)
      } else {
        setTestResults(prev => ({ ...prev, groupCreation: false }))
        console.error("Group creation returned null")
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, groupCreation: false }))
      console.error("Group creation failed:", error)
    }
  }

  const testInboxIdLookup = async () => {
    if (!isXmtpConnected || !testAddress) return

    try {
      console.log("Testing inbox ID lookup for address:", testAddress)
      const inboxId = await findInboxIdByAddress(testAddress)
      
      if (inboxId) {
        setFoundInboxId(inboxId)
        setTestResults(prev => ({ ...prev, inboxIdLookup: true }))
        console.log("Inbox ID lookup successful:", inboxId)
      } else {
        setTestResults(prev => ({ ...prev, inboxIdLookup: false }))
        console.log("Inbox ID lookup returned null - address may not be on XMTP")
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, inboxIdLookup: false }))
      console.error("Inbox ID lookup failed:", error)
    }
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader2 className="h-4 w-4 animate-spin" />
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "secondary"
    return status ? "success" : "destructive"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          XMTP V3 Migration Test
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test suite to validate XMTP V3 implementation and migration from V2
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Status */}
        <div className="space-y-3">
          <h3 className="font-semibold">Current Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.walletConnection)}
              <span className="text-sm">Wallet Connected</span>
              <Badge variant={getStatusColor(testResults.walletConnection) as any}>
                {testResults.walletConnection ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.xmtpConnection)}
              <span className="text-sm">XMTP V3 Connected</span>
              <Badge variant={getStatusColor(testResults.xmtpConnection) as any}>
                {testResults.xmtpConnection ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
          
          {address && (
            <div className="text-sm">
              <strong>Wallet Address:</strong> {address}
            </div>
          )}
          
          {inboxId && (
            <div className="text-sm">
              <strong>XMTP Inbox ID:</strong> {inboxId}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <Separator />

        {/* Test Actions */}
        <div className="space-y-4">
          <h3 className="font-semibold">Test Actions</h3>
          
          {/* XMTP Connection Test */}
          <div className="space-y-2">
            <Button 
              onClick={runXmtpConnection}
              disabled={!isWalletConnected || isConnecting || isXmtpConnected}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting to XMTP V3...
                </>
              ) : isXmtpConnected ? (
                "XMTP V3 Connected"
              ) : (
                "Test XMTP V3 Connection"
              )}
            </Button>
          </div>

          {/* Group Creation Test */}
          <div className="space-y-2">
            <Button
              onClick={testGroupCreation}
              disabled={!isXmtpConnected}
              variant="outline"
              className="w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              Test V3 Group Creation
            </Button>
            {testGroup && (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                <strong>Test Group Created:</strong> {testGroup.id || testGroup.name}
              </div>
            )}
          </div>

          {/* Inbox ID Lookup Test */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Ethereum address to lookup inbox ID"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={testInboxIdLookup}
                disabled={!isXmtpConnected || !testAddress}
                variant="outline"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {foundInboxId && (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                <strong>Found Inbox ID:</strong> {foundInboxId}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Test Results Summary */}
        <div className="space-y-3">
          <h3 className="font-semibold">Test Results</h3>
          <div className="space-y-2">
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className="flex items-center justify-between">
                <span className="text-sm capitalize">
                  {test.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(result)}
                  <Badge variant={getStatusColor(result) as any}>
                    {result === null ? "Pending" : result ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* V3 Features Summary */}
        <div className="space-y-2">
          <h3 className="font-semibold">V3 Migration Features</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>✅ Native MLS-encrypted group conversations</div>
            <div>✅ Inbox ID system (replacing address-based)</div>
            <div>✅ Local database with encryption</div>
            <div>✅ Improved message streaming</div>
            <div>✅ Enhanced security and privacy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
