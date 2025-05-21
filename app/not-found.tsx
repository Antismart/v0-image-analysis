import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NotFoundIllustration } from "@/components/illustrations"

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-8 sm:py-16">
      <NotFoundIllustration className="mb-6 sm:mb-8 max-w-[200px] sm:max-w-[300px]" />
      <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-center">Page Not Found</h1>
      <p className="mb-6 sm:mb-8 text-center text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Go Home</Button>
        </Link>
        <Link href="/#events" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Discover Events
          </Button>
        </Link>
      </div>
    </div>
  )
}
