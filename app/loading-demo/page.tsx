import { LoadingExamples } from "@/components/loading-examples"

export default function LoadingDemoPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Pamoja Events Loading States</h1>
        <LoadingExamples />
      </div>
    </section>
  )
}
