import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * List all photos ordered by their order field, including file metadata
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Get URLs and file metadata for each photo
    const photosWithDetails = await Promise.all(
      photos.map(async (photo) => {
        const url = await ctx.storage.getUrl(photo.storageId);
        
        // Get file metadata from _storage system table
        const fileMetadata = await ctx.db.system.get(photo.storageId);
        
        return {
          ...photo,
          url,
          fileSize: fileMetadata?.size ?? null,
          contentType: fileMetadata?.contentType ?? null,
        };
      })
    );

    return photosWithDetails;
  },
});

/**
 * Generate an upload URL for file storage
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Create a new photo entry after upload
 */
export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    alt: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the highest order value and add 1
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
    });

    // Log the activity
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

/**
 * Update a photo's metadata
 */
export const update = mutation({
  args: {
    id: v.id("photos"),
    alt: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (!photo) {
      throw new Error("Photo not found");
    }

    await ctx.db.patch(args.id, {
      alt: args.alt,
      caption: args.caption,
    });

    // Log the activity
    await logActivity(ctx, {
      type: "photo_update",
      entityType: "photo",
      entityId: args.id,
      description: `Updated photo: ${args.alt}`,
    });
  },
});

/**
 * Delete a photo and its file from storage
 */
export const remove = mutation({
  args: {
    id: v.id("photos"),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (!photo) {
      throw new Error("Photo not found");
    }

    // Delete the file from storage
    await ctx.storage.delete(photo.storageId);

    // Delete the photo record
    await ctx.db.delete(args.id);

    // Log the activity
    await logActivity(ctx, {
      type: "photo_delete",
      entityType: "photo",
      entityId: args.id,
      description: `Deleted photo: ${photo.alt}`,
    });
  },
});

/**
 * Reorder photos by updating their order values
 */
export const reorder = mutation({
  args: {
    photoIds: v.array(v.id("photos")),
  },
  handler: async (ctx, args) => {
    // Update each photo's order based on its position in the array
    for (let i = 0; i < args.photoIds.length; i++) {
      await ctx.db.patch(args.photoIds[i], { order: i });
    }

    // Log the activity
    await logActivity(ctx, {
      type: "photo_reorder",
      entityType: "photo",
      description: `Reordered ${args.photoIds.length} photos`,
    });
  },
});

/**
 * Replace a photo's file with a new optimized version
 */
export const replaceFile = mutation({
  args: {
    id: v.id("photos"),
    newStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (!photo) {
      throw new Error("Photo not found");
    }

    const oldStorageId = photo.storageId;

    // Update the photo with new storage ID
    await ctx.db.patch(args.id, {
      storageId: args.newStorageId,
    });

    // Delete the old file from storage
    await ctx.storage.delete(oldStorageId);

    // Log the activity
    await logActivity(ctx, {
      type: "photo_optimized",
      entityType: "photo",
      entityId: args.id,
      description: `Optimized photo: ${photo.alt}`,
    });
  },
});
