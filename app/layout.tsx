/**
 * Root layout — metadata, PWA viewport, global shell.
 * Location: app/layout.tsx
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questolin — IT Skills lernen",
  description: "Swipe-Lernkarten für Entwickler-Grundlagen",
  applicationName: "Questolin",
  appleWebApp: {
    capable: true,
    title: "Questolin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d232a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="dark">
      <body className="bg-base-100 text-base-content min-h-screen">{children}</body>
    </html>
  );
}
