import type React from "react"
import { Inter, Outfit, Montserrat } from "next/font/google"
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

// Enhanced font configuration with more weights
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

// Add a new display font for special elements
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata = {
  title: "Pamoja Events",
  description: "Decentralized event coordination platform on Base",
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  )
}
