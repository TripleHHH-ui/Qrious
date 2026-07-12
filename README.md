# Qrious

Fog-of-war food discovery for Singapore hawker centres. Sassy AI queue advisor +
Roam Mode + squad missions. Built in phases for a 5-hour hackathon sprint.

## Status: Phase 1 done

- [x] Next.js 14 App Router + TypeScript + Tailwind scaffold
- [x] Supabase auth (email/password signup + login)
- [x] Auto-created `profiles` row on signup (DB trigger)
- [x] Avatar picker (8 emoji presets)
- [x] Add-friend-by-username, send/accept requests
- [x] Full Postgres schema + RLS for all 9 tables (migration ready to run)
- [x] Seed data: 12 real Singapore hawker centres, mixed hot/cold
- [ ] Phase 2 — Mapbox fog-of-war map, geolocation, arrival detection
- [ ] Phase 3 — Sassy AI queue advisor + Roam Mode (OpenAI)
- [ ] Phase 4 — Squad missions + live leaderboard (Supabase Realtime)
- [ ] Phase 5 — Demo polish, PWA icons, mobile pass

## Setup

1. Create a Supabase project at supabase.com, grab the project URL, anon key,
   and service role key from Project Settings → API.
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN` (from mapbox.com — needed starting Phase 2)
   - `OPENAI_API_KEY` (needed starting Phase 3)
3. In the Supabase SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql`.
4. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open **http://localhost:3000** — you'll be redirected to `/signup`.

## Test the Phase 1 loop

1. Go to `/signup`, create an account with a username, email, password.
2. You'll land on `/onboarding/avatar` — pick one of the 8 emoji avatars,
   hit Continue.
3. You'll land on `/` (home) — you should see your avatar + username and a
   "Phase 1 — done" card.
4. Click **Friends** (top right) → search for a second test account's
   username (sign up a second account in an incognito window to test this
   end-to-end) → **Add friend**.
5. Log into the second account → go to `/friends` → you should see the
   incoming request under "Pending requests" → **Accept**.
6. Confirm in Supabase Table Editor: a row exists in `profiles` for each
   user, and a row in `friendships` with `status = 'accepted'`.

## Project structure

```
src/app/(auth)/signup    → signup page
src/app/(auth)/login     → login page
src/app/onboarding/avatar → avatar picker (first login only)
src/app/friends          → friend search + requests
src/lib/supabase         → browser/server/middleware Supabase clients
supabase/migrations      → full schema + RLS (run once in Supabase SQL editor)
supabase/seed.sql        → 12 real hawker centre locations
```

## Deploy

Repo target per the build spec: Railway. This scaffold is a standard Next.js
14 app — `npm run build && npm start`, or connect the repo in Railway/Vercel
and set the same env vars from `.env.local.example` in the project's
environment settings.
