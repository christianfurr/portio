import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./lib/activity";
import { isAdmin, requireAuth } from "./lib/auth";

export const list = query({
  args: {
    showDrafts: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("asc")
      .collect();

    const showDrafts = args.showDrafts && (await isAdmin(ctx));
    const filtered = showDrafts
      ? projects
      : projects.filter((p) => !p.isDraft);

    return await Promise.all(
      filtered.map(async (project) => {
        let imageUrl: string | null = null;
        let imageSize: number | null = null;
        let imageContentType: string | null = null;

        if (project.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(project.imageStorageId);
          const metadata = await ctx.db.system.get(project.imageStorageId);
          imageSize = metadata?.size ?? null;
          imageContentType = metadata?.contentType ?? null;
        }

        return { ...project, imageUrl, imageSize, imageContentType };
      })
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    liveUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

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
      isDraft: args.isDraft,
    });

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

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    description: v.string(),
    liveUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);

    await logActivity(ctx, {
      type: "project_updated",
      entityType: "project",
      entityId: id,
      description: `Updated project: ${args.title}`,
    });
  },
});

export const updateImage = mutation({
  args: { id: v.id("projects"), imageStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");

    if (project.imageStorageId) {
      await ctx.storage.delete(project.imageStorageId);
    }
    await ctx.db.patch(args.id, { imageStorageId: args.imageStorageId });

    await logActivity(ctx, {
      type: "project_image_updated",
      entityType: "project",
      entityId: args.id,
      description: `Updated image for project: ${project.title}`,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");

    if (project.imageStorageId) {
      await ctx.storage.delete(project.imageStorageId);
    }
    await ctx.db.delete(args.id);

    await logActivity(ctx, {
      type: "project_deleted",
      entityType: "project",
      entityId: args.id,
      description: `Deleted project: ${project.title}`,
    });
  },
});

export const reorder = mutation({
  args: { projectIds: v.array(v.id("projects")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    for (let i = 0; i < args.projectIds.length; i++) {
      await ctx.db.patch(args.projectIds[i], { order: i });
    }
    await logActivity(ctx, {
      type: "project_reorder",
      entityType: "project",
      description: `Reordered ${args.projectIds.length} projects`,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
