# Portio - AI Guidelines

Personal portfolio site with integrated CMS dashboard. Built with Next.js 16 + Convex backend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Backend | Convex (real-time database + functions) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Analytics | Vercel Analytics |
| Package Manager | Bun |

## Directory Structure

```
portio/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage (portfolio)
│   ├── ConvexClientProvider.tsx # Convex React provider
│   ├── dashboard/              # CMS admin panel
│   │   ├── layout.tsx          # Dashboard layout with auth + nav
│   │   ├── page.tsx            # Overview page
│   │   ├── hero/               # Edit hero section
│   │   ├── about/              # Edit about section
│   │   ├── projects/           # Manage projects
│   │   ├── photos/             # Manage photography gallery
│   │   ├── contact/            # Edit contact section
│   │   └── settings/           # Site-wide settings
│   ├── photography/            # Public photography gallery page
│   ├── terminal/               # Easter egg terminal page
│   └── type/                   # Easter egg typing page
│
├── components/                 # React components
│   ├── Hero.tsx                # Homepage hero section
│   ├── Projects.tsx            # Projects showcase section
│   ├── About.tsx               # About me section
│   ├── PhotographySection.tsx  # Photography preview section
│   ├── Contact.tsx             # Contact section
│   ├── Navbar.tsx              # Site navigation
│   ├── Footer.tsx              # Site footer
│   ├── ProjectFeature.tsx      # Individual project card
│   ├── dashboard/              # Reusable dashboard UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Skeleton.tsx
│   │   ├── StatsCard.tsx
│   │   ├── Toast.tsx
│   │   └── ToastProvider.tsx
│   └── easter-eggs/            # Hidden features
│       ├── EasterEggsProvider.tsx  # Context for easter eggs
│       ├── KonamiHandler.tsx       # Konami code detector
│       ├── SnakeModal.tsx          # Snake game
│       └── ...                     # Other easter eggs
│
├── convex/                     # Convex backend
│   ├── schema.ts               # Database schema (all tables)
│   ├── hero.ts                 # Hero section CRUD
│   ├── about.ts                # About section CRUD
│   ├── contact.ts              # Contact section CRUD
│   ├── projects.ts             # Projects CRUD + ordering
│   ├── photos.ts               # Photos CRUD + file storage
│   ├── siteSettings.ts         # Site settings CRUD
│   ├── analytics.ts            # Activity log queries
│   ├── seed.ts                 # Database seeding
│   ├── lib/
│   │   └── activity.ts         # Activity logging helper
│   └── _generated/
│       └── ai/
│           └── guidelines.md   # Convex-specific AI guidelines (READ THIS)
│
├── lib/                        # Utility libraries
│   ├── seo.ts                  # SEO defaults and site URL
│   ├── image-optimization.ts   # Image processing utilities
│   └── favicon-icon.ts         # Favicon generation
│
├── scripts/                    # Build/migration scripts
│   ├── optimize-photos.ts      # Photo optimization script
│   └── migrate-photos.ts       # Photo migration script
│
├── data/                       # Static data files
│   ├── photography.ts          # Photography metadata
│   └── projects.ts             # Project data
│
└── public/
    └── images/                 # Static images
```

## Convex Backend

> **Important:** Always read `convex/_generated/ai/guidelines.md` first for Convex-specific patterns and API usage.

### Database Schema (`convex/schema.ts`)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `photos` | Photography gallery | `storageId`, `alt`, `caption`, `order` |
| `projects` | Project showcase | `title`, `description`, `liveUrl`, `techStack`, `order` |
| `hero` | Hero section (single doc) | `name`, `title`, `tagline`, CTAs |
| `about` | About section (single doc) | `heading`, `bio`, `currentlyBuilding` |
| `contact` | Contact section (single doc) | `heading`, `subtext` |
| `siteSettings` | Site config (single doc) | `siteName`, `email`, `socialLinks` |
| `activityLog` | Tracks all content changes | `type`, `entityType`, `description` |
| `userConsent` | GDPR consent tracking | `sessionId`, `analyticsConsent` |

### Convex Function Files

| File | Functions | Purpose |
|------|-----------|---------|
| `hero.ts` | `get`, `upsert` | Hero section content |
| `about.ts` | `get`, `upsert` | About section content |
| `contact.ts` | `get`, `upsert` | Contact section content |
| `projects.ts` | `list`, `create`, `update`, `remove`, `reorder` | Project management |
| `photos.ts` | `list`, `create`, `update`, `remove`, `reorder`, `replaceFile`, `generateUploadUrl` | Photo gallery + file storage |
| `siteSettings.ts` | `get`, `upsert` | Site-wide settings |
| `analytics.ts` | Activity log queries | Dashboard analytics |
| `seed.ts` | Database seeding | Initial data setup |

### Backend Patterns

1. **Single-document tables**: `hero`, `about`, `contact`, `siteSettings` store one document each. Use `ctx.db.query("table").first()` to fetch.

2. **Activity logging**: All mutations log to `activityLog` via the `logActivity` helper:
   ```typescript
   import { logActivity } from "./lib/activity";
   await logActivity(ctx, {
     type: "photo_upload",
     entityType: "photo",
     entityId: photoId,
     description: `Uploaded photo: ${args.alt}`,
   });
   ```

3. **Ordered collections**: `photos` and `projects` use an `order` field with `by_order` index for drag-and-drop reordering.

4. **File storage**: Photos use Convex file storage. Pattern: `generateUploadUrl` -> upload to URL -> `create` with `storageId`.

## Frontend Architecture

### Route Structure

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Public | Main portfolio homepage |
| `/photography` | Public | Full photography gallery |
| `/terminal` | Public | Easter egg terminal |
| `/type` | Public | Easter egg typing page |
| `/dashboard` | Protected | CMS overview |
| `/dashboard/hero` | Protected | Edit hero section |
| `/dashboard/about` | Protected | Edit about section |
| `/dashboard/projects` | Protected | Manage projects |
| `/dashboard/photos` | Protected | Manage photos |
| `/dashboard/contact` | Protected | Edit contact section |
| `/dashboard/settings` | Protected | Site settings |

### Component Patterns

1. **Data fetching**: Components use `useQuery` from Convex React:
   ```typescript
   const hero = useQuery(api.hero.get);
   ```

2. **Client components**: Components using Convex hooks must be `"use client"`.

3. **Loading states**: Return skeleton/placeholder when query returns `undefined`.

4. **Dashboard auth**: Convex Auth (Password provider). Sign-up is restricted to `ADMIN_EMAIL` (Convex env var), and all mutations call `requireAuth` from `convex/lib/auth.ts`. Middleware protects `/dashboard/*` routes. To run authenticated Convex CLI commands: `bunx convex run <fn> --identity '{"email":"<ADMIN_EMAIL>"}'`.

### Key Component Locations

| Component | File | Notes |
|-----------|------|-------|
| Convex Provider | `app/ConvexClientProvider.tsx` | Wraps app with Convex |
| Easter Eggs Context | `components/easter-eggs/EasterEggsProvider.tsx` | Manages easter egg state |
| Toast System | `components/dashboard/ToastProvider.tsx` | Dashboard notifications |
| SEO Config | `lib/seo.ts` | Site metadata defaults |

## Development Commands

```bash
bun dev              # Start dev server
bun build            # Production build
bun lint             # Run ESLint
bun optimize-photos  # Run photo optimization script
bun migrate-photos   # Run photo migration script
npx convex dev       # Start Convex dev server
npx convex deploy    # Deploy Convex to production
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO (defaults to christianfurr.dev) |
| `ADMIN_EMAIL` | (Convex env, not .env) Only account allowed to sign up / mutate |

## Design Theme

"House lights down" — warm theater-black with tungsten-amber accent. Tokens in `app/globals.css`. Fonts: Fraunces (h1–h3, global CSS rule), Inter (body), JetBrains Mono (cue labels, tech tags). Sections open with `CueLabel` (cue-sheet eyebrows). StageLink's project card renders the animated `StageLinkMonitor` instead of a screenshot.

## Quick Reference

### Adding a new section to the homepage

1. Create Convex table in `convex/schema.ts`
2. Create Convex functions in `convex/{section}.ts` (follow `hero.ts` pattern)
3. Create component in `components/{Section}.tsx`
4. Add to `app/page.tsx`
5. Create dashboard page in `app/dashboard/{section}/page.tsx`

### Adding a new project/photo

Use the dashboard at `/dashboard/projects` or `/dashboard/photos`, or call Convex mutations directly.

### Modifying Convex schema

See the `convex-migration-helper` skill for safe schema migrations. Load with:
```
npx convex ai-files install
```
