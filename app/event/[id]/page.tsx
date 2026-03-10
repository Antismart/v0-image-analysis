import { Suspense } from "react"
import { EventDetails } from "@/components/event-details"
import { ChatWindow } from "@/components/chat-window"
import { TokenGate } from "@/components/token-gate"
import { Skeleton } from "@/components/ui/skeleton"

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <TokenGate eventId={id}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EventDetails id={id} />
            </div>
            <div className="lg:col-span-1">
              <ChatWindow eventId={id} />
            </div>
          </div>
        </TokenGate>
      </Suspense>
    </div>
  )
}
