import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";

/**
 * List all projects ordered by their order field
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Get image URLs for each project
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        let imageUrl: string | null = null;
        let imageSize: number | null = null;
        let imageContentType: string | null = null;

        if (project.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(project.imageStorageId);
          const metadata = await ctx.db.system.get(project.imageStorageId);
          imageSize = metadata?.size ?? null;
          imageContentType = metadata?.contentType ?? null;
        }

        return {
          ...project,
          imageUrl,
          imageSize,
          imageContentType,
        };
      })
    );

    return projectsWithImages;
  },
});

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    liveUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Get the highest order value and add 1
    const lastProject = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("desc")
      .first();

    const order = lastProject ? lastProject.order + 1 : 0;

    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      liveUrl: args.liveUrl,
      sourceUrl: args.sourceUrl,
      techStack: args.techStack,
      imageStorageId: args.imageStorageId,
      order,
    });

    // Log the activity
    await logActivity(ctx, {
      type: "project_created",
      entityType: "project",
      entityId: projectId,
      description: `Created project: ${args.title}`,
      metadata: { techStack: args.techStack },
    });

    return projectId;
  },
});

/**
 * Update a project
 */
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    description: v.string(),
    liveUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);

    // Log the activity
    await logActivity(ctx, {
      type: "project_updated",
      entityType: "project",
      entityId: id,
      description: `Updated project: ${args.title}`,
    });
  },
});

/**
 * Update a project's image
 */
export const updateImage = mutation({
  args: {
    id: v.id("projects"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");

    // Delete old image if exists
    if (project.imageStorageId) {
      await ctx.storage.delete(project.imageStorageId);
    }

    await ctx.db.patch(args.id, { imageStorageId: args.imageStorageId });

    // Log the activity
    await logActivity(ctx, {
      type: "project_image_updated",
      entityType: "project",
      entityId: args.id,
      description: `Updated image for project: ${project.title}`,
    });
  },
});

/**
 * Delete a project and its image
 */
export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");

    // Delete the image from storage if exists
    if (project.imageStorageId) {
      await ctx.storage.delete(project.imageStorageId);
    }

    await ctx.db.delete(args.id);

    // Log the activity
    await logActivity(ctx, {
      type: "project_deleted",
      entityType: "project",
      entityId: args.id,
      description: `Deleted project: ${project.title}`,
    });
  },
});

/**
 * Reorder projects
 */
export const reorder = mutation({
  args: {
    projectIds: v.array(v.id("projects")),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.projectIds.length; i++) {
      await ctx.db.patch(args.projectIds[i], { order: i });
    }

    // Log the activity
    await logActivity(ctx, {
      type: "project_reorder",
      entityType: "project",
      description: `Reordered ${args.projectIds.length} projects`,
    });
  },
});

/**
 * Generate an upload URL for project images
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
