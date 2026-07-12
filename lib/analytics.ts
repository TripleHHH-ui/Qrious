import posthog from "posthog-js";

export type QuestEvent =
  | "landing_viewed"
  | "referral_opened"
  | "craving_selected"
  | "quest_assigned"
  | "quest_started"
  | "quest_completed"
  | "profile_saved"
  | "referral_shared"
  | "coupon_copied";

export function buildTrackingContext(url: string): Record<string, string> {
  const params = new URL(url).searchParams;
  const fields = {
    referral_code: params.get("ref"),
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };

  return Object.fromEntries(Object.entries(fields).filter((entry): entry is [string, string] => Boolean(entry[1])));
}

export function track(event: QuestEvent, properties: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, { ...buildTrackingContext(window.location.href), ...properties });
}
