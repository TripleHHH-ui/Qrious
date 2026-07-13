"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";
import { buildTrackingContext } from "@/lib/analytics";
import { recordBackendEvent } from "@/lib/backend-events";

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void recordBackendEvent("landing_viewed");
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    posthog.capture("$pageview", buildTrackingContext(window.location.href));
    posthog.capture("landing_viewed", buildTrackingContext(window.location.href));
  }, []);

  return children;
}
