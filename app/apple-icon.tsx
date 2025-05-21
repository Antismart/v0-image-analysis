import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 24,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "40px",
      }}
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "80%", height: "80%" }}>
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
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
