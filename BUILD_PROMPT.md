# QuestLunch — Build Prompt

Paste this as your opening instruction in `hermes chat` (run from this folder so AGENTS.md context auto-loads). Re-paste or reference this each time you ask Hermes to add a screen or feature.

---

You are helping me build **QuestLunch** (working name, can change) — a gamified lunch-discovery web app. Read this full brief before writing code. Before you start generating, ask me about anything ambiguous below rather than assuming — especially tech stack and data sources.

## The idea
Picking lunch becomes a quest: the app puts the user on a live map heading toward a craving-matched restaurant. If that restaurant has a long queue, the app branches into "Roam Mode" — 2–3 nearby alternatives matching the same craving, weighted toward restaurants that need more foot traffic. Completing a quest (checking in) pays out points, streaks, and badges.

## Priority: virality over monetization
This is the design constraint for every decision. No ad-based monetization, no paywalls in v1. Every feature should be evaluated on "does this make someone share, invite, or come back" — not on revenue.

## Core loop
1. **Craving input** — swipeable cards (spicy / comfort / healthy / surprise me), not a search bar.
2. **Quest assignment** — map animates a pin drop toward a matched restaurant.
3. **Live queue read** — colored dot on the pin (green/amber/red) showing wait status.
4. **Roam branch** — if amber/red, immediately offer 2–3 alternate pins with a "why this" tag (faster / hidden gem / bonus points).
5. **Check-in** — geofence (native) or manual "I'm here" / photo (web).
6. **Payoff** — points, streak flame, badge unlock, and an auto-generated shareable card (sized for Instagram/WhatsApp stories).

## MVP scope — build this first, web-first
- Onboarding: cold-open animated map → craving picker → an actual first quest assigned *before* signup (guest mode) → signup wall only appears after that first quest completes ("save your streak").
- Home: streak + points chip, one big "Start Today's Quest" CTA, horizontal nearby-quest cards with live queue dots, 4-tab nav (Map / Quests / Rewards / Profile).
- Map screen: full-screen map, color-coded pins, bottom sheet on tap (photo, craving-match %, queue status, Go/Roam CTA), animated Roam branching.
- Filters: craving type, distance, queue status, price, dietary, "Hidden Gems only" toggle, "Quest bonus available" toggle — applied live, no full reload.
- Rewards/profile: badge shelf, streak history, referral code with one-tap share, friend leaderboard.

## Build the referral/growth loop first, not last
- Double-sided referral (both inviter and invitee get a "Quest Pass" credit).
- Auto-generated shareable card after every completed quest.
- Friend leaderboard on streaks/discoveries.
- "Hidden Gem Hunter" badge for checking into low-traffic restaurants (this is also the growth lever for getting less-trafficked restaurants foot traffic).
- Streak flame with a one-time streak-freeze.

## Data I don't have yet — propose an approach, flag as mock vs. real
- **Live queue/wait-time data**: no confirmed source. Propose either crowd-sourced self-reporting by users, an external API (e.g. Google Places "popular times" style data), or a simple mocked/manual value for the MVP — make it swappable later.
- **Restaurant location/listing data**: propose Google Places API, OpenStreetMap, or a small seeded dataset for MVP.
- **Shareable card generation**: needs dynamic image generation (e.g. an OG-image style renderer).

## Style direction
Playful, saturated color-blocking (Duolingo/BeReal energy) in food-warm tones — terracotta, mango, matcha — not generic app blue. Rounded bold display font for headlines, clean sans for body. Small mascot character for onboarding/empty states. Motion carries the "wow" factor: pin drop-and-bounce, confetti/points burst on check-in, animated route line for Roam Mode. This should feel like a game, not a utility app — the onboarding especially needs a real wow moment in the first 10 seconds, not a feature-bullet carousel.

## Explicit asks
1. Propose a tech stack suited to a fast, shareable, web-first MVP (needs to work as a link that opens instantly, no install friction — that's the growth mechanism).
2. Scaffold the full loop end to end (even with mocked queue data) before polishing any single screen.
3. Build the share-card + referral flow as a core feature, not an add-on.
4. Ask me before making structural decisions on auth, database, and hosting.

## Out of scope for v1
Native app, AR/camera features, restaurant payments, ads, monetization of any kind.
