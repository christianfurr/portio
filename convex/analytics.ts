import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

/**
 * Get comprehensive content statistics
 */
export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all photos
    const photos = await ctx.db.query("photos").collect();
    
    // Get all projects
    const projects = await ctx.db.query("projects").collect();
    
    // Calculate total storage used
    let totalStorageBytes = 0;
    
    // Add up photo sizes
    for (const photo of photos) {
      const metadata = await ctx.db.system.get(photo.storageId);
      if (metadata) {
        totalStorageBytes += metadata.size;
      }
    }
    
    // Add up project image sizes
    for (const project of projects) {
      if (project.imageStorageId) {
        const metadata = await ctx.db.system.get(project.imageStorageId);
        if (metadata) {
          totalStorageBytes += metadata.size;
        }
      }
    }
    
    // Convert bytes to MB
    const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);
    
    // Get latest uploads (last 5 items sorted by creation time)
    const latestPhotos = await ctx.db
      .query("photos")
      .order("desc")
      .take(3);
    
    const latestProjects = await ctx.db
      .query("projects")
      .order("desc")
      .take(2);
    
    // Get photos with URLs for latest uploads
    const latestPhotosWithUrls = await Promise.all(
      latestPhotos.map(async (photo) => {
        const url = await ctx.storage.getUrl(photo.storageId);
        return { ...photo, url, type: "photo" as const };
      })
    );
    
    // Get projects with URLs for latest uploads
    const latestProjectsWithUrls = await Promise.all(
      latestProjects.map(async (project) => {
        let imageUrl: string | null = null;
        if (project.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(project.imageStorageId);
        }
        return { ...project, imageUrl, type: "project" as const };
      })
    );
    
    return {
      photoCount: photos.length,
      projectCount: projects.length,
      totalStorageMB,
      totalStorageBytes,
      latestUploads: [
        ...latestPhotosWithUrls,
        ...latestProjectsWithUrls,
      ].sort((a, b) => b._creationTime - a._creationTime).slice(0, 5),
    };
  },
});

/**
 * Get activity feed with optional filtering
 */
export const getActivityFeed = query({
  args: {
    limit: v.optional(v.number()),
    typeFilter: v.optional(v.string()), // Filter by activity type
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    // Get activities ordered by creation time (most recent first)
    let activities = await ctx.db
      .query("activityLog")
      .order("desc")
      .take(limit * 2); // Take more in case we need to filter
    
    // Apply type filter if provided
    if (args.typeFilter && args.typeFilter !== "all") {
      activities = activities.filter(activity => 
        activity.type === args.typeFilter
      );
    }
    
    // Limit to requested amount
    activities = activities.slice(0, limit);
    
    return activities;
  },
});

/**
 * Get list of all unique activity types for filtering
 */
export const getActivityTypes = query({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("activityLog").collect();
    
    // Get unique types
    const types = new Set(activities.map(a => a.type));
    
    return Array.from(types).sort();
  },
});

/**
 * Internal mutation to log activity - called by other mutations
 */
export const logActivity = internalMutation({
  args: {
    type: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    description: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      type: args.type,
      entityType: args.entityType,
      entityId: args.entityId,
      description: args.description,
      metadata: args.metadata,
    });
  },
});

/**
 * Helper function to format bytes to human-readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
