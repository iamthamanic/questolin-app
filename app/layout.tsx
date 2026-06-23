import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questolin — IT Skills lernen",
  description: "Swipe-Lernkarten für Entwickler-Grundlagen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="dark">
      <body className="bg-base-100 text-base-content min-h-screen">
        {children}
      </body>
    </html>
  );
}
