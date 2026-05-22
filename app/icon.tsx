import { ImageResponse } from "next/og"

export const size = { width: 192, height: 192 }
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius: "42px",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 64,
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
            fontSize: 22,
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
