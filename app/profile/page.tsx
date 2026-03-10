"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const ProfileView = dynamic(
  () => import("@/components/profile-view").then(mod => ({ default: mod.ProfileView })),
  { ssr: false, loading: () => <div className="animate-pulse h-[600px] bg-gray-200 rounded-lg" /> }
)
import { WalletRequired } from "@/components/wallet-required"
import { Skeleton } from "@/components/ui/skeleton"
import { CommunityIllustration } from "@/components/illustrations"

export default function ProfilePage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Your Onchain Identity</h1>
            <p className="text-muted-foreground">
              Your events, NFT tickets, and reputation — all tied to your wallet. One identity, fully portable.
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
