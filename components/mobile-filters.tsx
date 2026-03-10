"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface MobileFiltersProps {
  onApply?: (filters: { sortBy: string }) => void
}

export function MobileFilters({ onApply }: MobileFiltersProps) {
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [open, setOpen] = useState(false)

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 sm:hidden">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Filter Events</DrawerTitle>
          <DrawerDescription>Narrow down events based on your preferences</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Date</h3>
              <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="today" id="today" />
                  <Label htmlFor="today">Today</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="this-week" id="this-week" />
                  <Label htmlFor="this-week">This Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="this-month" id="this-month" />
                  <Label htmlFor="this-month">This Month</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium">Event Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-person"
                    checked={selectedTypes.includes("in-person")}
                    onCheckedChange={() => handleTypeChange("in-person")}
                  />
                  <Label htmlFor="in-person">In Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtual"
                    checked={selectedTypes.includes("virtual")}
                    onCheckedChange={() => handleTypeChange("virtual")}
                  />
                  <Label htmlFor="virtual">Virtual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hybrid"
                    checked={selectedTypes.includes("hybrid")}
                    onCheckedChange={() => handleTypeChange("hybrid")}
                  />
                  <Label htmlFor="hybrid">Hybrid</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium">Access</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public"
                    checked={selectedTypes.includes("public")}
                    onCheckedChange={() => handleTypeChange("public")}
                  />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="token-gated"
                    checked={selectedTypes.includes("token-gated")}
                    onCheckedChange={() => handleTypeChange("token-gated")}
                  />
                  <Label htmlFor="token-gated">Token-Gated</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium">Sort By</h3>
              <RadioGroup value={sortBy} onValueChange={setSortBy}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oldest" id="sort-oldest" />
                  <Label htmlFor="sort-oldest">Oldest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attendees" id="sort-attendees" />
                  <Label htmlFor="sort-attendees">Most Attendees</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="sort-price-low" />
                  <Label htmlFor="sort-price-low">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="sort-price-high" />
                  <Label htmlFor="sort-price-high">Price: High to Low</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => {
            onApply?.({ sortBy })
            setOpen(false)
          }}>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
