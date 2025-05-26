import { EventForm } from "@/components/event-form"
import { WalletRequired } from "@/components/wallet-required"
import { EventCreationIllustration } from "@/components/illustrations"

export default function CreateEventPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">
              Fill out the form to create your event. You can set up token-gating, NFT tickets, and more.
            </p>
          </div>
          <div className="flex justify-center">
            <EventCreationIllustration className="max-w-[300px]" />
          </div>
        </div>
        <WalletRequired>
          <EventForm />
        </WalletRequired>
      </div>
    </section>
  )
}
