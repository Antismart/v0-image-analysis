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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-muted/30 dark:bg-background/80 light-shadow dark-shadow navbar">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <LogoWithText />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`nav-link tracking-wide text-sm lg:text-base ${
                pathname === route.path
                  ? "text-pamoja-500 font-medium dark:text-pamoja-400"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-white"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
          <WalletConnect />

          {/* Mobile Menu Button */}
          <button
            className="block p-2 -mr-1 md:hidden touch-target"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border light-shadow dark-shadow">
          <nav className="flex flex-col space-y-1 py-3">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`nav-link tracking-wide px-3 py-3 rounded-md touch-target ${
                  pathname === route.path
                    ? "text-pamoja-500 font-medium dark:text-pamoja-400 bg-pamoja-50 dark:bg-pamoja-950 light-shadow-interactive dark-shadow-interactive"
                    : "text-muted-foreground dark:text-muted-foreground/90 hover:bg-muted hover:text-foreground light-card-hover dark-card-hover"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </Link>
            ))}
            <div className="pt-2 px-3">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
