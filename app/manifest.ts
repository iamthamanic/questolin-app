/**
 * Web app manifest for installable PWA (Questolin).
 * Location: app/manifest.ts — served at /manifest.webmanifest
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Questolin — IT Skills lernen",
    short_name: "Questolin",
    description: "Swipe-Lernkarten für Entwickler-Grundlagen",
    start_url: "/",
    display: "standalone",
    background_color: "#1d232a",
    theme_color: "#1d232a",
    lang: "de",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
