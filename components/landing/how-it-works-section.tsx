import { Wallet, CalendarPlus, Ticket, Users } from "lucide-react"
import { ResponsiveContainer } from "@/components/responsive-container"

const steps = [
  {
    number: 1,
    title: "Connect Your Wallet",
    description:
      "Sign in with your wallet via Privy — no passwords, no email required.",
    icon: Wallet,
  },
  {
    number: 2,
    title: "Create or Discover",
    description:
      "Set up your event in minutes or browse what's happening in your community.",
    icon: CalendarPlus,
  },
  {
    number: 3,
    title: "Ticket & Attend",
    description:
      "Purchase tickets with USDC. Each ticket is an NFT you actually own.",
    icon: Ticket,
  },
  {
    number: 4,
    title: "Connect & Chat",
    description:
      "Join the event group chat on XMTP. Meet your people before you even arrive.",
    icon: Users,
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-background">
      <ResponsiveContainer>
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-heading font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl mb-4 text-foreground">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            No complex setup. No intermediaries. Just connect and go.
          </p>
        </div>

        {/* Desktop horizontal flow (hidden on mobile) */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-0 items-start">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center px-4">
              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px">
                  <div className="w-full h-full bg-gradient-to-r from-pamoja-300 to-pamoja-200 dark:from-pamoja-700 dark:to-pamoja-800" />
                  {/* Arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-pamoja-300 dark:border-pamoja-700 rotate-45" />
                  </div>
                </div>
              )}

              {/* Numbered circle with icon */}
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-full bg-pamoja-50 dark:bg-pamoja-950/50 border-2 border-pamoja-200 dark:border-pamoja-800 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-pamoja-500 dark:text-pamoja-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-pamoja-500 dark:bg-pamoja-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground tracking-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet vertical flow (hidden on desktop) */}
        <div className="lg:hidden flex flex-col items-start max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex gap-4 sm:gap-6">
              {/* Vertical line and step indicator */}
              <div className="flex flex-col items-center">
                {/* Numbered circle with icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pamoja-50 dark:bg-pamoja-950/50 border-2 border-pamoja-200 dark:border-pamoja-800 flex items-center justify-center">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-pamoja-500 dark:text-pamoja-400" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pamoja-500 dark:bg-pamoja-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-sm">
                    {step.number}
                  </span>
                </div>

                {/* Vertical connecting line */}
                {index < steps.length - 1 && (
                  <div className="w-px h-full min-h-[2rem] bg-gradient-to-b from-pamoja-300 to-pamoja-200 dark:from-pamoja-700 dark:to-pamoja-800 my-2" />
                )}
              </div>

              {/* Content */}
              <div className={`pt-2 ${index < steps.length - 1 ? "pb-8 sm:pb-10" : "pb-0"}`}>
                <h3 className="font-heading font-semibold text-base sm:text-lg mb-1.5 text-foreground tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  )
}
