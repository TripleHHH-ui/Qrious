import { describe, expect, it } from "vitest";
import type { Restaurant } from "./types";
import {
  addCrewLink,
  applyFilters,
  completeQuest,
  createGuestProfile,
  getActiveCoupon,
  getCrewBoost,
  rankRestaurants,
  redeemReferral,
} from "./quest";

const restaurants: Restaurant[] = [
  {
    id: "busy-spicy",
    name: "Busy Bowl",
    emoji: "🍜",
    image: "",
    description: "Noodles",
    lat: 51.515,
    lng: -0.09,
    distanceKm: 0.4,
    cravings: ["spicy", "comfort"],
    dietary: ["vegetarian"],
    price: 2,
    queue: "red",
    waitMinutes: 28,
    hiddenGem: false,
    bonusPoints: 0,
    match: 94,
  },
  {
    id: "quiet-spicy",
    name: "Secret Sizzle",
    emoji: "🌶️",
    image: "",
    description: "Hidden gem",
    lat: 51.516,
    lng: -0.091,
    distanceKm: 0.7,
    cravings: ["spicy"],
    dietary: ["vegan", "vegetarian"],
    price: 1,
    queue: "green",
    waitMinutes: 4,
    hiddenGem: true,
    bonusPoints: 40,
    match: 88,
  },
];

describe("quest matching", () => {
  it("assigns the strongest craving match as the main quest", () => {
    expect(rankRestaurants(restaurants, "spicy", false)[0].id).toBe("busy-spicy");
  });

  it("weights low-traffic hidden gems and bonuses first in Roam Mode", () => {
    expect(rankRestaurants(restaurants, "spicy", true)[0].id).toBe("quiet-spicy");
  });

  it("applies all active restaurant filters without a reload", () => {
    const result = applyFilters(restaurants, {
      craving: "spicy",
      maxDistanceKm: 1,
      queues: ["green"],
      maxPrice: 1,
      dietary: "vegan",
      hiddenOnly: true,
      bonusOnly: true,
    });
    expect(result.map((restaurant) => restaurant.id)).toEqual(["quiet-spicy"]);
  });
});

describe("growth and reward loop", () => {
  it("awards both sides one Quest Pass when a referral is redeemed", () => {
    const profile = redeemReferral(createGuestProfile(), "MANGO42");
    expect(profile.questPasses).toBe(1);
    expect(profile.referredBy).toBe("MANGO42");
  });

  it("does not allow the same referral code to be redeemed twice", () => {
    const once = redeemReferral(createGuestProfile(), "MANGO42");
    expect(redeemReferral(once, "MANGO42")).toEqual(once);
  });

  it("pays points, grows the streak, and unlocks Hidden Gem Hunter", () => {
    const completed = completeQuest(createGuestProfile(), restaurants[1], "2026-07-12");
    expect(completed.points).toBe(140);
    expect(completed.streak).toBe(1);
    expect(completed.badges).toContain("hidden-gem-hunter");
    expect(completed.completedRestaurantIds).toEqual(["quiet-spicy"]);
  });
});

describe("restaurant coupons", () => {
  it("returns a discount only while its coupon is active", () => {
    const restaurant = {
      ...restaurants[0],
      coupon: {
        label: "20% off lunch",
        code: "LUNCH20",
        expiresAt: "2026-08-01",
        verified: false,
      },
    };

    expect(getActiveCoupon(restaurant, "2026-07-12")?.code).toBe("LUNCH20");
  });

  it("hides expired restaurant coupons", () => {
    const restaurant = {
      ...restaurants[0],
      coupon: {
        label: "20% off lunch",
        code: "LUNCH20",
        expiresAt: "2026-07-01",
        verified: false,
      },
    };

    expect(getActiveCoupon(restaurant, "2026-07-12")).toBeUndefined();
  });
});

describe("Quest Crew Boost", () => {
  it.each([
    [0, 1],
    [1, 1.25],
    [3, 1.5],
    [6, 2],
  ])("uses the referral tier for %i completed crew links", (crewLinks, multiplier) => {
    expect(getCrewBoost(crewLinks)).toBe(multiplier);
  });

  it("gives a referred explorer their first crew linkage", () => {
    expect(redeemReferral(createGuestProfile(), "MANGO42").crewLinks).toBe(1);
  });

  it("applies the crew multiplier to future quest points", () => {
    const profile = { ...createGuestProfile(), crewLinks: 3 };
    const completed = completeQuest(profile, restaurants[1], "2026-07-12");

    expect(completed.points).toBe(210);
  });

  it("advances the crew when an invited friend completes their first quest", () => {
    const profile = { ...createGuestProfile(), crewLinks: 2 };

    expect(addCrewLink(profile).crewLinks).toBe(3);
  });
});
