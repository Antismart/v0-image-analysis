import EventDiscovery from "@/components/event-discovery"
import HeroSection from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <EventDiscovery />
    </div>
  )
}
