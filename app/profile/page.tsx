import { Suspense } from "react"
import { ProfileView } from "@/components/profile-view"
import { WalletRequired } from "@/components/wallet-required"
import { Skeleton } from "@/components/ui/skeleton"
import { CommunityIllustration } from "@/components/illustrations"

export default function ProfilePage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              View your events, tickets, and reputation. Connect with other community members.
            </p>
          </div>
          <div className="flex justify-center">
            <CommunityIllustration className="max-w-[300px]" />
          </div>
        </div>

        <WalletRequired>
          <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
            <ProfileView />
          </Suspense>
        </WalletRequired>
      </div>
    </section>
  )
}
