import { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireAuth(ctx: MutationCtx | QueryCtx): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  // If ADMIN_EMAIL is set, restrict access to that address only.
  // Set via: npx convex env set ADMIN_EMAIL "you@example.com"
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && identity.email !== adminEmail) {
    throw new Error("Not authorized");
  }
}

export async function getAuthenticatedUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}
