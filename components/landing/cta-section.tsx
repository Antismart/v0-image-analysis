import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer } from "@/components/responsive-container"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-primary via-orange-500 to-amber-500 dark:from-primary/90 dark:via-orange-600 dark:to-amber-600 py-16 lg:py-24">
      <ResponsiveContainer>
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display font-extrabold tracking-tighter text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Ready to Bring Your Community Onchain?
          </h2>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Create your first event in minutes. No platform fees. No middlemen.
            Just you and your people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-white/90 shadow-lg"
            >
              <Link href="/create">
                Create Your Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/#events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
