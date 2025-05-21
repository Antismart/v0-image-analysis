"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { ModeToggle } from "@/components/mode-toggle"
import { LogoWithText } from "@/components/logo"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { name: "Home", path: "/" },
    { name: "Create Event", path: "/create" },
    { name: "Profile", path: "/profile" },
    { name: "Dashboard", path: "/dashboard" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-muted/30 dark:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <LogoWithText />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`nav-link tracking-wide ${
                pathname === route.path
                  ? "text-pamoja-500 font-medium dark:text-pamoja-400"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-white"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <WalletConnect />

          {/* Mobile Menu Button */}
          <button
            className="block p-2 -mr-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <nav className="flex flex-col space-y-4 pb-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`nav-link tracking-wide ${
                  pathname === route.path
                    ? "text-pamoja-500 font-medium dark:text-pamoja-400"
                    : "text-muted-foreground dark:text-muted-foreground/90"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
