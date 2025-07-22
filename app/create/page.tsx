import { EventForm } from "@/components/event-form"
import { WalletRequired } from "@/components/wallet-required"
import { WalletBalanceDisplay } from "@/components/wallet-balance-display"
import { EventCreationIllustration } from "@/components/illustrations"

export default function CreateEventPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="mb-2 sm:mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              Create New Event
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-2 sm:px-0">
              Fill out the form to create your event. You can set up token-gating, NFT tickets, and more.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <EventCreationIllustration className="max-w-[160px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px]" />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <WalletRequired>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <EventForm />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <WalletBalanceDisplay />
                </div>
              </div>
            </div>
          </WalletRequired>
        </div>
      </div>
    </section>
  )
}
