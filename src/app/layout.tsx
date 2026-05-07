import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { PHProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NITEFY",
  description: "Don't guess the night. NITEFY it."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const posthogKey =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;

  return (
    <html lang="en">
      <body>
        <PHProvider posthogKey={posthogKey}>
          {children}
        </PHProvider>
        <Analytics />
      </body>
    </html>
  );
}
