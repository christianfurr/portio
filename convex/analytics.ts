import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { requireAuth } from "./lib/auth";

export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const photos = await ctx.db.query("photos").collect();
    const projects = await ctx.db.query("projects").collect();

    let totalStorageBytes = 0;
    for (const photo of photos) {
      const metadata = await ctx.db.system.get(photo.storageId);
      if (metadata) totalStorageBytes += metadata.size;
    }
    for (const project of projects) {
      if (project.imageStorageId) {
        const metadata = await ctx.db.system.get(project.imageStorageId);
        if (metadata) totalStorageBytes += metadata.size;
      }
    }

    const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);

    const latestPhotos = await ctx.db.query("photos").order("desc").take(3);
    const latestProjects = await ctx.db.query("projects").order("desc").take(2);

    const latestPhotosWithUrls = await Promise.all(
      latestPhotos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
        type: "photo" as const,
      }))
    );

    const latestProjectsWithUrls = await Promise.all(
      latestProjects.map(async (project) => ({
        ...project,
        imageUrl: project.imageStorageId
          ? await ctx.storage.getUrl(project.imageStorageId)
          : null,
        type: "project" as const,
      }))
    );

    return {
      photoCount: photos.length,
      projectCount: projects.length,
      totalStorageMB,
      totalStorageBytes,
      latestUploads: [...latestPhotosWithUrls, ...latestProjectsWithUrls]
        .sort((a, b) => b._creationTime - a._creationTime)
        .slice(0, 5),
    };
  },
});

export const getActivityFeed = query({
  args: {
    limit: v.optional(v.number()),
    typeFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const limit = args.limit ?? 20;

    // Use the by_type index when filtering to avoid fetching then slicing.
    if (args.typeFilter && args.typeFilter !== "all") {
      return await ctx.db
        .query("activityLog")
        .withIndex("by_type", (q) => q.eq("type", args.typeFilter!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db.query("activityLog").order("desc").take(limit);
  },
});

export const getActivityTypes = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    // Collect a reasonable sample to find all types without a full table scan.
    const recent = await ctx.db.query("activityLog").order("desc").take(500);
    const types = new Set(recent.map((a) => a.type));
    return Array.from(types).sort();
  },
});

export const logActivity = internalMutation({
  args: {
    type: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    description: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", args);
  },
});

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
