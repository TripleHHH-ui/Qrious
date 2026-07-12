# Kiasu / QuestLunch MVP

A web-first, gamified lunch-discovery app for Singapore. Pick a craving, receive a restaurant quest on a live map, branch into Roam Mode when queues are long, and complete quests for points, streaks, share cards, and Crew Boost referral multipliers.

## Live demo

https://hackathon-green-five.vercel.app

## Included

- Animated guest-first onboarding and craving picker
- Real Singapore CBD venue names and OpenStreetMap/Nominatim coordinates
- Leaflet/OpenStreetMap quest map
- Mock queue data behind a swappable `QueueSource`
- Roam Mode weighted toward fast and under-trafficked alternatives
- Active/expired coupon model with clearly labeled demo offers
- Manual web check-in, points, streaks, badges, and generated story cards
- HeyMax-inspired 1/3/6 Crew Boost referral tiers
- Convex production activation ledger and summary query
- Optional PostHog funnel instrumentation with UTM/referral attribution

Queue readings, offers, match percentages, and rewards are demo data. Restaurant names and coordinates are sourced from OpenStreetMap/Nominatim.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Environment variables:

```text
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Convex development:

```bash
npx convex dev
```

## Verification

```bash
npm run test
npm run lint
npm run build
```

## Architecture

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS + Framer Motion
- Leaflet + OpenStreetMap
- Zustand persisted guest state
- Convex activation/referral event backend
- PostHog analytics adapter
- Next `ImageResponse` story-card generation

## Product constraints

Virality comes before monetization. The MVP has no ads, payments, or paywalls. Native geofencing, live merchant feeds, verified coupons, and production authentication are intentionally deferred until their providers are configured.
