export type Craving = "spicy" | "comfort" | "healthy" | "surprise";
export type QueueStatus = "green" | "amber" | "red";
export type Dietary = "vegan" | "vegetarian" | "halal" | "gluten-free";
export type BadgeId = "first-bite" | "hidden-gem-hunter" | "roam-ranger" | "streak-three";

export interface RestaurantCoupon {
  label: string;
  code: string;
  expiresAt: string;
  verified: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
  distanceKm: number;
  cravings: Craving[];
  dietary: Dietary[];
  price: 1 | 2 | 3;
  queue: QueueStatus;
  waitMinutes: number;
  hiddenGem: boolean;
  bonusPoints: number;
  match: number;
  coupon?: RestaurantCoupon;
}

export interface RestaurantFilters {
  craving: Craving | "all";
  maxDistanceKm: number;
  queues: QueueStatus[];
  maxPrice: 1 | 2 | 3;
  dietary: Dietary | "all";
  hiddenOnly: boolean;
  bonusOnly: boolean;
}

export interface PlayerProfile {
  name: string;
  points: number;
  streak: number;
  streakFreezeAvailable: boolean;
  questPasses: number;
  crewLinks: number;
  referralCode: string;
  referredBy: string | null;
  badges: BadgeId[];
  completedRestaurantIds: string[];
  streakDates: string[];
  completedDailyQuestDates: string[];
  signedUp: boolean;
}

export interface Quest {
  restaurantId: string;
  craving: Craving;
  status: "assigned" | "en-route" | "completed";
  usedRoam: boolean;
}
