import Link from "next/link"
import { LogoWithText } from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background dark:border-muted/30 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoWithText />
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left dark:text-muted-foreground/90 tracking-wide">
            Decentralized event coordination platform on Base
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide"
          >
            Privacy
          </Link>
          <Link
            href="https://github.com/pamojaevents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline dark:text-muted-foreground/90 dark:hover:text-white tracking-wide"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
