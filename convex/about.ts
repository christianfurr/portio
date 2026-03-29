import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * Get about section content
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const about = await ctx.db.query("about").first();
    return about;
  },
});

/**
 * Update or create about section content
 */
export const upsert = mutation({
  args: {
    heading: v.string(),
    bio: v.string(),
    currentlyBuildingHeading: v.string(),
    currentlyBuilding: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("about").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "about_updated",
        entityType: "about",
        entityId: existing._id,
        description: `Updated about section`,
      });
      
      return existing._id;
    } else {
      const id = await ctx.db.insert("about", args);
      
      // Log the activity
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
