import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Gossip — Solana Intelligence",
  description: "Editorial-style Solana intelligence feed prototype.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import AppWalletProvider from "./components/AppWalletProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppWalletProvider>
          <div className="app-shell">
            <div className="phone-frame">{children}</div>
          </div>
        </AppWalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
