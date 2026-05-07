"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type { ReactNode } from "react";

if (typeof window !== "undefined") {
  const posthogKey =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (posthogKey && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development"
    });
  }
}

export function PHProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
