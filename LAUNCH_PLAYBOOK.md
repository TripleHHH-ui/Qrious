# QuestLunch — 2-Hour Virality Sprint

## Score target

Optimize the weighted parameters, not vanity reach.

| Metric | Minimum useful target | Stretch target | Why |
|---|---:|---:|---|
| Weighted impressions | 1,000 | 2,500 | L3 reach, but only 1× |
| Reactions + comments | 11 | 26 | L3/L4 at 2× |
| Amplifiers | 3 builders or 1 operator | 1 notable reshare | Identity beats volume at 3× |
| Unique visitors | 51 | 251 | L3/L4 at 10× |
| Unique `quest_assigned` users | 26 | 101 | L3/L4 at 25× |

Anti-spoof guardrails:
- Keep visitors at or below 10% of weighted impressions unless a direct/community source is provable.
- Keep unique `quest_assigned` users at or below 50% of unique visitors.
- A healthy stretch funnel is 2,500 impressions → 150 visitors → 50 assigned quests.
- First checkpoint is 600 impressions → 30 visitors → 12 assigned quests.

## Definition of the meaningful action

`quest_assigned` is the first-use event. It fires only after a person chooses a craving and receives a matched restaurant/route. It is more defensible than a page view and requires only two taps.

In PostHog, judge using **unique users**, not total event volume. Keep `quest_started`, `quest_completed`, `profile_saved`, `referral_shared`, and `coupon_copied` as supporting depth metrics.

## Clock

### T-120 to T-100: instrumentation and launch readiness

1. Approve Vercel CLI login and deploy production.
2. Create a PostHog project.
3. Add Vercel environment variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com` (or the EU host shown by PostHog)
4. Redeploy.
5. Open the production URL in a private window and complete one craving selection.
6. Confirm `$pageview`, `landing_viewed`, `craving_selected`, and `quest_assigned` appear in PostHog.
7. Create a read-only PostHog project invite for judges.
8. Exclude the team’s own test users/IP activity when presenting numbers.

### T-100 to T-85: record the asset

Record one vertical 25–30 second screen capture:

1. Cold-open map and mascot (3 seconds).
2. Tap a craving (4 seconds).
3. Pin drop and queue status (5 seconds).
4. Trigger Roam Mode and reveal hidden-gem alternatives (6 seconds).
5. Show coupon and check-in reward (6 seconds).
6. End on the share card and Crew Boost referral tiers (5 seconds).

Use captions. Most viewers will watch muted. Put the product URL on the final frame.

### T-85: publish the anchor post

#### X launch post

> Lunch discovery apps make you search harder. We made lunch choose you.
>
> Pick a craving → get a live restaurant quest → if the queue is bad, the route branches to a faster hidden gem.
>
> Complete it, earn a streak, unlock a real offer, challenge a friend.
>
> Try the 30-second quest: [URL]
>
> Reply with the restaurant it gave you 👇

Attach the vertical demo. Put the link in the main post unless reach drops sharply on the account; otherwise put it in the first reply and say “link below.”

#### Follow-up thread replies

1. “The interesting growth loop: a friend does not just receive a one-off credit. Each completed crew link permanently boosts future quest points at 1 / 3 / 6 friends — inspired by HeyMax’s tiered earning-rate referrals.”
2. “The acquisition wedge is hidden gems: restaurants only surface offers when a quest can send real foot traffic. Queue data and merchant offers are mocked behind swappable interfaces in this MVP.”
3. “Built web-first so every shared quest opens instantly. No app-store dead end.”
4. “We need 20 people to test the assignment loop. Pick a craving and reply with your result: [URL with `utm_source=x&utm_medium=social&utm_campaign=launch`]”

### T-80: LinkedIn mirror

> We built a lunch app that refuses to give you a search bar.
>
> QuestLunch turns the daily “where should we eat?” loop into a 30-second game:
> 🌶️ choose a craving
> 🗺️ receive a live restaurant quest
> 🚦 see the queue before you commit
> 🧭 branch into Roam Mode when it is busy
> 💎 discover a quieter local restaurant
> 🎟️ use an active offer
> ⚡ invite friends to increase both users’ future earning rate
>
> The product decision I care about most: the first useful result appears before signup. Shared links open directly into the craving challenge, and the meaningful activation event is a real quest assignment—not an email capture.
>
> Try it and comment with the restaurant you received: [URL with `utm_source=linkedin&utm_medium=social&utm_campaign=launch`]

Attach the same demo natively. Do not merely link the X post.

### T-75 to T-55: targeted amplification

Do not mass-DM. Send 12–15 relevant, personalized messages:

- 4 local food/restaurant operators
- 4 indie hackers or hackathon builders
- 3 consumer/social product founders
- 2 loyalty/referral product people
- 2 city/local-community curators

DM template:

> Built a 30-second lunch quest that reroutes people from long queues toward hidden gems. The referral loop increases both users’ future earning rate instead of paying a disposable signup bonus. Your work on [specific thing] made me think you’d have a sharp take. Would you try one quest? If the loop lands, a reshare would help us test whether it escapes our network: [URL]

For a 10k+ operator, ask for feedback first, not “please retweet.” Give them a quotable angle: **“Search is the wrong interface for a decision people want removed.”**

Post to no more than three highly relevant communities. Rewrite the opening line for each community and disclose that it is a hackathon build. Community/direct traffic must be visible in PostHog attribution if it pushes CTR above the social 10% ceiling.

### T-55 to T-25: work the comments

- Reply to every substantive comment within five minutes.
- Ask a concrete follow-up: “Which craving did you pick?” or “Would queue status or the coupon change your choice more?”
- Turn good feedback into visible mini-discussions.
- Ask testers to post a screenshot of their assigned quest; user-generated output is stronger evidence than a like.
- Publish one progress reply when the first 10 unique quests are assigned.
- If one hook outperforms, repost a shorter variant around its exact angle rather than inventing a new story.

Progress update:

> 10 strangers have already let QuestLunch choose their lunch. Current winner: 🌶️ spicy.
>
> The surprising behavior: people use Roam Mode even before seeing a red queue because they want the hidden-gem reveal.
>
> Try yours: [URL]

### T-25 to judging: evidence, not more features

Open these tabs in advance:

1. X native post analytics.
2. LinkedIn native post analytics.
3. Live repost/quote lists and notable profiles.
4. PostHog dashboard with read-only access.
5. PostHog unique users for `$pageview`.
6. PostHog unique users for `quest_assigned`.
7. PostHog referrer/UTM breakdown.
8. PostHog event timeline showing timestamps after each launch post.
9. Production app in a clean private window.
10. Sponsor dashboards for integrations that genuinely ran.

Record the counts and URLs in one note. Never count teammates, repeated local tests, total events instead of unique users, or unverified sponsor snippets.

## PostHog dashboard

Create four insights:

1. **Visitors:** unique users performing `$pageview`, today.
2. **Meaningful actions:** unique users performing `quest_assigned`, today.
3. **Activation funnel:** `$pageview` → `craving_selected` → `quest_assigned` → `quest_started` → `quest_completed`.
4. **Acquisition:** unique `$pageview` users broken down by `utm_source` and referrer.

Also create a table of `quest_assigned` broken down by `craving` and `referral_visitor`. This makes the event easy for mentors to audit.

## Sponsor power-ups

### Wispr Flow (+25, fastest)

Use Wispr Flow to dictate at least 500 words during the event: the LinkedIn post, thread replies, personalized outreach, comment replies, and demo narration. Verify the final word count in Wispr stats and save a screenshot. Typed words do not count.

### Convex (+25, highest engineering value)

Only claim this after Convex stores live activation/referral records and the production app reads or writes them. Show both repo code and the Convex dashboard. This is blocked until Convex authentication/project creation is completed.

### Cloudflare (+25)

Only claim it if a Cloudflare product does real work. Hosting the production app on Workers qualifies; a Worker that validates and redirects referral links also qualifies. A dead account or unused DNS record does not.

### ElevenLabs (+25)

Only add if an API key is ready. The acceptable feature is “Hear my quest”: generated audio must speak the assigned restaurant, queue, walk time, active coupon, and Roam alternatives. Decorative prerecorded audio is too weak.

### Linkup (+25)

Only add if a key is ready and a live query reliably enriches quests with current local context. Do not replace the stable seeded dataset during the launch window.

### Dodo Payments

Skip. A live checkout conflicts with the no-monetization v1 and adds conversion risk.
