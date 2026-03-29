import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * Get hero section content with portrait URL
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const hero = await ctx.db.query("hero").first();
    if (!hero) return null;

    // Get portrait URL if exists
    const portraitUrl = hero.portraitStorageId
      ? await ctx.storage.getUrl(hero.portraitStorageId)
      : null;

    return {
      ...hero,
      portraitUrl,
    };
  },
});

/**
 * Update or create hero section content
 */
export const upsert = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    ctaPrimaryText: v.string(),
    ctaPrimaryLink: v.string(),
    ctaSecondaryText: v.string(),
    ctaSecondaryLink: v.string(),
    portraitStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hero").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "hero_updated",
        entityType: "hero",
        entityId: existing._id,
        description: `Updated hero section`,
      });
      
      return existing._id;
    } else {
      const id = await ctx.db.insert("hero", args);
      
      // Log the activity
      await logActivity(ctx, {
        type: "hero_created",
        entityType: "hero",
        entityId: id,
        description: `Created hero section`,
      });
      
      return id;
    }
  },
});

/**
 * Generate an upload URL for portrait image
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Update the hero portrait image
 */
export const updatePortrait = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hero").first();

    if (!existing) {
      throw new Error("Hero section not found. Please save hero content first.");
    }

    // Delete old portrait if exists
    if (existing.portraitStorageId) {
      await ctx.storage.delete(existing.portraitStorageId);
    }

    // Update with new portrait
    await ctx.db.patch(existing._id, {
      portraitStorageId: args.storageId,
    });

    // Log the activity
    await logActivity(ctx, {
      type: "hero_portrait_updated",
      entityType: "hero",
      entityId: existing._id,
      description: `Updated hero portrait image`,
    });

    return existing._id;
  },
});

/**
 * Remove the hero portrait image
 */
export const removePortrait = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("hero").first();

    if (!existing) {
      throw new Error("Hero section not found.");
    }

    if (!existing.portraitStorageId) {
      return; // No portrait to remove
    }

    // Delete the portrait from storage
    await ctx.storage.delete(existing.portraitStorageId);

    // Remove the reference
    await ctx.db.patch(existing._id, {
      portraitStorageId: undefined,
    });

    // Log the activity
    await logActivity(ctx, {
      type: "hero_portrait_removed",
      entityType: "hero",
      entityId: existing._id,
      description: `Removed hero portrait image`,
    });
  },
});
