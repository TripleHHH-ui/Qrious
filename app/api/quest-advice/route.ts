import { NextResponse } from "next/server";

type PlaceContext = {
  name: string;
  waitMinutes: number;
  distanceKm: number;
  budget: string;
};

type AdviceRequest = {
  mode: "crowded_warning" | "filling_warning" | "recommendation";
  profileName: string;
  craving: string;
  selected: PlaceContext;
  alternatives: PlaceContext[];
};

type Advice = {
  message: string;
  recommendation: string;
  source: "openai" | "fallback";
};

function clean(value: unknown, fallback: string, max = 80): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function parsePlace(value: unknown): PlaceContext | null {
  if (!value || typeof value !== "object") return null;
  const place = value as Record<string, unknown>;
  if (typeof place.name !== "string" || typeof place.waitMinutes !== "number" || typeof place.distanceKm !== "number") return null;
  return {
    name: clean(place.name, "this restaurant"),
    waitMinutes: Math.max(0, Math.min(180, place.waitMinutes)),
    distanceKm: Math.max(0, Math.min(50, place.distanceKm)),
    budget: clean(place.budget, "budget unknown", 30),
  };
}

function fallbackAdvice(input: AdviceRequest): Advice {
  const firstName = clean(input.profileName, "Explorer", 30).split(" ")[0];
  const alternative = input.alternatives[0];
  if (input.mode === "crowded_warning") {
    return {
      message: `${firstName}, a ${input.selected.waitMinutes}-minute queue? Excellent. Apparently your “${input.craving}” craving came with a waiting-room subplot.`,
      recommendation: alternative
        ? `${alternative.name} is ${alternative.distanceKm} km away with an estimated ${alternative.waitMinutes}-minute wait. But sure, let the hungrier people pass you.`
        : "No faster match is visible. Charge your phone; apparently queuing is today’s main course.",
      source: "fallback",
    };
  }
  if (input.mode === "filling_warning") {
    return {
      message: `${firstName}, ${input.selected.waitMinutes} minutes is not a disaster—just enough time to reconsider every decision that led you here.`,
      recommendation: alternative
        ? `${alternative.name} estimates ${alternative.waitMinutes} minutes at ${alternative.distanceKm} km away. Less queue, more chewing. Revolutionary concept.`
        : `${input.selected.name} is filling up. Move now, unless suspense is part of your lunch plan.`,
      source: "fallback",
    };
  }
  return {
    message: `${firstName}, an actually sensible choice. ${input.selected.name} matches ${input.craving} without making queuing your new personality.`,
    recommendation: alternative
      ? `Backup plan: ${alternative.name}, ${alternative.distanceKm} km away with an estimated ${alternative.waitMinutes}-minute wait.`
      : `Estimated spend is ${input.selected.budget}. Proceed before everyone else has the same idea.`,
    source: "fallback",
  };
}

function normalizeRequest(body: unknown): AdviceRequest | null {
  if (!body || typeof body !== "object") return null;
  const value = body as Record<string, unknown>;
  const selected = parsePlace(value.selected);
  if (!selected) return null;
  const alternatives = Array.isArray(value.alternatives) ? value.alternatives.map(parsePlace).filter((place): place is PlaceContext => Boolean(place)).slice(0, 3) : [];
  return {
    mode: value.mode === "crowded_warning" ? "crowded_warning" : value.mode === "filling_warning" ? "filling_warning" : "recommendation",
    profileName: clean(value.profileName, "Lunch Explorer", 40),
    craving: clean(value.craving, "lunch", 30),
    selected,
    alternatives,
  };
}

export async function POST(request: Request) {
  const input = normalizeRequest(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Invalid restaurant context" }, { status: 400 });

  const fallback = fallbackAdvice(input);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json(fallback);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: "You are Munch, Kiasu's sharp, witty Singapore lunch guide. Write concise, personalized advice with confident playful sarcasm. Roast inefficient queue choices and gently tease amber 'filling up' waits, but never insult the user, use profanity, or become cruel. Use only supplied restaurant facts. Never invent live data, discounts, ratings, hours, or dietary claims. The message must be under 28 words and the recommendation under 32 words.",
        input: JSON.stringify(input),
        max_output_tokens: 140,
        text: {
          format: {
            type: "json_schema",
            name: "quest_advice",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                message: { type: "string" },
                recommendation: { type: "string" },
              },
              required: ["message", "recommendation"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return NextResponse.json(fallback);
    const data = await response.json() as { output_text?: string };
    const parsed = JSON.parse(data.output_text || "{}") as Partial<Advice>;
    if (!parsed.message || !parsed.recommendation) return NextResponse.json(fallback);
    return NextResponse.json({ message: clean(parsed.message, fallback.message, 240), recommendation: clean(parsed.recommendation, fallback.recommendation, 280), source: "openai" } satisfies Advice);
  } catch {
    return NextResponse.json(fallback);
  }
}
