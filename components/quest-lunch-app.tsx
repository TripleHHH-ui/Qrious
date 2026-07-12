"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { track } from "@/lib/analytics";
import { recordBackendEvent } from "@/lib/backend-events";
import { DEFAULT_MAP_RADIUS_KM, MAP_RADIUS_OPTIONS } from "@/lib/map-experience";
import { applyFilters, DAILY_QUEST_BONUS, getActiveCoupon, getCrewBoost, rankRestaurants } from "@/lib/quest";
import { restaurants } from "@/lib/restaurants";
import type { Craving, Dietary, QueueStatus, Restaurant, RestaurantFilters } from "@/lib/types";
import { useGameStore } from "@/store/use-game";

const QuestMap = dynamic(() => import("./quest-map"), { ssr: false });

type Tab = "map" | "quests" | "rewards" | "profile";
type OnboardingStep = "intro" | "craving" | "assigned";

const cravings: { id: Craving; emoji: string; label: string; line: string; color: string }[] = [
  { id: "spicy", emoji: "🌶️", label: "Spicy", line: "Bring the heat", color: "terracotta" },
  { id: "comfort", emoji: "🍜", label: "Comfort", line: "A warm food hug", color: "mango" },
  { id: "healthy", emoji: "🥗", label: "Healthy", line: "Fresh, not boring", color: "matcha" },
  { id: "surprise", emoji: "🎲", label: "Surprise me", line: "Trust the quest", color: "ink" },
];

const queueCopy: Record<QueueStatus, { label: string; detail: string }> = {
  green: { label: "Walk right in", detail: "about 0–7 min" },
  amber: { label: "A little busy", detail: "about 8–15 min" },
  red: { label: "Quest detour?", detail: "16+ min wait" },
};

const budgetCopy: Record<Restaurant["price"], string> = {
  1: "S$5–12",
  2: "S$12–25",
  3: "S$25+",
};

const badgeInfo = [
  { id: "first-bite", emoji: "🥄", name: "First Bite", hint: "Complete a quest" },
  { id: "hidden-gem-hunter", emoji: "💎", name: "Hidden Gem Hunter", hint: "Back a quiet local" },
  { id: "roam-ranger", emoji: "🧭", name: "Roam Ranger", hint: "Take a detour" },
  { id: "streak-three", emoji: "🔥", name: "Three on Fire", hint: "Build a 3-day streak" },
] as const;

const defaultFilters: RestaurantFilters = {
  craving: "all",
  maxDistanceKm: DEFAULT_MAP_RADIUS_KM,
  queues: ["green", "amber", "red"],
  maxPrice: 3,
  dietary: "all",
  hiddenOnly: false,
  bonusOnly: false,
};

function Mascot({ mood = "ready", small = false }: { mood?: "ready" | "party"; small?: boolean }) {
  return (
    <motion.div className={`mascot ${small ? "mascot-small" : ""}`} animate={{ y: [0, -7, 0], rotate: mood === "party" ? [-4, 5, -4] : [-2, 2, -2] }} transition={{ duration: 2.2, repeat: Infinity }} aria-label="Munch the QuestLunch mascot">
      <span className="mascot-leaf">◆</span>
      <span className="mascot-eye left" />
      <span className="mascot-eye right" />
      <span className="mascot-mouth">{mood === "party" ? "D" : "⌣"}</span>
      <span className="mascot-pack">★</span>
    </motion.div>
  );
}

function QueueDot({ status, pulse = false }: { status: QueueStatus; pulse?: boolean }) {
  return <span className={`queue-dot queue-${status} ${pulse ? "pulse" : ""}`} aria-label={`${status} queue`} />;
}

function DemoTag() {
  return <span className="demo-tag" title="Estimated wait time. MVP readings are simulated until a live queue source is connected.">WAIT ESTIMATE</span>;
}

function CouponBadge({ restaurant, compact = false }: { restaurant: Restaurant; compact?: boolean }) {
  const coupon = getActiveCoupon(restaurant);
  return coupon ? <span className={`coupon-badge ${compact ? "compact" : ""}`}>🎟 {coupon.label}</span> : null;
}

function Onboarding({
  step,
  setStep,
  onPick,
  assigned,
  alternatives,
  onChoose,
  onGo,
  referred,
}: {
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  onPick: (craving: Craving) => void;
  assigned?: Restaurant;
  alternatives: Restaurant[];
  onChoose: (restaurant: Restaurant) => void;
  onGo: () => void;
  referred: boolean;
}) {
  return (
    <main className="onboarding-shell">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.section key="intro" className="intro-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }}>
            <div className="fake-map" aria-hidden="true">
              <span className="road road-a" /><span className="road road-b" /><span className="road road-c" /><span className="road road-d" />
              {["🥗", "🍜", "🧆"].map((emoji, index) => <motion.span key={emoji} className={`floating-pin pin-${index + 1}`} initial={{ y: -180, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + index * 0.22, type: "spring", bounce: 0.55 }}>{emoji}</motion.span>)}
              <motion.svg className="route-squiggle" viewBox="0 0 280 320" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.5 }}><motion.path d="M 32 286 C 80 245, 34 190, 110 164 S 200 160, 244 74" fill="none" stroke="#e1623f" strokeWidth="7" strokeDasharray="2 15" strokeLinecap="round" /></motion.svg>
            </div>
            <div className="intro-copy">
              <motion.div initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8, type: "spring" }}><Mascot /></motion.div>
              <p className="eyebrow">YOUR LUNCH. YOUR QUEST.</p>
              <h1>Where will hunger<br /><em>take you?</em></h1>
              <p className="intro-sub">Pick a craving. We’ll handle the adventure.</p>
              <button className="primary-button mango-button" onClick={() => setStep("craving")}>Find my lunch <span>→</span></button>
              <p className="microcopy">No signup. No overthinking. Just lunch.</p>
            </div>
          </motion.section>
        )}

        {step === "craving" && (
          <motion.section key="craving" className={`craving-screen ${referred ? "referred" : ""}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <header className="onboarding-header"><button onClick={() => setStep("intro")} aria-label="Back">←</button><span>QUESTLUNCH</span><Mascot small /></header>
            {referred && <div className="invite-boost"><span>⚡</span><div><strong>Your crew invite is active</strong><small>Pick a craving to unlock a 1.25× Quest Boost.</small></div></div>}
            <div className="craving-copy"><p className="eyebrow">{referred ? "YOUR FRIEND SENT A QUEST" : "CHOOSE YOUR MOOD"}</p><h2>What are we<br />hunting for?</h2><p>Tap a card. Follow your gut.</p></div>
            <div className="craving-stack">
              {cravings.map((craving, index) => (
                <motion.button key={craving.id} className={`craving-card craving-${craving.color}`} onClick={() => onPick(craving.id)} initial={{ opacity: 0, y: 35, rotate: index % 2 ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5, rotate: 0 }} whileTap={{ scale: 0.97 }} transition={{ delay: index * 0.08 }}>
                  <span className="craving-emoji">{craving.emoji}</span><span><strong>{craving.label}</strong><small>{craving.line}</small></span><b>→</b>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {step === "assigned" && assigned && (
          <motion.section key="assigned" className="assigned-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="assigned-map"><QuestMap restaurants={[assigned]} selected={assigned} onSelect={() => undefined} routeTo={assigned} radiusKm={DEFAULT_MAP_RADIUS_KM} /><div className="map-wash" /></div>
            <motion.div className="quest-stamp" initial={{ scale: 2.2, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: -4 }} transition={{ delay: 0.65, type: "spring" }}>QUEST<br />FOUND!</motion.div>
            <motion.div className="assigned-card" initial={{ y: 300 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring", damping: 19 }}>
              <div className="sheet-handle" />
              <div className="restaurant-hero" style={{ background: assigned.image }}><span>{assigned.emoji}</span><div className="match-badge">{assigned.match}% MATCH</div><CouponBadge restaurant={assigned} /></div>
              <div className="restaurant-title"><div><p className="eyebrow">YOUR FIRST QUEST</p><h2>{assigned.name}</h2></div><span className="budget-pill"><small>EST. BUDGET</small>{budgetCopy[assigned.price]}</span></div>
              <p>{assigned.description}</p>
              <div className="fact-row"><span>🚶 {Math.round(assigned.distanceKm * 12)} min</span><span><QueueDot status={assigned.queue} /> {queueCopy[assigned.queue].label}</span><DemoTag /></div>
              {alternatives.length > 0 && <div className="alternate-picks"><div><b>Prefer another nearby option?</b><small>All match your craving and avoid red queues.</small></div>{alternatives.map((restaurant) => <button key={restaurant.id} onClick={() => onChoose(restaurant)}><span>{restaurant.emoji}</span><strong>{restaurant.name}</strong><small>{restaurant.distanceKm} km · {budgetCopy[restaurant.price]}</small><QueueDot status={restaurant.queue} /></button>)}</div>}
              {assigned.queue !== "green" && <div className="roam-nudge"><span>🧭</span><div><strong>Busy trail ahead</strong><small>Roam Mode has faster hidden gems ready.</small></div></div>}
              <button className="primary-button" onClick={onGo}>Start quest <span>→</span></button>
              <button className="change-craving-button" onClick={() => setStep("craving")}>← Change craving</button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function FiltersPanel({ filters, setFilters, onClose }: { filters: RestaurantFilters; setFilters: (filters: RestaurantFilters) => void; onClose: () => void }) {
  const toggleQueue = (queue: QueueStatus) => setFilters({ ...filters, queues: filters.queues.includes(queue) ? filters.queues.filter((item) => item !== queue) : [...filters.queues, queue] });
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.section className="filter-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" /><div className="panel-title"><h2>Shape the quest</h2><button onClick={onClose}>Done</button></div>
        <label className="filter-label">Craving</label><div className="chip-row">{["all", ...cravings.map((item) => item.id)].map((item) => <button key={item} className={filters.craving === item ? "chip active" : "chip"} onClick={() => setFilters({ ...filters, craving: item as Craving | "all" })}>{item === "all" ? "Anything" : item}</button>)}</div>
        <label className="filter-label">Search radius <b>{filters.maxDistanceKm} km</b></label><div className="radius-options">{MAP_RADIUS_OPTIONS.map((radius) => <button key={radius} className={filters.maxDistanceKm === radius ? "active" : ""} onClick={() => setFilters({ ...filters, maxDistanceKm: radius })}>{radius} km</button>)}</div>
        <label className="filter-label">Queue right now</label><div className="chip-row">{(["green", "amber", "red"] as QueueStatus[]).map((queue) => <button key={queue} className={filters.queues.includes(queue) ? "chip active" : "chip"} onClick={() => toggleQueue(queue)}><QueueDot status={queue} /> {queueCopy[queue].label}</button>)}</div>
        <label className="filter-label">Price up to</label><div className="segmented">{([1, 2, 3] as const).map((price) => <button key={price} className={filters.maxPrice === price ? "active" : ""} onClick={() => setFilters({ ...filters, maxPrice: price })}>{"$".repeat(price)}</button>)}</div>
        <label className="filter-label">Dietary</label><select value={filters.dietary} onChange={(event) => setFilters({ ...filters, dietary: event.target.value as Dietary | "all" })}><option value="all">No preference</option><option value="vegan">Vegan</option><option value="vegetarian">Vegetarian</option><option value="halal">Halal</option><option value="gluten-free">Gluten-free</option></select>
        <label className="toggle-row"><span><strong>💎 Hidden Gems only</strong><small>Send love to quieter locals</small></span><input type="checkbox" checked={filters.hiddenOnly} onChange={(event) => setFilters({ ...filters, hiddenOnly: event.target.checked })} /></label>
        <label className="toggle-row"><span><strong>✨ Quest bonus available</strong><small>Earn extra points today</small></span><input type="checkbox" checked={filters.bonusOnly} onChange={(event) => setFilters({ ...filters, bonusOnly: event.target.checked })} /></label>
        <button className="secondary-button" onClick={() => setFilters(defaultFilters)}>Reset filters</button>
      </motion.section>
    </motion.div>
  );
}

function RestaurantSheet({ restaurant, onGo, onRoam, onClose }: { restaurant: Restaurant; onGo: () => void; onRoam: () => void; onClose: () => void }) {
  const { profile, activeQuest } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [riskingQueue, setRiskingQueue] = useState(false);
  const [advice, setAdvice] = useState<{ message: string; recommendation: string; source: "openai" | "fallback" } | null>(null);
  const coupon = getActiveCoupon(restaurant);
  const craving = activeQuest?.craving ?? restaurant.cravings[0];
  const adviceAlternatives = useMemo(() => rankRestaurants(restaurants.filter((candidate) => candidate.id !== restaurant.id), craving, true).filter((candidate) => candidate.queue !== "red").slice(0, 3), [craving, restaurant.id]);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/quest-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        mode: restaurant.queue === "red" ? "crowded_warning" : restaurant.queue === "amber" ? "filling_warning" : "recommendation",
        profileName: profile.name,
        craving,
        selected: { name: restaurant.name, waitMinutes: restaurant.waitMinutes, distanceKm: restaurant.distanceKm, budget: budgetCopy[restaurant.price] },
        alternatives: adviceAlternatives.map((candidate) => ({ name: candidate.name, waitMinutes: candidate.waitMinutes, distanceKm: candidate.distanceKm, budget: budgetCopy[candidate.price] })),
      }),
    }).then((response) => response.ok ? response.json() : null).then((result) => { if (result) setAdvice(result); }).catch(() => undefined);
    return () => controller.abort();
  }, [adviceAlternatives, craving, profile.name, restaurant]);
  const copyCoupon = async () => {
    if (!coupon) return;
    await navigator.clipboard?.writeText(coupon.code);
    track("coupon_copied", { restaurant_id: restaurant.id, coupon_label: coupon.label });
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <motion.section className="restaurant-sheet" initial={{ y: 360 }} animate={{ y: 0 }} exit={{ y: 360 }} transition={{ type: "spring", damping: 24 }}>
      <div className="sheet-handle" /><button className="sheet-close" onClick={onClose}>×</button>
      <div className="restaurant-sheet-main"><div className="mini-photo" style={{ background: restaurant.image }}>{restaurant.emoji}</div><div><div className="tagline-row">{restaurant.hiddenGem && <span className="tiny-tag">💎 HIDDEN GEM</span>}{restaurant.bonusPoints > 0 && <span className="tiny-tag mango">+{restaurant.bonusPoints} PTS</span>}</div><h2>{restaurant.name}</h2><p>{restaurant.description}</p></div></div>
      <div className="sheet-stats"><span><b>{restaurant.match}%</b> craving match</span><span><QueueDot status={restaurant.queue} pulse /> <b>{restaurant.waitMinutes} min</b> <DemoTag /></span><span><b>{restaurant.distanceKm} km</b> away</span><span><b>{budgetCopy[restaurant.price]}</b> est. budget</span></div>
      {restaurant.queue !== "red" && advice && <div className={`ai-advice ${restaurant.queue === "amber" ? "amber-advice" : ""}`}><span>{restaurant.queue === "amber" ? "😏" : "✨"}</span><div><small>{advice.source === "openai" ? "MUNCH AI" : "MUNCH’S TAKE"}{restaurant.queue === "amber" ? " · FILLING UP" : ""}</small><p>{advice.message}</p><em>{advice.recommendation}</em></div></div>}
      {coupon && <div className="coupon-strip"><span>🎟️</span><div><small>{coupon.verified ? "VERIFIED OFFER" : "DEMO OFFER"}</small><strong>{coupon.label}</strong><p>Show code <b>{coupon.code}</b> · ends {coupon.expiresAt}</p></div><button onClick={copyCoupon}>{copied ? "Copied!" : "Copy code"}</button></div>}
      <div className="sheet-actions">{restaurant.queue === "red" ? <>{riskingQueue ? <div className="risk-confirmation"><span>🙃</span><div><small>{advice?.source === "openai" ? "MUNCH AI HAS CONCERNS" : "MUNCH HAS CONCERNS"}</small><p>{advice?.message ?? `${profile.name.split(" ")[0]}, choosing a ${restaurant.waitMinutes}-minute queue is certainly one way to make lunch memorable.`}</p>{advice?.recommendation && <em>{advice.recommendation}</em>}</div><button className="primary-button" onClick={onRoam}>Fine, show me faster food</button><button className="risk-confirm-button" onClick={() => { track("crowded_route_confirmed", { restaurant_id: restaurant.id, wait_minutes: restaurant.waitMinutes }); onGo(); }}>Yes, route me anyway</button></div> : <><div className="queue-warning">This wait is too long. We recommend a faster nearby match.</div><button className="primary-button" onClick={onRoam}>Find a faster option <span>→</span></button><button className="risk-button" onClick={() => { setRiskingQueue(true); track("crowded_choice_warning", { restaurant_id: restaurant.id, wait_minutes: restaurant.waitMinutes }); }}>I’ll risk the queue 🙃</button></>}</> : <><button className="primary-button" onClick={onGo}>{restaurant.queue === "amber" ? "Queue anyway" : "Go here"} <span>→</span></button><button className="roam-button" onClick={onRoam}>🧭 {restaurant.queue === "amber" ? "Find faster" : "Other options"}</button></>}</div>
    </motion.section>
  );
}

function MapScreen({ filters, onFilters, onComplete }: { filters: RestaurantFilters; onFilters: () => void; onComplete: (restaurant: Restaurant) => void }) {
  const { activeQuest, selectedRestaurantId, selectRestaurant, startRoute } = useGameStore();
  const [roaming, setRoaming] = useState(false);
  const visible = useMemo(() => applyFilters(restaurants, filters), [filters]);
  const selected = restaurants.find((restaurant) => restaurant.id === selectedRestaurantId);
  const routeTo = activeQuest?.status === "en-route" ? restaurants.find((restaurant) => restaurant.id === activeQuest.restaurantId) : undefined;
  const roamOptions = activeQuest ? rankRestaurants(restaurants.filter((item) => item.id !== activeQuest.restaurantId), activeQuest.craving, true).slice(0, 3) : [];
  const mapRestaurants = roaming ? roamOptions : visible;
  return (
    <section className="map-screen">
      <div className="map-topbar"><div className="brand-pill"><Mascot small /><b>QUESTLUNCH</b></div><button className="filter-button" onClick={onFilters}>⚙ Filters</button></div>
      <div className="map-canvas"><QuestMap restaurants={mapRestaurants} selected={selected} onSelect={(restaurant) => selectRestaurant(restaurant.id)} routeTo={routeTo} radiusKm={filters.maxDistanceKm} /></div>
      <div className="map-legend"><DemoTag /><span><QueueDot status="green" /> quick</span><span><QueueDot status="amber" /> filling up</span><span><QueueDot status="red" /> busy</span></div>
      {roaming && <motion.div className="roam-banner" initial={{ scale: 0.8 }} animate={{ scale: 1 }}><span>🧭</span><div><b>Roam Mode</b><small>Three smarter trails just appeared</small></div><button onClick={() => setRoaming(false)}>×</button></motion.div>}
      {visible.length === 0 && <div className="empty-map"><Mascot small /><b>No quests fit that combo</b><button onClick={onFilters}>Loosen filters</button></div>}
      <AnimatePresence>{selected && <RestaurantSheet key={selected.id} restaurant={selected} onClose={() => selectRestaurant(null)} onGo={() => { startRoute(selected, roaming); setRoaming(false); selectRestaurant(null); }} onRoam={() => { setRoaming(true); selectRestaurant(null); }} />}</AnimatePresence>
      {routeTo && !selected && <motion.div className="route-card" initial={{ y: 100 }} animate={{ y: 0 }}><span className="route-emoji">{routeTo.emoji}</span><div><small>YOU’RE ON THE TRAIL</small><b>{routeTo.name}</b><span>{Math.round(routeTo.distanceKm * 12)} min walk · {routeTo.waitMinutes} min queue</span></div><button onClick={() => onComplete(routeTo)}>I’m here!</button></motion.div>}
    </section>
  );
}

function QuestsScreen({ onStart }: { onStart: () => void }) {
  const { profile, activeQuest, assignQuest } = useGameStore();
  const [liked, setLiked] = useState(false);
  const featured = restaurants.slice(1, 5);
  const today = new Date().toISOString().slice(0, 10);
  const dailyDone = (profile.completedDailyQuestDates ?? []).includes(today);
  const dailyTarget = rankRestaurants(restaurants, "spicy", false).find((restaurant) => restaurant.distanceKm <= 2) ?? rankRestaurants(restaurants, "surprise", false)[0];
  const startDailyQuest = () => {
    if (!dailyTarget) return;
    assignQuest(dailyTarget, "spicy");
    onStart();
  };
  return (
    <section className="content-screen quests-screen">
      <header className="home-header"><div><p>GOOD AFTERNOON,</p><h1>{profile.name.split(" ")[0]} 👋</h1></div><div className="score-pill"><span>🔥 {profile.streak}</span><span>✦ {profile.points}</span></div></header>
      <motion.div className={`daily-quest-card ${dailyDone ? "daily-complete" : ""}`} whileHover={{ rotate: -0.4 }}>
        <div className="daily-sun">☀</div><p className="eyebrow">TODAY’S QUEST · QUEUE DODGE</p><h2>{dailyDone ? "Queue defeated." : "Skip the crowded choice."}</h2><p>{dailyDone ? "Come back tomorrow for a new challenge." : "We’ll find a spicy match with a low wait estimate within 2 km—then keep a fallback ready."}</p><div className="daily-objectives"><span>🌶️ Pick spicy</span><span>🟢 Low wait</span><span>📍 Check in</span></div><div className="daily-reward"><b>{dailyDone ? "✓ COMPLETE" : `+${DAILY_QUEST_BONUS} BONUS`}</b><small>{dailyDone ? "Smart pick saved" : "for arriving at a viable pick"}</small></div><button className="primary-button ink-button" onClick={startDailyQuest} disabled={dailyDone}>{dailyDone ? "Quest complete" : "Find a faster lunch"} <span>{dailyDone ? "✓" : "→"}</span></button><Mascot small /></motion.div>
      {activeQuest && activeQuest.status !== "completed" && <div className="active-strip"><span>{restaurants.find((item) => item.id === activeQuest.restaurantId)?.emoji}</span><div><small>ACTIVE QUEST</small><b>{restaurants.find((item) => item.id === activeQuest.restaurantId)?.name}</b></div><button onClick={onStart}>View map →</button></div>}
      <div className="section-heading"><div><p className="eyebrow">NEAR YOU NOW</p><h2>Quick quests</h2></div><DemoTag /></div>
      <div className="nearby-scroll">{featured.map((restaurant) => <button key={restaurant.id} className="nearby-card" onClick={() => { assignQuest(restaurant, restaurant.cravings[0]); onStart(); }}><div className="nearby-photo" style={{ background: restaurant.image }}><span>{restaurant.emoji}</span>{restaurant.bonusPoints > 0 && <b>+{restaurant.bonusPoints}</b>}<CouponBadge restaurant={restaurant} compact /></div><div className="nearby-name"><strong>{restaurant.name}</strong><QueueDot status={restaurant.queue} /></div><p>{restaurant.distanceKm} km · Est. {budgetCopy[restaurant.price]}</p>{restaurant.hiddenGem && <small>💎 Hidden gem</small>}</button>)}</div>
      <div className="friend-prompt"><span className="avatar-stack">🧑🏽‍🍳👩🏻‍🎨🧑🏼‍💻</span><div><b>Lunch is better with rivals.</b><p>Invite a friend. You both earn a Quest Pass.</p></div><button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}?ref=${profile.referralCode}`)}>Invite</button></div>
      <div className={`like-prompt ${liked ? "liked" : ""}`}><div><b>{liked ? "Thanks — lunch is on us to improve." : "Would you use Kiasu for lunch?"}</b><p>{liked ? "Your vote was recorded." : "One tap helps us validate the idea."}</p></div><button disabled={liked} onClick={() => { if (liked) return; setLiked(true); track("product_liked", { screen: "quests_home", active_quest: Boolean(activeQuest) }); }}>{liked ? "✓ Liked" : "👍 Yes"}</button></div>
    </section>
  );
}

function RewardsScreen() {
  const { profile } = useGameStore();
  return (
    <section className="content-screen rewards-screen"><div className="page-kicker"><p className="eyebrow">YOUR TROPHY CABINET</p><h1>Rewards</h1><p>Every bite writes your legend.</p></div>
      <div className="points-banner"><div><small>QUEST POINTS</small><strong>{profile.points}</strong></div><span>✦</span><p>{profile.points < 250 ? `${250 - profile.points} to your next mystery reward` : "Mystery reward unlocked!"}</p><div className="progress"><i style={{ width: `${Math.min(100, profile.points / 2.5)}%` }} /></div></div>
      <div className="section-heading"><div><p className="eyebrow">BADGE SHELF</p><h2>{profile.badges.length} of {badgeInfo.length} unlocked</h2></div></div>
      <div className="badge-grid">{badgeInfo.map((badge) => { const earned = profile.badges.includes(badge.id); return <div key={badge.id} className={earned ? "badge-card earned" : "badge-card locked"}><span>{earned ? badge.emoji : "?"}</span><b>{badge.name}</b><small>{earned ? "Unlocked!" : badge.hint}</small></div>; })}</div>
      <div className="freeze-card"><span>❄️</span><div><b>Streak Freeze</b><p>{profile.streakFreezeAvailable ? "One save is packed for a busy day." : "Used — earn another at a 7-day streak."}</p></div><strong>{profile.streakFreezeAvailable ? "READY" : "USED"}</strong></div>
    </section>
  );
}

function ProfileScreen() {
  const { profile, resetDemo, demoCompleteCrewLink } = useGameStore();
  const [copied, setCopied] = useState(false);
  const crewLinks = profile.crewLinks ?? 0;
  const boost = getCrewBoost(crewLinks);
  const nextTier = crewLinks < 1 ? 1 : crewLinks < 3 ? 3 : 6;
  const shareReferral = async () => {
    const url = `${window.location.origin}?ref=${profile.referralCode}&utm_source=quest_share&utm_medium=referral&utm_campaign=crew_boost`;
    const text = `Pick a lunch quest with me. You start at 1.25× points, and your first quest boosts my crew too! ${url}`;
    if (navigator.share) await navigator.share({ title: "QuestLunch", text, url }).catch(() => undefined);
    else await navigator.clipboard?.writeText(text);
    track("referral_shared", { crew_links: crewLinks, current_boost: boost });
    void recordBackendEvent("referral_shared");
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  return (
    <section className="content-screen profile-screen"><header className="profile-head"><div className="profile-avatar">{profile.name.slice(0, 1)}<span>🔥</span></div><div><p className="eyebrow">LUNCH EXPLORER</p><h1>{profile.name}</h1><p>{profile.completedRestaurantIds.length} discoveries · {profile.streak} day streak</p></div></header>
      <div className="referral-card"><p className="eyebrow">QUEST CREW BOOST</p><h2>Lunch earns more<br />with every friend.</h2><p>Your friend starts at 1.25× points. Completed crew links increase both of your future quest rewards.</p><div className="referral-code"><span>{profile.referralCode}</span><button onClick={shareReferral}>{copied ? "Shared!" : "Invite friend ↗"}</button></div><Mascot small /></div>
      <section className="crew-boost-card"><div className="crew-boost-head"><div><p className="eyebrow">YOUR EARNING RATE</p><h2>{boost}× points</h2></div><span>⚡ {crewLinks} links</span></div><div className="crew-track"><i style={{ width: `${Math.min(100, crewLinks / 6 * 100)}%` }} />{[1, 3, 6].map((tier) => <b key={tier} className={crewLinks >= tier ? "reached" : ""} style={{ left: `${tier / 6 * 100}%` }}>{tier}<small>{getCrewBoost(tier)}×</small></b>)}</div><p>{crewLinks >= 6 ? "Maximum boost unlocked. Every quest pays double." : `${nextTier - crewLinks} more completed ${nextTier - crewLinks === 1 ? "link" : "links"} to unlock ${getCrewBoost(nextTier)}× points.`}</p><div className="link-status"><span className={crewLinks >= 1 ? "done" : ""}>1 friend</span><span className={crewLinks >= 3 ? "done" : ""}>3 friends</span><span className={crewLinks >= 6 ? "done" : ""}>6 friends</span></div><button className="demo-link-button" onClick={demoCompleteCrewLink}>Demo: friend completed first quest</button><small className="demo-disclaimer">Demo control only. Production links will be verified by the backend.</small></section>
      <div className="section-heading"><div><p className="eyebrow">FRIEND LEAGUE</p><h2>This week</h2></div><span className="tiny-tag mango">STREAKS</span></div>
      <ol className="leaderboard"><li><b>1</b><span>🥷</span><div><strong>Maya</strong><small>8 discoveries</small></div><em>🔥 6</em></li><li className="you"><b>2</b><span>🧭</span><div><strong>You</strong><small>{profile.completedRestaurantIds.length} discoveries</small></div><em>🔥 {profile.streak}</em></li><li><b>3</b><span>🧑🏾‍🚀</span><div><strong>Leo</strong><small>5 discoveries</small></div><em>🔥 2</em></li></ol>
      <div className="streak-history"><div><p className="eyebrow">STREAK TRAIL</p><h2>Keep the flame alive</h2></div><div className="week-row">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`} className={index < profile.streak ? "done" : index === profile.streak ? "today" : ""}>{index < profile.streak ? "🔥" : day}</span>)}</div></div>
      <button className="text-button reset-button" onClick={resetDemo}>Reset demo journey</button>
    </section>
  );
}

function PayoffModal({ restaurant, dailyBonus, onClose }: { restaurant: Restaurant; dailyBonus: number; onClose: () => void }) {
  const { profile, signUp } = useGameStore();
  const [name, setName] = useState("");
  const [shared, setShared] = useState(false);
  const boost = getCrewBoost(profile.crewLinks ?? 0);
  const earned = Math.round((100 + restaurant.bonusPoints) * boost) + dailyBonus;
  const cardUrl = `/api/share-card?place=${encodeURIComponent(restaurant.name)}&emoji=${encodeURIComponent(restaurant.emoji)}&points=${earned}&streak=${profile.streak}`;
  useEffect(() => { confetti({ particleCount: 150, spread: 85, origin: { y: 0.55 }, colors: ["#e1623f", "#f7b32b", "#7fb069", "#fff7ee"] }); }, []);
  const share = async () => {
    const url = `${window.location.origin}?ref=${profile.referralCode}&utm_source=quest_share&utm_medium=referral&utm_campaign=quest_complete`;
    if (navigator.share) await navigator.share({ title: `Quest complete: ${restaurant.name}`, text: `I earned ${earned} points at ${restaurant.name}. Pick your craving and start with a 1.25× Crew Boost!`, url }).catch(() => undefined);
    else await navigator.clipboard?.writeText(url);
    track("referral_shared", { source: "quest_complete", restaurant_id: restaurant.id, earned_points: earned });
    void recordBackendEvent("referral_shared", { restaurantId: restaurant.id });
    setShared(true);
  };
  return (
    <motion.div className="payoff-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.section className="payoff-modal" initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring" }}>
        <button className="sheet-close" onClick={onClose}>×</button><Mascot mood="party" />
        <p className="eyebrow">QUEST COMPLETE!</p><h1>You found<br /><em>{restaurant.name}</em></h1>
        <div className="reward-burst"><strong>+{earned}</strong><span>QUEST POINTS · {boost}× CREW</span></div>
        <div className="payoff-stats"><span>🔥 <b>{profile.streak} day</b> streak</span>{dailyBonus > 0 && <span>🧭 <b>+{dailyBonus} Queue Dodge</b></span>}{restaurant.hiddenGem && <span>💎 <b>Hidden Gem</b> found</span>}</div>
        <div className="share-preview"><Image src={cardUrl} alt={`Share card for ${restaurant.name}`} width={66} height={96} unoptimized /><div><b>Your story card is ready</b><p>Brag tastefully. Invite shamelessly.</p><button onClick={share}>{shared ? "Link copied!" : "Share the quest ↗"}</button></div></div>
        {!profile.signedUp ? <div className="save-streak"><p className="eyebrow">DON’T LOSE THE FLAME</p><h2>Save your streak</h2><p>Your first quest was free. Choose a name to keep your points and referral code on this device.</p><div><input placeholder="Your explorer name" value={name} onChange={(event) => setName(event.target.value)} /><button onClick={() => { signUp(name); track("profile_saved", { after_first_quest: true }); onClose(); }}>Save it</button></div><small>MVP guest profile · no real authentication yet</small></div> : <button className="primary-button" onClick={onClose}>Back to the map</button>}
      </motion.section>
    </motion.div>
  );
}

export default function QuestLunchApp() {
  const game = useGameStore();
  const searchParams = useSearchParams();
  const referral = searchParams.get("ref");
  const [step, setStep] = useState<OnboardingStep>(referral ? "craving" : "intro");
  const [tab, setTab] = useState<Tab>("quests");
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [completed, setCompleted] = useState<{ restaurant: Restaurant; dailyBonus: number } | null>(null);
  const referred = Boolean(referral);
  const assigned = game.activeQuest ? restaurants.find((restaurant) => restaurant.id === game.activeQuest?.restaurantId) : undefined;
  const alternatives = game.activeQuest ? rankRestaurants(restaurants.filter((restaurant) => restaurant.id !== assigned?.id), game.activeQuest.craving, false).filter((restaurant) => restaurant.distanceKm <= defaultFilters.maxDistanceKm).slice(0, 3) : [];

  useEffect(() => {
    if (referral) {
      game.applyReferral(referral);
      track("referral_opened", { referral_code: referral });
    }
    // Referral redemption is idempotent in the domain layer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referral]);

  const pickCraving = (craving: Craving) => {
    const candidate = rankRestaurants(restaurants, craving, false)[0] ?? rankRestaurants(restaurants, "surprise", false)[0];
    if (!candidate) return;
    game.assignQuest(candidate, craving);
    track("craving_selected", { craving });
    track("quest_assigned", { craving, restaurant_id: candidate.id, referral_visitor: referred });
    void recordBackendEvent("quest_assigned", { craving, restaurantId: candidate.id });
    setStep("assigned");
  };
  const beginFirstQuest = () => { if (assigned) { game.startRoute(assigned); track("quest_started", { restaurant_id: assigned.id }); void recordBackendEvent("quest_started", { restaurantId: assigned.id }); } game.finishOnboarding(); setTab("map"); };
  const finishQuest = (restaurant: Restaurant) => { const today = new Date().toISOString().slice(0, 10); const dailyBonus = restaurant.queue !== "red" && !(game.profile.completedDailyQuestDates ?? []).includes(today) ? DAILY_QUEST_BONUS : 0; game.finishQuest(restaurant); track("quest_completed", { restaurant_id: restaurant.id, hidden_gem: restaurant.hiddenGem, crew_boost: getCrewBoost(game.profile.crewLinks ?? 0), daily_bonus: dailyBonus }); void recordBackendEvent("quest_completed", { restaurantId: restaurant.id }); setCompleted({ restaurant, dailyBonus }); };

  if (!game.onboardingComplete) return <Onboarding step={step} setStep={setStep} onPick={pickCraving} assigned={assigned} alternatives={alternatives} onChoose={(restaurant) => game.assignQuest(restaurant, game.activeQuest?.craving ?? restaurant.cravings[0])} onGo={beginFirstQuest} referred={referred} />;

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="tab-page" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
          {tab === "map" && <MapScreen filters={filters} onFilters={() => setShowFilters(true)} onComplete={finishQuest} />}
          {tab === "quests" && <QuestsScreen onStart={() => setTab("map")} />}
          {tab === "rewards" && <RewardsScreen />}
          {tab === "profile" && <ProfileScreen />}
        </motion.div>
      </AnimatePresence>
      <nav className="bottom-nav" aria-label="Main navigation">{([{ id: "map", icon: "⌖", label: "Map" }, { id: "quests", icon: "⚑", label: "Quests" }, { id: "rewards", icon: "✦", label: "Rewards" }, { id: "profile", icon: "☺", label: "Profile" }] as const).map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>
      <AnimatePresence>{showFilters && <FiltersPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}</AnimatePresence>
      <AnimatePresence>{completed && <PayoffModal restaurant={completed.restaurant} dailyBonus={completed.dailyBonus} onClose={() => setCompleted(null)} />}</AnimatePresence>
    </div>
  );
}
