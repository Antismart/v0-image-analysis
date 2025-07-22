import { Suspense } from "react"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { WalletRequired } from "@/components/wallet-required"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardIllustration } from "@/components/illustrations"

export default function DashboardPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 light:dashboard-background dark:dashboard-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-12 grid gap-6 lg:gap-8 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold light-text-enhanced dark-text-enhanced">Organizer Dashboard</h1>
            <p className="text-muted-foreground light-text-muted dark-text-muted text-sm sm:text-base lg:text-lg">
              Manage your events, track attendance, and view analytics for your Pamoja Events.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <DashboardIllustration className="max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <WalletRequired>
            <Suspense fallback={<Skeleton className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg light-shadow dark-shadow" />}>
              <OrganizerDashboard />
            </Suspense>
          </WalletRequired>
        </div>
      </div>
    </section>
  )
}
