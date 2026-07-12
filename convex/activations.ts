import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const eventValidator = v.union(
  v.literal("landing_viewed"),
  v.literal("quest_assigned"),
  v.literal("quest_started"),
  v.literal("quest_completed"),
  v.literal("referral_shared"),
);

export const record = mutation({
  args: {
    visitorId: v.string(),
    event: eventValidator,
    referralCode: v.optional(v.string()),
    craving: v.optional(v.string()),
    restaurantId: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("activations")
      .withIndex("by_visitor_event", (q) => q.eq("visitorId", args.visitorId).eq("event", args.event))
      .first();

    if (existing) return existing._id;
    return ctx.db.insert("activations", { ...args, createdAt: Date.now() });
  },
});

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("activations").collect();
    const unique = (event: typeof rows[number]["event"]) => new Set(rows.filter((row) => row.event === event).map((row) => row.visitorId)).size;

    return {
      visitors: unique("landing_viewed"),
      assignedQuests: unique("quest_assigned"),
      startedQuests: unique("quest_started"),
      completedQuests: unique("quest_completed"),
      referralShares: unique("referral_shared"),
    };
  },
});
