import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Pamoja Events - Connect, Coordinate, Create"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom right, #fff7ed, #ffedd5)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 120, height: 120, marginRight: 24 }}
        >
          {/* Main circle representing community/togetherness */}
          <circle cx="20" cy="20" r="18" stroke="#f97316" strokeWidth="2.5" />

          {/* Three connected elements representing people/events coming together */}
          <circle cx="15" cy="15" r="5" fill="#10b981" />
          <circle cx="25" cy="15" r="5" fill="#f97316" />
          <circle cx="20" cy="25" r="5" fill="#fb923c" />

          {/* Connection lines */}
          <line x1="15" y1="15" x2="25" y2="15" stroke="white" strokeWidth="1.5" />
          <line x1="15" y1="15" x2="20" y2="25" stroke="white" strokeWidth="1.5" />
          <line x1="25" y1="15" x2="20" y2="25" stroke="white" strokeWidth="1.5" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f97316", fontWeight: "bold", fontSize: 72 }}>Pamoja Events</span>
        </div>
      </div>
      <div style={{ fontSize: 36, color: "#78716c", textAlign: "center", marginTop: 24 }}>
        Connect, Coordinate, Create - Decentralized event coordination platform on Base
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
