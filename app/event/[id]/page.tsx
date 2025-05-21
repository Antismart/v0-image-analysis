import { Suspense } from "react"
import { EventDetails } from "@/components/event-details"
import { ChatWindow } from "@/components/chat-window"
import { TokenGate } from "@/components/token-gate"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <TokenGate eventId={params.id}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EventDetails id={params.id} />
            </div>
            <div className="lg:col-span-1">
              <ChatWindow eventId={params.id} />
            </div>
          </div>
        </TokenGate>
      </Suspense>
    </div>
  )
}
