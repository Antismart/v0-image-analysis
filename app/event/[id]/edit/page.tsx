import { EventForm } from "@/components/event-form"
import { WalletRequired } from "@/components/wallet-required"
import { EventCreationIllustration } from "@/components/illustrations"

export default function EditEventPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground">
            Update your event details below. You can change the title, description, date, and more.
          </p>
        </div>
        <div className="flex justify-center">
          <EventCreationIllustration className="max-w-[300px]" />
        </div>
      </div>

      <WalletRequired>
        <EventForm mode="edit" />
      </WalletRequired>
    </div>
  )
}
