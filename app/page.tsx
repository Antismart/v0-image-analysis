import EventDiscovery from "@/components/event-discovery"
import HeroSection from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
      <HeroSection />
      <EventDiscovery />
    </div>
  )
}
