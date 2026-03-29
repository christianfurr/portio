import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * Get site settings
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    return settings;
  },
});

/**
 * Update or create site settings
 */
export const upsert = mutation({
  args: {
    siteName: v.string(),
    siteDescription: v.string(),
    email: v.string(),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
        label: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "settings_updated",
        entityType: "siteSettings",
        entityId: existing._id,
        description: `Updated site settings`,
      });
      
      return existing._id;
    } else {
      const id = await ctx.db.insert("siteSettings", args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "settings_created",
        entityType: "siteSettings",
        entityId: id,
        description: `Created site settings`,
      });
      
      return id;
    }
  },
});
