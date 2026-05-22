import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinançasPessoais",
    short_name: "Finanças",
    description: "Controle suas finanças pessoais de forma simples e visual",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f172a",
    theme_color: "#1e40af",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
