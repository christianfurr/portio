import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const now = Date.now();
    return sessions
      .map((s) => ({
        _id: s._id,
        _creationTime: s._creationTime,
        expirationTime: s.expirationTime,
        isExpired: s.expirationTime < now,
      }))
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const revoke = mutation({
  args: { sessionId: v.id("authSessions") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(args.sessionId);
  },
});

export const revokeAll = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return sessions.length;
  },
});
