import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * Get stage crew section content
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const stageCrew = await ctx.db.query("stageCrew").first();
    return stageCrew;
  },
});

/**
 * Update or create stage crew section content
 */
export const upsert = mutation({
  args: {
    heading: v.string(),
    bio: v.string(),
    roles: v.array(
      v.object({
        role: v.string(),
        description: v.string(),
      })
    ),
    shows: v.array(
      v.object({
        title: v.string(),
        role: v.string(),
      })
    ),
    equipment: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
      })
    ),
    software: v.array(
      v.object({
        name: v.string(),
        proficiency: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("stageCrew").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);

      await logActivity(ctx, {
        type: "stage_crew_updated",
        entityType: "stageCrew",
        entityId: existing._id,
        description: `Updated stage crew section`,
      });

      return existing._id;
    } else {
      const id = await ctx.db.insert("stageCrew", args);

      await logActivity(ctx, {
        type: "stage_crew_created",
        entityType: "stageCrew",
        entityId: id,
        description: `Created stage crew section`,
      });

      return id;
    }
  },
});
