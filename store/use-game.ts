"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addCrewLink, completeDailyQuest, createGuestProfile, redeemReferral } from "@/lib/quest";
import type { Craving, PlayerProfile, Quest, Restaurant } from "@/lib/types";

interface GameState {
  profile: PlayerProfile;
  onboardingComplete: boolean;
  activeQuest: Quest | null;
  selectedRestaurantId: string | null;
  assignQuest: (restaurant: Restaurant, craving: Craving) => void;
  selectRestaurant: (id: string | null) => void;
  startRoute: (restaurant: Restaurant, usedRoam?: boolean) => void;
  finishQuest: (restaurant: Restaurant) => void;
  finishOnboarding: () => void;
  applyReferral: (code: string) => void;
  demoCompleteCrewLink: () => void;
  signUp: (name: string) => void;
  resetDemo: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      profile: createGuestProfile(),
      onboardingComplete: false,
      activeQuest: null,
      selectedRestaurantId: null,
      assignQuest: (restaurant, craving) => set({
        activeQuest: { restaurantId: restaurant.id, craving, status: "assigned", usedRoam: false },
        selectedRestaurantId: restaurant.id,
      }),
      selectRestaurant: (id) => set({ selectedRestaurantId: id }),
      startRoute: (restaurant, usedRoam = false) => set((state) => ({
        activeQuest: {
          restaurantId: restaurant.id,
          craving: state.activeQuest?.craving ?? restaurant.cravings[0],
          status: "en-route",
          usedRoam,
        },
        selectedRestaurantId: restaurant.id,
      })),
      finishQuest: (restaurant) => set((state) => ({
        profile: completeDailyQuest(state.profile, restaurant, new Date().toISOString().slice(0, 10)),
        activeQuest: state.activeQuest ? { ...state.activeQuest, status: "completed" } : null,
      })),
      finishOnboarding: () => set({ onboardingComplete: true }),
      applyReferral: (code) => set((state) => ({ profile: redeemReferral(state.profile, code) })),
      demoCompleteCrewLink: () => set((state) => ({ profile: addCrewLink(state.profile) })),
      signUp: (name) => set((state) => ({
        profile: { ...state.profile, name: name.trim() || "Lunch Explorer", signedUp: true },
        onboardingComplete: true,
      })),
      resetDemo: () => set({
        profile: createGuestProfile(),
        onboardingComplete: false,
        activeQuest: null,
        selectedRestaurantId: null,
      }),
    }),
    { name: "questlunch-game-v1" },
  ),
);
