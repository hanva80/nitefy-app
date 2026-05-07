import { track } from "@vercel/analytics/react";
import posthog from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export function captureEvent(name: string, properties?: AnalyticsProperties) {
  track(name, properties);

  if (posthog.__loaded) {
    posthog.capture(name, properties);
  }
}
