import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { WelcomeIllustration } from "@/components/illustrations"
import { ResponsiveContainer } from "@/components/responsive-container"

export default function HeroSection() {
  return (
    <section className="py-10 md:py-16 lg:py-24 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-background">
      <ResponsiveContainer>
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3 mb-2 sm:mb-4">
              <Logo size="lg" />
              <div className="h-8 w-px bg-muted"></div>
              <span className="text-sm tracking-wide text-muted-foreground">Decentralized Events Platform</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-balance tracking-tighter text-4xl sm:text-5xl lg:text-6xl leading-tighter">
                Connect, Coordinate, Create
              </h1>
              <p className="max-w-[600px] text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Pamoja Events is a decentralized event platform built on Base. Create token-gated events, chat securely
                with XMTP, and build your web3 community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md font-medium tracking-wide">
                  Create Event
                </Button>
              </Link>
              <Link href="/#events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-pamoja-200 dark:border-pamoja-800/50 font-medium tracking-wide"
                >
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center order-first lg:order-last">
            <WelcomeIllustration className="max-w-[300px] sm:max-w-[400px] lg:max-w-full" />
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
