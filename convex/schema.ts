import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Photography gallery
  photos: defineTable({
    storageId: v.id("_storage"),
    alt: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Projects showcase
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    liveUrl: v.string(),
    sourceUrl: v.optional(v.string()),
    techStack: v.array(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Hero section content (single document)
  hero: defineTable({
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    ctaPrimaryText: v.string(),
    ctaPrimaryLink: v.string(),
    ctaSecondaryText: v.string(),
    ctaSecondaryLink: v.string(),
    portraitStorageId: v.optional(v.id("_storage")),
  }),

  // About section content (single document)
  about: defineTable({
    heading: v.string(),
    bio: v.string(),
    currentlyBuildingHeading: v.string(),
    currentlyBuilding: v.array(v.string()),
  }),

  // Contact section content (single document)
  contact: defineTable({
    heading: v.string(),
    subtext: v.string(),
  }),

  // Site-wide settings (single document)
  siteSettings: defineTable({
    siteName: v.string(),
    siteDescription: v.string(),
    email: v.string(),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
        label: v.string(),
      })
    ),
  }),

  // Activity log - tracks all content changes and uploads
  activityLog: defineTable({
    type: v.string(), // "photo_upload", "project_created", "hero_updated", etc.
    entityType: v.optional(v.string()), // "photo", "project", "hero", etc.
    entityId: v.optional(v.string()), // ID of the entity
    description: v.string(), // Human-readable description
    metadata: v.optional(v.any()), // Store extra context
  }).index("by_type", ["type"]),

  // User consent tracking (for future GDPR compliance)
  userConsent: defineTable({
    sessionId: v.string(), // Anonymous session ID
    analyticsConsent: v.boolean(),
    ipAddress: v.optional(v.string()), // Hashed for privacy
    consentedAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),
});
