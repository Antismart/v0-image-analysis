import { Suspense } from "react"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { WalletRequired } from "@/components/wallet-required"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardIllustration } from "@/components/illustrations"

export default function DashboardPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events, track attendance, and view analytics for your Pamoja Events.
            </p>
          </div>
          <div className="flex justify-center">
            <DashboardIllustration className="max-w-[300px]" />
          </div>
        </div>

        <WalletRequired>
          <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
            <OrganizerDashboard />
          </Suspense>
        </WalletRequired>
      </div>
    </section>
  )
}
