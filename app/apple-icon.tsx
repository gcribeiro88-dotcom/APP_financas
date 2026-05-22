import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #1e40af, #1d4ed8)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 60,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          R$
        </div>
        <div
          style={{
            color: "#93c5fd",
            fontSize: 20,
            fontWeight: 600,
            fontFamily: "sans-serif",
            marginTop: 6,
            letterSpacing: "1px",
          }}
        >
          FINANÇAS
        </div>
      </div>
    ),
    { ...size }
  )
}
