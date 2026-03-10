import { ResponsiveContainer } from "@/components/responsive-container"

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: "100%", label: "Onchain Transparency" },
  { value: "0%", label: "Platform Fees" },
  { value: "<$0.01", label: "Transaction Costs on Base" },
  { value: "24/7", label: "Decentralized Uptime" },
]

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-orange-500 dark:from-primary/90 dark:to-orange-600">
      <ResponsiveContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-white/20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
            >
              <span className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                {stat.value}
              </span>
              <span className="mt-2 text-sm sm:text-base text-white/85 font-medium leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  )
}
