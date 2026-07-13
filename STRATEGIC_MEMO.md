# QuestLunch / Kiasu: Retention and Virality Memo

## Executive conclusion

QuestLunch should not sell “gamified restaurant discovery.” Lunch is too frequent, time-boxed, and practical for points alone to carry retention. The real wedge is **fast, trustworthy group lunch coordination under time and queue uncertainty**. The defensible asset is not the quest skin; it is a dense, hyperlocal graph of current queues, office-cluster preferences, constraints, and completed group decisions.

Today’s product is an attractive hackathon demo, but not yet a meaningful daily loop. With six static venues, simulated queue estimates, manual check-in, and points with no real utility, it provides novelty once and asks for habit before earning trust. Build the useful “where can we actually eat now?” loop first; let quests, streaks, and badges make that utility more fun.

## 1. Primary job-to-be-done

> **When my coworkers and I are about to break for lunch, help us agree quickly on a nearby place that fits the group and is unlikely to waste our limited time in a queue, so we can stop debating and get back on time.**

This is narrower and stronger than “discover food.” It reflects the Singapore office-lunch constraints the product must design around: dense choices, hawker and food-court queues, walk time, heat or rain, seating uncertainty, budget, and mixed dietary/halal needs. These are hypotheses to validate office cluster by office cluster, not claims of measured prevalence.

The emotional job is relief from repetitive indecision; the social job is making a fair choice without one colleague becoming the permanent lunch planner.

## 2. Strongest one-sentence positioning

> **Kiasu is the fastest way for a Singapore office crew to agree on a good, walkable lunch with a short queue—using fresh reports from people nearby.**

Use **Kiasu** as the distinctive local brand and “your live crew lunch picker” as the descriptor. “QuestLunch” explains the game but overweights novelty. This positioning is defensible only after the reports are real, timestamped, and dense within a small launch area.

### Competitive frame

- **Google Maps:** stronger for exhaustive search, reviews, directions, and general busyness. Kiasu can win only by compressing a lunch-specific group decision into seconds and offering fresher, stall-level queue/seating context.
- **TikTok/Instagram:** strong inspiration and appetite creation, but content is not reliably “near us, suitable for all of us, open, and quick right now.” Kiasu converts inspiration into an executable decision.
- **Beli:** strong restaurant memory, ranking, and friend taste. Kiasu should own the immediate weekday decision, not become another restaurant diary.
- **Coworkers deciding manually:** already has trust and zero setup. Kiasu must beat it on speed and fairness with one no-signup link, not add another app ritual.
- **Delivery apps:** win when leaving is undesirable. Kiasu wins when the goal is an in-person break, team time, and local exploration; it should not pretend to replace delivery.

## 3. Top five reasons to open, return, and share

| Core reason | Why open now | Why return | Why share |
|---|---|---|---|
| **1. End the group debate** | One tap creates 3 viable options for this crew and time | Saved crew constraints make tomorrow faster | Sharing the decision-room link is the action that gets lunch chosen |
| **2. Avoid a bad queue gamble** | Fresh queue/seating reports reduce wasted walking and waiting | Time-sensitive data has new value every lunch period | A teammate needs the same live route and fallback |
| **3. Find a credible nearby alternative** | “Usual place is packed” triggers a fast fallback | The app learns visited places and rotates genuinely new nearby stalls | A specific discovery is useful social currency in office chats |
| **4. Make group choice fair** | Each person adds one veto/preference; Kiasu resolves the overlap | Stored halal/dietary, budget, walk, and weather tolerance remove repeated negotiation | Colleagues must join to vote or veto; virality is native, not bolted on |
| **5. Improve the local signal** | A 2-second “queue / seats / sold out” report unlocks better alternatives | Contributors receive fresher confidence and visible local reputation | Reports help the crew immediately and make the contributor look useful |

The strongest viral hook is **a WhatsApp/Telegram-ready crew decision room**, not a share card. The second is **useful live evidence** (“8 min queue, reported 4 min ago”), not a points boast. Share cards can amplify identity after value is delivered, but should show an interesting, verifiable outcome: “Our crew escaped a 20-minute queue,” “3 new Amoy stalls this week,” or a crew lunch passport.

## 4. Biggest credibility and retention objections

1. **“The queue is made up.”** Queue status is the central promise, so demo data damages the whole proposition. Every estimate needs source, age, confidence, and an explicit “not enough recent reports” state.
2. **“Why not just use Maps or ask the group chat?”** Four craving moods and a map do not beat familiar tools. The product needs group constraints, current lunch conditions, and a one-link decision.
3. **“Points buy nothing.”** Multiplying valueless points is not a referral incentive. “Mystery reward” creates expectation without trust. Do not imply coupons or rewards until verified.
4. **“I can fake a check-in.”** “I’m here” grants points without proof, undermining leaderboards, referrals, and queue data. A lightweight location/time check plus optional receipt/photo/report is more credible.
5. **“The list is too shallow or wrong.”** Six venues, venue-level records for hawker centres, static distances, and potentially stale hours cannot support repeat use. Lunch utility requires stall-level coverage and current hours near the user’s actual office.
6. **“It picked something unsuitable.”** Craving is weaker than budget, dietary/halal needs, travel time, opening hours, weather exposure, and group size. One bad group match can destroy trust.
7. **“This is work disguised as a game.”** Manual check-in and sharing are friction unless the recommendation already saved time. Contribution must take seconds and improve the current crew’s outcome.
8. **Cold-start paradox:** live reports are valuable only where report density exists. Launching across Singapore would make the signal sparse and unreliable.

## 5. Product changes ranked by impact and effort

| Rank | Change | Impact | Effort | What to ship |
|---:|---|---|---|---|
| 1 | **Crew decision room** | Very high | Medium | One link opens without signup; members set one-tap vetoes; app returns 3 overlapping options; vote closes in 60 seconds; chosen route and fallback go to everyone. |
| 2 | **Truthful live-signal layer** | Very high | Medium technically; high operationally | “Reported X min ago by Y nearby diners,” confidence, queue/seats/sold-out chips, expiry, and “unknown” instead of fabricated precision. Seed one micro-area during lunch. |
| 3 | **Lunch constraints before craving** | High | Low–medium | Office/current location, available minutes, max walk, budget, halal/dietary, group size, and rain/covered-route preference. Keep craving as optional flavor. |
| 4 | **Dense stall-level inventory in one cluster** | Very high | High | Pick one office/hawker cluster, verify opening hours and stall identity, and make that area excellent before expanding. Add exact origin-based walk times. |
| 5 | **Report-to-unlock reciprocity loop** | High | Medium | After arrival, ask “queue?”, “seats?”, “sold out?” in two taps. A fresh report unlocks equally fresh alternatives or a crew reroll—not abstract points. |
| 6 | **Replace referral multiplier with completed crew utility** | High | Medium | Count a referral only after the new user joins or completes a real crew lunch/report. Give both sides a useful benefit: extra daily reroll, early queue alerts, or saved crew—not 1.25× fictional currency. |
| 7 | **Explain every recommendation** | Medium–high | Low | “Fits all 4: halal, under $15, 7-min covered walk, queue seen 5 min ago.” Show two fallbacks before the group commits. |
| 8 | **History that improves tomorrow** | Medium | Medium | Remember crew constraints, hide recent repeats, learn accepted/rejected places, and build a lightweight office lunch rotation. This is more useful than a generic badge shelf. |
| 9 | **Credible check-in and social proof** | Medium | Medium | Location/time-bound arrival, then attach report. Generate a crew result card with place, actual wait, contributors, and discovery—not just points. |
| 10 | **Midday re-engagement and PWA affordances** | Medium | Medium | Opt-in alert only when useful: “3 good options under 10 min near Raffles Place; one queue just cleared.” Deep-link directly into the saved crew room. |
| 11 | **Remove or quarantine fake economy** | Medium | Low | Clearly label demos, remove unverified coupons from the main path, and pause “mystery rewards” until rewards exist. Keep cosmetic badges secondary. |

### Recommended launch wedge

Start with one dense office-to-food cluster and one repeated crew use case, for example a specific CBD office community choosing among nearby stalls. Recruit queue reporters during the same lunch window so “fresh” means something. Optimize for **crew rooms that reach a chosen restaurant and receive a post-arrival report**, not craving taps or total point events.

## 6. Launch hooks and copy

### Primary landing copy

**Headline:** `Six coworkers. One lunch hour. Zero “anything lah?”`

**Subhead:** `Kiasu finds three nearby places that fit the crew—and shows which queue is actually moving.`

**CTA:** `Start a crew lunch →`

**Trust line:** `Fresh reports show who checked, when, and how confident the estimate is.`

### Referral / group-chat message

`Lunch? Add your one veto—budget, halal/dietary, walking time—then Kiasu will pick our best 3. No signup: [link]`

This is stronger than “help me earn more points” because the receiver gets immediate utility and the invite has a natural reason to exist.

### Queue-report loop

`You’re at Amoy. Two taps help the next crew: queue under 5 / 5–15 / 15+? Seats easy / tight?`

`Report sent. Your crew unlocked 2 fresh fallbacks for tomorrow.`

### Social/creator hooks

- `We gave 6 coworkers 60 seconds to agree on lunch.`
- `The anti-“anything lah?” lunch picker.`
- `Google tells you what is nearby. Kiasu tells your crew where you can eat now.`
- `This queue was 18 minutes. The stall around the corner was 4.`
- `Can one office map every lunch queue around Amoy in a week?`
- `Stop sharing “hidden gems” after they go viral. Share whether the queue is moving.`

### Post-completion share card

Prefer: `Crew of 5 • agreed in 43 sec • 7-min walk • queue reported 4 min ago • new stall for 3 of us`

Avoid leading with: `+150 points • 1.25× boost`. It has no meaning outside the app.

## 7. Blunt verdict on the current daily loop

**No: the current loop is not yet meaningful enough for daily retention.** It is a polished one-time “spin the lunch wheel” experience. The first recommendation is entertaining, but the app currently cannot make a trustworthy claim about live queues, group suitability, arrival, offers, or rewards. Static content exhausts quickly. Manual completion and self-referential points make progress easy but hollow. Crew Boost asks users to recruit friends to accelerate an economy whose value has not been established.

The loop becomes meaningful when it is reordered:

1. **Need:** crew needs lunch now.
2. **Utility:** one link resolves real constraints into three credible choices.
3. **Trust:** each option has fresh, transparent queue/seating evidence and a fallback.
4. **Outcome:** crew chooses, navigates, and reports what actually happened.
5. **Compounding value:** that report improves the next crew’s decision and the app learns this crew’s pattern.
6. **Game layer:** quests, streaks, passports, and status celebrate useful behavior rather than substitute for it.

If only one feature can be built next, build the **no-signup crew room with a useful result and shareable link**. If two can be built, add **timestamped crowd queue/seating reports in one dense launch cluster**. Together they create both the real user value and the only credible viral loop.

## Evidence basis and caveat

This memo uses the current repository and live flow, plus public product descriptions: Google documents its Popular Times/live busyness capability, and Beli positions itself around tracking, ranking, maps, and friend discovery. No market-size, adoption, or behavioral percentages are asserted. Singapore lunch patterns above should be treated as product hypotheses and tested with short intercepts and crew-room funnel data in the chosen launch cluster.
