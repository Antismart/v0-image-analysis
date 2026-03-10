"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { ResponsiveContainer } from "@/components/responsive-container"

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "Do I need crypto to use Pamoja?",
    answer:
      "You need a wallet and some USDC on Base to purchase tickets. Setting up is easy — Privy lets you create a wallet in seconds with just an email or social login.",
  },
  {
    question: "What blockchain does Pamoja run on?",
    answer:
      "Pamoja runs on Base, an Ethereum L2 built by Coinbase. Transactions are fast, secure, and cost less than a cent.",
  },
  {
    question: "What are NFT tickets?",
    answer:
      "Every ticket you purchase is minted as an NFT — a digital collectible that proves you attended. You own it forever, and nobody can take it away.",
  },
  {
    question: "Can I token-gate my event?",
    answer:
      "Yes. You can require attendees to hold specific tokens or NFTs to access your event. Perfect for DAOs, communities, and exclusive gatherings.",
  },
  {
    question: "How do payments work?",
    answer:
      "All payments are in USDC (a stablecoin pegged to USD) on Base. Organizers receive funds instantly — no waiting for bank transfers or dealing with payment processors.",
  },
  {
    question: "Is my data private?",
    answer:
      "Pamoja uses decentralized messaging via XMTP. Your conversations are end-to-end encrypted. We don't store or sell your data.",
  },
]

export function FAQSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-background">
      <ResponsiveContainer>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-extrabold tracking-tighter text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Pamoja Events.
          </p>
        </div>

        <div className="max-w-[700px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-primary hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
