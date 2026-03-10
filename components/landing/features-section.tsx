import {
  Ticket,
  Shield,
  MessageCircle,
  Sparkles,
  Wallet,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import { ResponsiveContainer } from "@/components/responsive-container"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Ticket,
    title: "Transparent Ticketing",
    description:
      "Every ticket is minted onchain. No hidden fees, no counterfeits, full transparency.",
  },
  {
    icon: Shield,
    title: "Token-Gated Access",
    description:
      "Restrict events to holders of specific tokens or NFTs. Build exclusive communities.",
  },
  {
    icon: MessageCircle,
    title: "Built-in Group Chat",
    description:
      "Secure, decentralized messaging via XMTP. Coordinate with attendees before, during, and after.",
  },
  {
    icon: Sparkles,
    title: "NFT Tickets",
    description:
      "Attendees own their tickets as NFTs — collectible proof of attendance that lives forever.",
  },
  {
    icon: Wallet,
    title: "USDC Payments",
    description:
      "Pay and get paid in USDC on Base. Instant settlement, no chargebacks, low fees.",
  },
  {
    icon: BarChart3,
    title: "Organizer Dashboard",
    description:
      "Real-time analytics, attendee management, and revenue tracking in one place.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-background">
      <ResponsiveContainer>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-extrabold tracking-tighter text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Everything You Need to Run Events Onchain
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From ticketing to payments to community — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group rounded-xl border border-pamoja-100 dark:border-pamoja-900/30 bg-white/80 dark:bg-card/60 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pamoja-500/10 dark:hover:shadow-pamoja-500/5">
      <div className="mb-4 inline-flex items-center justify-center rounded-full bg-pamoja-100 dark:bg-pamoja-950/50 p-3">
        <Icon className="h-6 w-6 text-pamoja-500" />
      </div>
      <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  )
}
