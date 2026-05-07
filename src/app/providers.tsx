"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type { ReactNode } from "react";

export function PHProvider({
  children,
  posthogKey
}: {
  children: ReactNode;
  posthogKey?: string;
}) {
  if (typeof window !== "undefined" && posthogKey && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development"
    });
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
