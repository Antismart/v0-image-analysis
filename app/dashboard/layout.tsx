import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your events, track attendance, and view analytics on Pamoja Events.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
