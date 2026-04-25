import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";
import { requireAuth } from "./lib/auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const hero = await ctx.db.query("hero").first();
    if (!hero) return null;

    const portraitUrl = hero.portraitStorageId
      ? await ctx.storage.getUrl(hero.portraitStorageId)
      : null;

    return { ...hero, portraitUrl };
  },
});

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
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("hero").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      await logActivity(ctx, {
        type: "hero_updated",
        entityType: "hero",
        entityId: existing._id,
        description: `Updated hero section`,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("hero", args);
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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const updatePortrait = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("hero").first();
    if (!existing) throw new Error("Hero section not found. Please save hero content first.");

    if (existing.portraitStorageId) {
      await ctx.storage.delete(existing.portraitStorageId);
    }
    await ctx.db.patch(existing._id, { portraitStorageId: args.storageId });

    await logActivity(ctx, {
      type: "hero_portrait_updated",
      entityType: "hero",
      entityId: existing._id,
      description: `Updated hero portrait image`,
    });

    return existing._id;
  },
});

export const removePortrait = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("hero").first();
    if (!existing) throw new Error("Hero section not found.");
    if (!existing.portraitStorageId) return;

    await ctx.storage.delete(existing.portraitStorageId);
    await ctx.db.patch(existing._id, { portraitStorageId: undefined });

    await logActivity(ctx, {
      type: "hero_portrait_removed",
      entityType: "hero",
      entityId: existing._id,
      description: `Removed hero portrait image`,
    });
  },
});
