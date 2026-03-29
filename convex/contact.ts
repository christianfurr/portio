import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * Get contact section content
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const contact = await ctx.db.query("contact").first();
    return contact;
  },
});

/**
 * Update or create contact section content
 */
export const upsert = mutation({
  args: {
    heading: v.string(),
    subtext: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("contact").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "contact_updated",
        entityType: "contact",
        entityId: existing._id,
        description: `Updated contact section`,
      });
      
      return existing._id;
    } else {
      const id = await ctx.db.insert("contact", args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "contact_created",
        entityType: "contact",
        entityId: id,
        description: `Created contact section`,
      });
      
      return id;
    }
  },
});
