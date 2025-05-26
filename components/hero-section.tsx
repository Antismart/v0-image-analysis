import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { WelcomeIllustration } from "@/components/illustrations"
import { ResponsiveContainer } from "@/components/responsive-container"

export default function HeroSection() {
  return (
    <section className="py-12 px-2 sm:px-4 md:py-16 lg:py-24 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-background">
      <ResponsiveContainer>
        <div className="flex flex-col-reverse gap-10 lg:grid lg:gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center items-center lg:items-start space-y-8 w-full">
            <div className="flex items-center gap-3 mb-2 sm:mb-4">
              <Logo size="lg" />
              <div className="h-8 w-px bg-muted"></div>
              <span className="text-sm tracking-wide text-muted-foreground">Decentralized Events Platform</span>
            </div>
            <div className="space-y-5 w-full">
              <h1 className="font-display font-extrabold text-balance tracking-tighter text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-center lg:text-left">
                Connect, Coordinate, Create
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-center lg:text-left">
                Pamoja Events is a decentralized event platform. Create token-gated events, chat securely
                with XMTP, and build your web3 community.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 w-full sm:w-auto items-center lg:items-start mt-2">
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
          <div className="flex items-center justify-center w-full mb-2 lg:mb-0">
            <WelcomeIllustration className="max-w-[160px] xs:max-w-[220px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-full w-full h-auto" />
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
