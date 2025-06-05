"use client"

import React, { useState, useEffect } from "react"
import { useXMTP } from "@/context/xmtp-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Users, MessageCircle, Plus, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DecodedMessage, Conversation } from "@xmtp/browser-sdk"

// Define a local interface for Group based on the V3 structure
interface Group {
  id: string
  name?: string
  description?: string
  members: () => Promise<any[]> // V3 returns member objects with inboxId
}

interface XMTPGroupManagerProps {
  eventId: string
  eventTitle: string
  onGroupCreated?: (groupId: string) => void
}

const XMTPGroupManager: React.FC<XMTPGroupManagerProps> = ({
  eventId,
  eventTitle,
  onGroupCreated
}) => {
  const { xmtpClient, isConnected, connect, createGroup, getUserGroups, isConnecting } = useXMTP()
  const { toast } = useToast()
  const [groups, setGroups] = useState<Group[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newGroupName, setNewGroupName] = useState(`${eventTitle} Chat`)
  const [newGroupDescription, setNewGroupDescription] = useState(`Official chat for ${eventTitle}`)

  // Load user's groups
  const loadGroups = async () => {
    if (!xmtpClient || !isConnected) return
    
    setIsLoading(true)
    try {
      const userGroups = await getUserGroups()
      setGroups(userGroups)
    } catch (error) {
      console.error("Error loading groups:", error)
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && xmtpClient) {
      loadGroups()
    }
  }, [isConnected, xmtpClient])

  // Create new group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || isCreating) return

    setIsCreating(true)
    try {
      const group = await createGroup(newGroupName, newGroupDescription)
      if (group) {
        toast({
          title: "Group Created",
          description: `Successfully created "${newGroupName}"`,
        })
        
        // Refresh groups list
        await loadGroups()
        
        // Reset form
        setNewGroupName(`${eventTitle} Chat`)
        setNewGroupDescription(`Official chat for ${eventTitle}`)
        
        // Notify parent component
        onGroupCreated?.(group.id)
      }
    } catch (error) {
      console.error("Error creating group:", error)
      toast({
        title: "Creation Failed",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Copy group ID to clipboard
  const copyGroupId = async (groupId: string) => {
    try {
      await navigator.clipboard.writeText(groupId)
      toast({
        title: "Copied",
        description: "Group ID copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy group ID",
        variant: "destructive",
      })
    }
  }

  // Get member count for a group
  const getMemberCount = async (group: Group): Promise<number> => {
    try {
      const members = await group.members()
      return members.length
    } catch (error) {
      console.error("Error getting member count:", error)
      return 0
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            XMTP Group Management
          </CardTitle>
          <CardDescription>
            Connect to XMTP to manage event chat groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Button onClick={connect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect to XMTP"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create New Group */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Event Chat
          </CardTitle>
          <CardDescription>
            Create a new XMTP group chat for your event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupDescription">Description</Label>
            <Input
              id="groupDescription"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              placeholder="Enter group description"
            />
          </div>

          <Button 
            onClick={handleCreateGroup} 
            disabled={!newGroupName.trim() || isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Groups
          </CardTitle>
          <CardDescription>
            Manage your existing XMTP groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading groups...</span>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No groups found. Create your first group above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group, index) => (
                <div key={group.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{group.name || "Unnamed Group"}</h4>
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {/* Note: Member count would need async loading */}
                        Members
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {group.id.slice(0, 8)}...{group.id.slice(-8)}
                      </code>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyGroupId(group.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGroupCreated?.(group.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Separator className="my-4" />
          
          <Button 
            variant="outline" 
            onClick={loadGroups} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Refresh Groups"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default XMTPGroupManager
