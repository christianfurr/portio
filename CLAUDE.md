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
│   ├── broadsheet/             # Public page sections (Broadsheet design)
│   │   ├── Masthead.tsx        # Opening spread + anime.js load sequence
│   │   ├── WorkReel.tsx        # Pinned horizontal project reel
│   │   ├── AboutSpread.tsx     # Feature spread w/ drop cap
│   │   ├── CreditsLedger.tsx   # Animated counters + credits
│   │   ├── StillsSection.tsx   # Paper→ink act break, photo contact sheet
│   │   ├── ContactColophon.tsx # Closing statement + colophon (attribution)
│   │   └── BroadsheetNav.tsx   # Masthead rule nav, inverts over dark acts
│   ├── kinetic/                # Reusable motion primitives
│   │   ├── KineticHeading.tsx  # Per-glyph reveal + variable-font axes
│   │   ├── RevealFigure.tsx    # Clip-path reveal + scroll drift
│   │   ├── Magnetic.tsx        # Pointer-following buttons
│   │   ├── TiltCard.tsx        # Cursor-reactive 3D tilt
│   │   ├── Parallax.tsx        # Parallax + ScrollAxisText
│   │   ├── Counter.tsx         # Scroll-triggered counters
│   │   └── SmoothScroll.tsx    # Lenis provider
│   ├── ui/skiper-ui/           # Vendored Skiper registry (ESLint-ignored)
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
| `/` | Public | Main portfolio homepage (Broadsheet) |
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

## Design Theme — "Broadsheet" (public site)

Kinetic editorial: warm paper (`#f2efe9`), near-black ink (`#0b0b0c`), vermillion accent (`#ff3b14` on ink / `#c42b0c` on paper). Fonts: Fraunces (display), Inter (body), JetBrains Mono (marginalia, figure numbers, tags).

**Two themes live in `app/globals.css` and must stay separate:**

| Scope | Theme | Used by |
|---|---|---|
| `:root` | Legacy dark navy/blue | `/dashboard/*` — do NOT repurpose |
| `.editorial` | Broadsheet paper | Public pages |
| `.act-ink` | Broadsheet inverted | Dark sections + `/photography` |

The public site inverts paper→ink mid-scroll. `.act-ink` flips the *same* semantic tokens (`--background`, `--foreground`, `--border`, `--accent`), so write components once against semantic names and they invert for free. `.act-ink-tokens` flips tokens without painting a surface (used by the fixed nav). The dashboard depends heavily on the legacy tokens (`background-alt` alone in 24 places) — never move the new palette onto `:root`.

Variable-font axes (`--fv-wght`, `--fv-soft`, `--fv-wonk`, `--fv-opsz`) are registered via `@property` in globals.css; unregistered custom properties jump instead of interpolating. Fraunces must load `axes: ["SOFT","WONK","opsz"]` in `app/layout.tsx` or there is nothing to animate.

**Share card + icons** (`app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`) are the same palette rendered by Satori. Satori cannot use `next/font` and **cannot read woff2** — fonts come from `@fontsource/*` `.woff` files via `lib/og-fonts.ts`. It also has no block layout: any element with more than one child needs an explicit `display: flex` or it silently misrenders. Icons paint a paper field rather than sitting on transparent, which is what made the old white-on-transparent favicon vanish on light tab bars.

Work cards are `.act-ink` plates on paper. Each shows its real screenshot inside `DeviceFrame` (browser-window mockup). Project captures are **7680×4320 — exactly 16:9**; frame them at any other ratio and `object-cover` silently crops them. StageLink previously rendered `StageLinkMonitor`, an animated camera-feed demo (StageLink is camera monitoring, not audio); it was dropped when the real screenshot went in — recover with `git show 8ef6133:components/StageLinkMonitor.tsx`.

## Motion Stack

Each library has a distinct job — do not collapse them into one:

| Library | Owns | Entry point |
|---|---|---|
| **anime.js v4** | Authored timelines: page-load choreography, glyph staggers, axis settles | `createTimeline`, `stagger`, also `morphTo`/`createDrawable` |
| **Motion** | Continuous + physics: scroll linkage, springs, magnetism, tilt, parallax | `motion/react` |
| **Lenis** | Smooth scroll everything else rides on | `components/kinetic/SmoothScroll.tsx` |
| **Skiper UI** | `TextRoll`, `ProgressiveBlur` | `components/ui/skiper-ui/` |

Import from `motion/react`, never `framer-motion` — they are the same library and mixing them ships two copies. Skiper's free tier **requires attribution**; it lives in the colophon in `ContactColophon.tsx`. `components/ui/skiper-ui/**` is vendored and ESLint-ignored — don't hand-edit it, re-add from the registry.

Primitives are in `components/kinetic/`, page sections in `components/broadsheet/`.

## Motion Footguns (all hit in practice — see git history)

- **Never observe an element you also clip.** `clip-path: inset(100%)` gives zero visible area, so IntersectionObserver reports ratio 0 and the element never reveals — it hides itself permanently. Observe an unclipped wrapper, clip an inner layer (`RevealFigure.tsx`).
- **Don't guard animation effects with a `hasRun` ref.** StrictMode does mount → cleanup → mount; the guard blocks the second run while cleanup already paused the timeline, leaving it frozen. `revert()` on cleanup and let it re-run.
- **`useScroll({target})` needs its ref mounted on the same render as the hook.** A conditionally-rendered target throws "defined but not hydrated", and that invariant aborts every remaining effect in the commit — symptoms appear in unrelated components.
- **Never gate page chrome on a Convex query.** Hide elements only after JS is confirmed running (layout effect), so a slow or failed query can't leave the page blank.

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
