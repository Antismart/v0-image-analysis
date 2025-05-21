"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Save, Bell, Shield, User, Globe, Check, AlertCircle } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { Loading } from "@/components/ui/loading"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  displayName?: string
  email?: string
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { address } = useWallet()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validate form when values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm()
    }
  }, [displayName, email, touched])

  // Mark field as touched when user interacts with it
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Validate the form fields
  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Validate display name if it's not empty
    if (displayName && (displayName.length < 2 || displayName.length > 50)) {
      newErrors.displayName = "Display name must be between 2 and 50 characters"
    }

    // Validate email if it's not empty
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    // Mark all fields as touched to trigger validation
    setTouched({
      displayName: true,
      email: true,
    })

    // Validate all fields before saving
    const isValid = validateForm()

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success state
      setSaveSuccess(true)

      // Show toast notification
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      })

      // Reset success state after a delay and close modal
      setTimeout(() => {
        setSaveSuccess(false)
        onClose()
      }, 1500)
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input id="wallet-address" value={address || ""} disabled className="bg-muted font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Your wallet address cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name" className={errors.displayName ? "text-destructive" : ""}>
                Display Name
              </Label>
              <Input
                id="display-name"
                placeholder="Enter a display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={() => handleBlur("displayName")}
                className={errors.displayName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.displayName ? (
                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.displayName}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">This name will be displayed to other users</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email ? (
                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Used for notifications and updates</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive email notifications about events</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={profileVisibility === "public"}
                    onChange={() => setProfileVisibility("public")}
                    className="h-4 w-4 rounded-full border-gray-300"
                  />
                  <div>
                    <Label htmlFor="public" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Public
                    </Label>
                    <p className="text-xs text-muted-foreground">Anyone can see your profile</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={profileVisibility === "private"}
                    onChange={() => setProfileVisibility("private")}
                    className="h-4 w-4 rounded-full border-gray-300"
                  />
                  <div>
                    <Label htmlFor="private" className="flex items-center gap-1">
                      <Shield className="h-4 w-4" /> Private
                    </Label>
                    <p className="text-xs text-muted-foreground">Only event organizers can see your profile</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={isSaving || saveSuccess || Object.keys(errors).length > 0}
          >
            {isSaving ? (
              <>
                <Loading variant="spinner" size="xs" className="mr-2" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
