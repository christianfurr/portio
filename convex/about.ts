import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";
import { requireAuth } from "./lib/auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("about").first();
  },
});

export const upsert = mutation({
  args: {
    heading: v.string(),
    bio: v.string(),
    currentlyBuildingHeading: v.string(),
    currentlyBuilding: v.array(v.string()),
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("about").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      await logActivity(ctx, {
        type: "about_updated",
        entityType: "about",
        entityId: existing._id,
        description: `Updated about section`,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("about", args);
      await logActivity(ctx, {
        type: "about_created",
        entityType: "about",
        entityId: id,
        description: `Created about section`,
      });
      return id;
    }
  },
});
