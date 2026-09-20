import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sahyak CRM — Real Estate Sales Platform",
    short_name: "Sahyak",
    description: "The serious CRM built for real estate sales teams, brokers, and builders.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#0F172A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
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
  };
}
