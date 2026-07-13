"use client";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { buildTrackingContext } from "./analytics";

type BackendEvent = "landing_viewed" | "quest_assigned" | "quest_started" | "quest_completed" | "referral_shared";

function visitorId(): string {
  const key = "questlunch-visitor-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = window.crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export async function recordBackendEvent(
  event: BackendEvent,
  properties: { craving?: string; restaurantId?: string } = {},
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (typeof window === "undefined" || !url) return;

  const attribution = buildTrackingContext(window.location.href);
  const client = new ConvexHttpClient(url);
  await client.mutation(api.activations.record, {
    visitorId: visitorId(),
    event,
    referralCode: attribution.referral_code,
    source: attribution.utm_source || document.referrer || undefined,
    ...properties,
  });
}
