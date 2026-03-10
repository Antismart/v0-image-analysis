"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong</h2>
            <button onClick={reset} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #ccc', cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
