import type { Craving, PlayerProfile, Restaurant, RestaurantCoupon, RestaurantFilters } from "./types";

export const DAILY_QUEST_BONUS = 75;

export function getActiveCoupon(restaurant: Restaurant, today = new Date().toISOString().slice(0, 10)): RestaurantCoupon | undefined {
  return restaurant.coupon && restaurant.coupon.expiresAt >= today ? restaurant.coupon : undefined;
}

export function getCrewBoost(crewLinks: number): number {
  if (crewLinks >= 6) return 2;
  if (crewLinks >= 3) return 1.5;
  if (crewLinks >= 1) return 1.25;
  return 1;
}

export function addCrewLink(profile: PlayerProfile): PlayerProfile {
  return { ...profile, crewLinks: (profile.crewLinks ?? 0) + 1 };
}

export function rankRestaurants(
  restaurants: Restaurant[],
  craving: Craving,
  roamMode: boolean,
): Restaurant[] {
  const cravingMatches = restaurants.filter((restaurant) => craving === "surprise" || restaurant.cravings.includes(craving));
  const viableMatches = cravingMatches.filter((restaurant) => restaurant.queue !== "red");
  const candidates = roamMode ? cravingMatches : viableMatches;

  return candidates
    .map((restaurant) => {
      const roamBoost = roamMode
        ? (restaurant.hiddenGem ? 35 : 0) + restaurant.bonusPoints / 4 + (restaurant.queue === "green" ? 20 : restaurant.queue === "amber" ? 5 : -20)
        : 0;
      return { restaurant, score: restaurant.match + roamBoost - restaurant.distanceKm * 3 };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ restaurant }) => restaurant);
}

export function applyFilters(restaurants: Restaurant[], filters: RestaurantFilters): Restaurant[] {
  return restaurants.filter((restaurant) =>
    (filters.craving === "all" || restaurant.cravings.includes(filters.craving)) &&
    restaurant.distanceKm <= filters.maxDistanceKm &&
    filters.queues.includes(restaurant.queue) &&
    restaurant.price <= filters.maxPrice &&
    (filters.dietary === "all" || restaurant.dietary.includes(filters.dietary)) &&
    (!filters.hiddenOnly || restaurant.hiddenGem) &&
    (!filters.bonusOnly || restaurant.bonusPoints > 0),
  );
}

export function createGuestProfile(): PlayerProfile {
  return {
    name: "Lunch Explorer",
    points: 0,
    streak: 0,
    streakFreezeAvailable: true,
    questPasses: 0,
    crewLinks: 0,
    referralCode: "MANGO42",
    referredBy: null,
    badges: [],
    completedRestaurantIds: [],
    streakDates: [],
    completedDailyQuestDates: [],
    signedUp: false,
  };
}

export function redeemReferral(profile: PlayerProfile, code: string): PlayerProfile {
  if (!code.trim() || profile.referredBy) return profile;
  return { ...profile, questPasses: profile.questPasses + 1, crewLinks: (profile.crewLinks ?? 0) + 1, referredBy: code.trim().toUpperCase() };
}

export function completeQuest(
  profile: PlayerProfile,
  restaurant: Restaurant,
  date: string,
): PlayerProfile {
  if (profile.completedRestaurantIds.includes(restaurant.id)) return profile;
  const badges = new Set(profile.badges);
  badges.add("first-bite");
  if (restaurant.hiddenGem) badges.add("hidden-gem-hunter");
  const nextStreak = profile.streak + 1;
  if (nextStreak >= 3) badges.add("streak-three");

  return {
    ...profile,
    points: profile.points + Math.round((100 + restaurant.bonusPoints) * getCrewBoost(profile.crewLinks ?? 0)),
    streak: nextStreak,
    badges: [...badges],
    completedRestaurantIds: [...profile.completedRestaurantIds, restaurant.id],
    streakDates: [...profile.streakDates, date],
  };
}

export function completeDailyQuest(
  profile: PlayerProfile,
  restaurant: Restaurant,
  date: string,
): PlayerProfile {
  const completed = completeQuest(profile, restaurant, date);
  const dailyDates = profile.completedDailyQuestDates ?? [];
  if (completed === profile || restaurant.queue === "red" || dailyDates.includes(date)) return completed;

  return {
    ...completed,
    points: completed.points + DAILY_QUEST_BONUS,
    completedDailyQuestDates: [...dailyDates, date],
  };
}
