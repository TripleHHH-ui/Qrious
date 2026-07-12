import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qrious",
  description: "Fog-of-war food discovery for Singapore hawker centres.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
