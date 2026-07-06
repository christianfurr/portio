import { MutationCtx } from "../_generated/server";

/**
 * Helper function to log activity from any mutation
 * This is a wrapper around the logActivity internal mutation
 */
export async function logActivity(
  ctx: MutationCtx,
  options: {
    type: string;
    description: string;
    entityType?: string;
    entityId?: string;
    metadata?: unknown;
  }
) {
  await ctx.db.insert("activityLog", {
    type: options.type,
    entityType: options.entityType,
    entityId: options.entityId,
    description: options.description,
    metadata: options.metadata,
  });
}
