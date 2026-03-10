import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile",
  description: "View your onchain identity, NFT tickets, and event history on Pamoja Events.",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
