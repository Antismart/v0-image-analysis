"use client"

import dynamic from "next/dynamic"
import HeroSection from "@/components/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"

const EventDiscovery = dynamic(() => import("@/components/event-discovery"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  ),
})

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <EventDiscovery />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
