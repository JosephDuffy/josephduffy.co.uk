import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Joseph Duffy",
    short_name: "Joseph Duffy",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    start_url: "/",
    background_color: "black",
    display: "minimal-ui",
    scope: "/",
    theme_color: "#ffcc00",
  }
}
