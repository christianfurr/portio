import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";
import { requireAuth } from "./lib/auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contact").first();
  },
});

export const upsert = mutation({
  args: {
    heading: v.string(),
    subtext: v.string(),
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("contact").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      await logActivity(ctx, {
        type: "contact_updated",
        entityType: "contact",
        entityId: existing._id,
        description: `Updated contact section`,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("contact", args);
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
