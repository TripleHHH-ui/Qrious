import type { Metadata, Viewport } from "next";
import PostHogProvider from "@/components/posthog-provider";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuestLunch — Turn lunch into an adventure",
  description: "Pick a craving. Get a quest. Discover somewhere worth sharing.",
  openGraph: {
    title: "I found my next lunch quest 🌶️",
    description: "Join my QuestLunch adventure and we both get a Quest Pass.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fff7ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PostHogProvider>{children}</PostHogProvider></body>
    </html>
  );
}
