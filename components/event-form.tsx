"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, MapPin, Upload, Users, Plus, Trash, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LoadingButton } from "@/components/ui/loading"
import { useWallet } from "@/context/wallet-context"
import { useXMTP } from "@/context/xmtp-context"
import { getEventContract, publicClient } from "@/lib/contract"
import { parseEther } from "@/lib/parse-ether"

// Add types for schedule and speakers
interface ScheduleItem {
  title: string;
  time: string;
  description: string;
}
interface SpeakerItem {
  name: string;
  title: string;
  bio: string;
  avatar?: string; // URL or base64
}

export function EventForm({ mode = "create", eventData }: { mode?: "create" | "edit"; eventData?: any }) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isTokenGated, setIsTokenGated] = useState(false)
  const [isNftTicket, setIsNftTicket] = useState(false)
  const [enableChat, setEnableChat] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleItem[]>(eventData?.schedule || [
    { title: "", time: "", description: "" }
  ])
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(eventData?.speakers || [
    { name: "", title: "", bio: "", avatar: "" }
  ])
  const [bannerPreview, setBannerPreview] = useState<string | null>(eventData?.banner || null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const { walletClient, isConnected } = useWallet();
  const { xmtpClient, isConnected: isXmtpConnected, connect: connectXMTP, createGroup } = useXMTP();

  useEffect(() => {
    if (mode === "edit" && eventData) {
      setDate(eventData.date ? new Date(eventData.date) : undefined)
      setIsTokenGated(eventData.isTokenGated)
      setIsNftTicket(eventData.isNftTicket)
      setEnableChat(eventData.xmtpGroupId ? true : false)
    }
  }, [mode, eventData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isConnected || !walletClient) {
      setIsSubmitting(false);
      alert("Please connect your wallet to create an event.");
      return;
    }
    let imageUrl = eventData?.banner || '';
    let uploadedIpfsUrl = '';
    if (bannerFile) {
      const formData = new FormData();
      formData.append('file', bannerFile);
      try {
        const res = await fetch('/api/uploadToPinata', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.ipfsUrl) {
          imageUrl = data.ipfsUrl;
          uploadedIpfsUrl = data.ipfsUrl;
          // Show the IPFS hash to the user (for debugging/confirmation)
          alert(`Image uploaded to Pinata! IPFS URL: ${uploadedIpfsUrl}\nHash: ${uploadedIpfsUrl.split('/ipfs/')[1]}`);
          // Optionally, also log to console
          console.log('Pinata IPFS URL:', uploadedIpfsUrl);
        }
      } catch (err) {
        setIsSubmitting(false);
        alert('Image upload failed. Please try again.');
        return;
      }
    }
    try {
      // Collect form values
      const title = (document.getElementById('title') as HTMLInputElement)?.value || '';
      const description = (document.getElementById('description') as HTMLTextAreaElement)?.value || '';
      const location = (document.getElementById('location') as HTMLInputElement)?.value || '';
      const capacity = parseInt((document.getElementById('capacity') as HTMLInputElement)?.value || '0', 10);
      // Combine date and time fields
      let dateTime = 0;
      if (date) {
        const timeStr = (document.getElementById('time') as HTMLInputElement)?.value || '00:00';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const combined = new Date(date);
        combined.setHours(hours || 0, minutes || 0, 0, 0);
        dateTime = Math.floor(combined.getTime() / 1000);
      }
      let ticketPrice = BigInt(0);
      let usdcToken = '0x0000000000000000000000000000000000000000';
      let xmtpGroupId = '';
      
      // NFT ticketing
      if (isNftTicket) {
        const ticketPriceUsd = (document.getElementById('ticket-price') as HTMLInputElement)?.value || '0';
        // USDC address for Base Sepolia testnet
        usdcToken = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
        // If using USDC, ticketPrice should be in 6 decimals (USDC has 6 decimals)
        if (isNftTicket) {
          const ticketPriceUsd = (document.getElementById('ticket-price') as HTMLInputElement)?.value || '0';
          // Convert to 6 decimals for USDC
          ticketPrice = BigInt(Math.floor(Number(ticketPriceUsd) * 1_000_000));
        }
      }
      
      // XMTP Group Creation
      if (enableChat) {
        try {
          // Connect to XMTP if not already connected
          if (!isXmtpConnected) {
            console.log("Connecting to XMTP for group creation...");
            await connectXMTP();
          }
          
          // Create group for the event
          const groupName = `${title} - Event Chat`;
          const groupDescription = `Discussion group for the event: ${title}`;
          const group = await createGroup(groupName, groupDescription);
          
          if (group) {
            xmtpGroupId = group.id;
            console.log("XMTP group created successfully:", xmtpGroupId);
          } else {
            console.warn("Failed to create XMTP group, proceeding without chat");
          }
        } catch (error) {
          console.error("Error creating XMTP group:", error);
          // Continue with event creation even if group creation fails
          console.warn("Proceeding with event creation without chat group");
        }
      }
      // Call contract
      const contract = getEventContract(walletClient);
      // Get next event id for localStorage key
      const nextEventId = await publicClient.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "nextEventId",
      }) as bigint;
      const eventIdx = Number(nextEventId);
      // Store schedule and speakers in localStorage for this event
      if (typeof window !== 'undefined') {
        localStorage.setItem(`event-schedule-${eventIdx}`, JSON.stringify(schedule));
        localStorage.setItem(`event-speakers-${eventIdx}`, JSON.stringify(speakers));
      }
      const args = [
        title,
        description,
        dateTime,
        location,
        BigInt(capacity),
        ticketPrice,
        imageUrl,
        usdcToken,
        xmtpGroupId,
      ];
      await walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'createEvent',
        args,
        chain: contract.client.chain,
      });
      setIsSubmitting(false);
      router.push("/dashboard");
    } catch (err: any) {
      setIsSubmitting(false);
      alert('Failed to create event: ' + (err?.message || err));
    }
  }

  // Schedule handlers
  const handleScheduleChange = (idx: number, field: keyof ScheduleItem, value: string) => {
    setSchedule((prev: ScheduleItem[]) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }
  const addScheduleItem = () => setSchedule([...schedule, { title: "", time: "", description: "" }])
  const removeScheduleItem = (idx: number) => setSchedule(schedule.filter((_, i) => i !== idx))

  // Speakers handlers
  const handleSpeakerChange = (idx: number, field: keyof SpeakerItem, value: string) => {
    setSpeakers((prev: SpeakerItem[]) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }
  const addSpeaker = () => setSpeakers([...speakers, { name: "", title: "", bio: "", avatar: "" }])
  const removeSpeaker = (idx: number) => setSpeakers(speakers.filter((_, i) => i !== idx))
  const handleSpeakerAvatarChange = (idx: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSpeakers((prev: SpeakerItem[]) => prev.map((item, i) => i === idx ? { ...item, avatar: reader.result as string } : item));
    };
    reader.readAsDataURL(file);
  };

  // Speaker avatar Pinata upload
  async function handleSpeakerAvatarUpload(file: File, idx: number) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/uploadToPinata', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.ipfsUrl) {
        // Update the speaker avatar with the Pinata IPFS URL
        setSpeakers((prev) => prev.map((s, i) => i === idx ? { ...s, avatar: data.ipfsUrl } : s));
        alert(`Speaker image uploaded! IPFS URL: ${data.ipfsUrl}\nHash: ${data.ipfsUrl.split('/ipfs/')[1]}`);
        console.log('Speaker Pinata IPFS URL:', data.ipfsUrl);
      }
    } catch (err) {
      alert('Speaker image upload failed. Please try again.');
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="title" className="form-label">
            Event Title
          </Label>
          <Input id="title" placeholder="Enter event title" required className="mt-1.5" defaultValue={eventData?.title} />
        </div>

        <div>
          <Label htmlFor="description" className="form-label">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your event"
            className="min-h-32 mt-1.5"
            required
            defaultValue={eventData?.description}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="form-label">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal mt-1.5", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time" className="form-label">
              Time
            </Label>
            <div className="relative mt-1.5">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="time" type="time" className="pl-10" required defaultValue={eventData?.time} />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="form-label">
            Location
          </Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="location" placeholder="Event location or 'Virtual'" className="pl-10" required defaultValue={eventData?.location} />
          </div>
        </div>

        <div>
          <Label htmlFor="capacity" className="form-label">
            Capacity
          </Label>
          <div className="relative mt-1.5">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="Maximum attendees"
              className="pl-10"
              required
              defaultValue={eventData?.capacity}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="banner" className="form-label">
            Event Banner
          </Label>
          <div className="mt-1.5 flex flex-col items-center justify-center rounded-lg border border-dashed p-4 sm:p-6">
            {bannerPreview && (
              <img src={bannerPreview} alt="Event banner preview" className="mb-4 max-h-48 rounded-lg object-cover" />
            )}
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              <div className="flex flex-wrap justify-center text-sm text-muted-foreground">
                <label
                  htmlFor="banner-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                >
                  <span>Upload a file</span>
                  <Input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={handleBannerChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="token-gated">Token-Gated Event</Label>
              <p className="text-sm text-muted-foreground">Restrict access to token holders</p>
            </div>
            <Switch id="token-gated" checked={isTokenGated} onCheckedChange={setIsTokenGated} />
          </div>

          {isTokenGated && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <Label htmlFor="token-address">Token Contract Address</Label>
                <Input id="token-address" placeholder="0x..." defaultValue={eventData?.tokenAddress} />
              </div>
              <div>
                <Label htmlFor="token-amount">Minimum Token Amount</Label>
                <Input
                  id="token-amount"
                  type="number"
                  min="0"
                  step="0.000001"
                  placeholder="1.0"
                  defaultValue={eventData?.tokenAmount}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="nft-ticket">NFT Ticketing</Label>
              <p className="text-sm text-muted-foreground">Create NFT tickets for attendees</p>
            </div>
            <Switch id="nft-ticket" checked={isNftTicket} onCheckedChange={setIsNftTicket} />
          </div>

          {isNftTicket && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <Label htmlFor="ticket-price">Ticket Price (USDC)</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="0.05"
                  defaultValue={eventData?.ticketPrice}
                />
              </div>
              <div>
                <Label htmlFor="ticket-name">Ticket Collection Name</Label>
                <Input id="ticket-name" placeholder="My Event Tickets" defaultValue={eventData?.ticketName} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Event Chat (XMTP)
              </Label>
              <p className="text-sm text-muted-foreground">
                Create a decentralized chat group for event attendees using XMTP protocol
              </p>
            </div>
            <Switch id="enable-chat" checked={enableChat} onCheckedChange={setEnableChat} />
          </div>

          {enableChat && (
            <div className="space-y-2 rounded-lg border p-4 bg-muted/50">
              <p className="text-sm font-medium">Chat Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time messaging for attendees</li>
                <li>• Decentralized and secure (XMTP protocol)</li>
                <li>• Automatic group creation when event is published</li>
                <li>• Event organizers get admin privileges</li>
              </ul>
              {!isXmtpConnected && (
                <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  ⚠️ XMTP connection will be established when the event is created
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Event Schedule</h3>
          {schedule.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end border p-2 rounded-md mb-2">
              <Input
                placeholder="Session Title"
                value={item.title}
                onChange={e => handleScheduleChange(idx, "title", e.target.value)}
                className=""
              />
              <Input
                placeholder="Time (e.g. 6:00 PM - 7:00 PM)"
                value={item.time}
                onChange={e => handleScheduleChange(idx, "time", e.target.value)}
                className=""
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={e => handleScheduleChange(idx, "description", e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleItem(idx)} aria-label="Remove schedule item">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addScheduleItem} className="mt-2">
            <Plus className="h-4 w-4 mr-1" /> Add Schedule Item
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Speakers</h3>
          {speakers.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end border p-2 rounded-md mb-2">
              <div className="flex flex-col items-center gap-2">
                {item.avatar ? (
                  <img src={item.avatar} alt="Speaker avatar" className="w-12 h-12 rounded-full object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground border">No Image</div>
                )}
                {/* Speaker avatar upload input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files && handleSpeakerAvatarUpload(e.target.files[0], idx)}
                  className="block text-xs"
                />
              </div>
              <Input
                placeholder="Name"
                value={item.name}
                onChange={e => handleSpeakerChange(idx, "name", e.target.value)}
              />
              <Input
                placeholder="Title/Role"
                value={item.title}
                onChange={e => handleSpeakerChange(idx, "title", e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Short Bio"
                  value={item.bio}
                  onChange={e => handleSpeakerChange(idx, "bio", e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpeaker(idx)} aria-label="Remove speaker">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addSpeaker} className="mt-2">
            <Plus className="h-4 w-4 mr-1" /> Add Speaker
          </Button>
        </div>
      </div>

      <LoadingButton type="submit" className="w-full" loading={isSubmitting} loadingText="Creating Event...">
        Create Event
      </LoadingButton>
    </form>
  )
}
