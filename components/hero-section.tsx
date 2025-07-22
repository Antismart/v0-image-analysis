import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { WelcomeIllustration } from "@/components/illustrations"
import { ResponsiveContainer } from "@/components/responsive-container"

export default function HeroSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-2 sm:px-4 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-background light-surface dark-surface">
      <ResponsiveContainer>
        <div className="flex flex-col-reverse gap-6 sm:gap-8 md:gap-10 lg:grid lg:gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center items-center lg:items-start space-y-6 sm:space-y-8 w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 md:mb-4">
              <Logo size="lg" />
              <div className="h-6 sm:h-8 w-px bg-muted"></div>
              <span className="text-xs sm:text-sm tracking-wide text-muted-foreground light-text-muted dark-text-muted">Your People. Your Events. Your Way.</span>
            </div>
            <div className="space-y-4 sm:space-y-5 w-full">
              <h1 className="font-display font-extrabold text-balance tracking-tighter text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight text-center lg:text-left light-text-enhanced dark-text-enhanced">
                Pamoja – Where Your People Are.
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed text-center lg:text-left px-2 sm:px-0 light-text-muted dark-text-muted">
                Bring your people together. Plan events, chat securely, and build lasting connections — all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 w-full sm:w-auto items-center lg:items-start mt-2">
              <Link href="/create" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md font-medium tracking-wide h-11 sm:h-10 text-sm sm:text-base light-shadow-interactive dark-shadow-interactive">
                  Create Event
                </Button>
              </Link>
              <Link href="/#events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-pamoja-200 dark:border-pamoja-800/50 font-medium tracking-wide h-11 sm:h-10 text-sm sm:text-base light-shadow dark-shadow"
                >
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mb-2 lg:mb-0">
            <WelcomeIllustration className="max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-full w-full h-auto" />
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
