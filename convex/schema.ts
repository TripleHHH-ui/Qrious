import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activations: defineTable({
    visitorId: v.string(),
    event: v.union(
      v.literal("landing_viewed"),
      v.literal("quest_assigned"),
      v.literal("quest_started"),
      v.literal("quest_completed"),
      v.literal("referral_shared"),
    ),
    referralCode: v.optional(v.string()),
    craving: v.optional(v.string()),
    restaurantId: v.optional(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_visitor_event", ["visitorId", "event"])
    .index("by_event", ["event"]),
});
