import Link from "next/link"
import { LogoWithText } from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background dark:border-muted/30 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background light-border dark-border-subtle">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column: Logo + tagline + description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <LogoWithText />
            </Link>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/90 tracking-wide light-text-muted dark-text-muted">
              Own your events. Connect your community.
            </p>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/90 tracking-wide light-text-muted dark-text-muted">
              The decentralized event platform built on Base.
            </p>
          </div>

          {/* Middle column: Platform links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Platform
            </h3>
            <Link
              href="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Home
            </Link>
            <Link
              href="/#events"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Explore Events
            </Link>
            <Link
              href="/create"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Create Event
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Dashboard
            </Link>
          </div>

          {/* Right column: Resources links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Resources
            </h3>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Privacy
            </Link>
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide light-text-muted dark-text-muted"
            >
              Built on Base
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-muted/30 pt-6">
          <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground/90 tracking-wide light-text-muted dark-text-muted">
            &copy; 2025 Pamoja Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
