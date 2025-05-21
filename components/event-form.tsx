"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, MapPin, Upload, Users } from "lucide-react"
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

export function EventForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isTokenGated, setIsTokenGated] = useState(false)
  const [isNftTicket, setIsNftTicket] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="title" className="form-label">
            Event Title
          </Label>
          <Input id="title" placeholder="Enter event title" required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="description" className="form-label">
            Description
          </Label>
          <Textarea id="description" placeholder="Describe your event" className="min-h-32 mt-1.5" required />
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
              <Input id="time" type="time" className="pl-10" required />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="form-label">
            Location
          </Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="location" placeholder="Event location or 'Virtual'" className="pl-10" required />
          </div>
        </div>

        <div>
          <Label htmlFor="capacity" className="form-label">
            Capacity
          </Label>
          <div className="relative mt-1.5">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="capacity" type="number" min="1" placeholder="Maximum attendees" className="pl-10" required />
          </div>
        </div>

        <div>
          <Label htmlFor="banner" className="form-label">
            Event Banner
          </Label>
          <div className="mt-1.5 flex items-center justify-center rounded-lg border border-dashed p-4 sm:p-6">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              <div className="flex flex-wrap justify-center text-sm text-muted-foreground">
                <label
                  htmlFor="banner-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                >
                  <span>Upload a file</span>
                  <Input id="banner-upload" type="file" className="sr-only" accept="image/*" />
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
                <Input id="token-address" placeholder="0x..." />
              </div>
              <div>
                <Label htmlFor="token-amount">Minimum Token Amount</Label>
                <Input id="token-amount" type="number" min="0" step="0.000001" placeholder="1.0" />
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
                <Label htmlFor="ticket-price">Ticket Price (ETH)</Label>
                <Input id="ticket-price" type="number" min="0" step="0.001" placeholder="0.05" />
              </div>
              <div>
                <Label htmlFor="ticket-name">Ticket Collection Name</Label>
                <Input id="ticket-name" placeholder="My Event Tickets" />
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadingButton type="submit" className="w-full" loading={isSubmitting} loadingText="Creating Event...">
        Create Event
      </LoadingButton>
    </form>
  )
}
