import type { QueueStatus, Restaurant } from "./types";

export interface QueueReading {
  status: QueueStatus;
  waitMinutes: number;
  updatedAt: string;
  source: "mock" | "crowd" | "provider";
}

export interface QueueSource {
  getQueue(restaurant: Restaurant): Promise<QueueReading>;
}

// MOCK MVP ADAPTER. Swap this object for a crowd-reporting or external provider
// without changing components or restaurant matching logic.
export const mockQueueSource: QueueSource = {
  async getQueue(restaurant) {
    return {
      status: restaurant.queue,
      waitMinutes: restaurant.waitMinutes,
      updatedAt: new Date().toISOString(),
      source: "mock",
    };
  },
};
