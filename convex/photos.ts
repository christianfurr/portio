import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";
import { isAdmin, requireAuth } from "./lib/auth";

export const list = query({
  args: {
    showDrafts: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_order")
      .order("asc")
      .collect();

    const showDrafts = args.showDrafts && (await isAdmin(ctx));
    const filtered = showDrafts
      ? photos
      : photos.filter((p) => !p.isDraft);

    return await Promise.all(
      filtered.map(async (photo) => {
        const url = await ctx.storage.getUrl(photo.storageId);
        const fileMetadata = await ctx.db.system.get(photo.storageId);
        return {
          ...photo,
          url,
          fileSize: fileMetadata?.size ?? null,
          contentType: fileMetadata?.contentType ?? null,
        };
      })
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    alt: v.string(),
    caption: v.optional(v.string()),
    isDraft: v.optional(v.boolean()),
    blurDataUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const lastPhoto = await ctx.db
      .query("photos")
      .withIndex("by_order")
      .order("desc")
      .first();

    const order = lastPhoto ? lastPhoto.order + 1 : 0;

    const photoId = await ctx.db.insert("photos", {
      storageId: args.storageId,
      alt: args.alt,
      caption: args.caption,
      order,
      isDraft: args.isDraft,
      blurDataUrl: args.blurDataUrl,
    });

    await logActivity(ctx, {
      type: "photo_upload",
      entityType: "photo",
      entityId: photoId,
      description: `Uploaded photo: ${args.alt}`,
      metadata: { caption: args.caption },
    });

    return photoId;
  },
});

export const update = mutation({
  args: {
    id: v.id("photos"),
    alt: v.string(),
    caption: v.optional(v.string()),
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error("Photo not found");

    await ctx.db.patch(args.id, {
      alt: args.alt,
      caption: args.caption,
      isDraft: args.isDraft,
    });

    await logActivity(ctx, {
      type: "photo_update",
      entityType: "photo",
      entityId: args.id,
      description: `Updated photo: ${args.alt}`,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error("Photo not found");

    await ctx.storage.delete(photo.storageId);
    await ctx.db.delete(args.id);

    await logActivity(ctx, {
      type: "photo_delete",
      entityType: "photo",
      entityId: args.id,
      description: `Deleted photo: ${photo.alt}`,
    });
  },
});

export const reorder = mutation({
  args: { photoIds: v.array(v.id("photos")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    for (let i = 0; i < args.photoIds.length; i++) {
      await ctx.db.patch(args.photoIds[i], { order: i });
    }
    await logActivity(ctx, {
      type: "photo_reorder",
      entityType: "photo",
      description: `Reordered ${args.photoIds.length} photos`,
    });
  },
});

export const replaceFile = mutation({
  args: { id: v.id("photos"), newStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error("Photo not found");

    const oldStorageId = photo.storageId;
    await ctx.db.patch(args.id, { storageId: args.newStorageId });
    await ctx.storage.delete(oldStorageId);

    await logActivity(ctx, {
      type: "photo_optimized",
      entityType: "photo",
      entityId: args.id,
      description: `Optimized photo: ${photo.alt}`,
    });
  },
});
