import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { WalletProvider } from "@/context/wallet-context"
import { XMTPProvider } from "@/context/xmtp-context"
import { UserProvider } from "@/context/user-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DarkModeStyles } from "@/components/dark-mode-styles"
import { ToastProvider } from "@/components/ui/toast"
import { Web3Provider } from "@/components/web3-provider"
import ClientRoot from "@/components/client-root"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Pamoja Events",
    template: "%s | Pamoja Events",
  },
  description: "Decentralized event coordination platform on Base",
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  )
}
