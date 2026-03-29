/**
 * Seed script to populate Convex with initial content
 * 
 * This script creates initial records for:
 * - Hero section
 * - About section
 * - Contact section
 * - Site settings
 * - Projects (with placeholder for images)
 * 
 * Run with: npx convex run scripts/seed:seed
 */

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting seed...");

    // Check if data already exists
    const existingHero = await ctx.db.query("hero").first();
    if (existingHero) {
      console.log("⚠️  Hero data already exists. Skipping seed.");
      return { success: false, message: "Data already exists" };
    }

    // Seed Hero
    console.log("Seeding hero section...");
    await ctx.db.insert("hero", {
      name: "Christian Furr",
      title: "Full Stack Developer.",
      tagline: "I build real-time systems and beautifully crafted web experiences.",
      ctaPrimaryText: "View Work",
      ctaPrimaryLink: "#work",
      ctaSecondaryText: "Email Me",
      ctaSecondaryLink: "mailto:me@christianfurr.dev",
    });

    // Seed About
    console.log("Seeding about section...");
    await ctx.db.insert("about", {
      heading: "About",
      bio: "I'm a full stack developer with an eye for polish and performance. I care about building interfaces that feel fast and intentional, and I'm especially interested in real-time systems and the infrastructure that makes them possible. I've worked across the stack at internships and on side projects, and I'm always looking for the next problem that rewards both craft and scale.",
      currentlyBuildingHeading: "Currently building",
      currentlyBuilding: [
        "Real-time collaboration and low-latency web experiences.",
        "Developer tools and dashboards that stay out of the way.",
        "Clean, accessible UIs with a focus on performance.",
      ],
    });

    // Seed Contact
    console.log("Seeding contact section...");
    await ctx.db.insert("contact", {
      heading: "Let's build something exceptional.",
      subtext: "Reach out for projects, collaboration, or a quick chat.",
    });

    // Seed Site Settings
    console.log("Seeding site settings...");
    await ctx.db.insert("siteSettings", {
      siteName: "Christian Furr - Portfolio",
      siteDescription: "Full-stack developer portfolio showcasing real-time systems and web experiences.",
      email: "me@christianfurr.dev",
      socialLinks: [
        {
          platform: "Stage-Link",
          url: "https://github.com/Stage-Link",
          label: "Stage-Link on GitHub",
        },
      ],
    });

    // Seed Projects (without images for now - add them via dashboard)
    console.log("Seeding projects...");
    await ctx.db.insert("projects", {
      title: "StageLink",
      description: "Real-time stage monitoring and ultra-low latency viewing for theater crews.",
      liveUrl: "https://thestagelink.app/",
      sourceUrl: "https://github.com/Stage-Link",
      techStack: ["Next.js", "WebRTC", "Socket.IO", "Node.js"],
      order: 0,
    });

    await ctx.db.insert("projects", {
      title: "Spymasters",
      description: "A strategy game built for quick sessions and tactical play.",
      liveUrl: "https://spymasters.christianfurr.dev/",
      techStack: ["Next.js", "TypeScript", "Tailwind"],
      order: 1,
    });

    await ctx.db.insert("projects", {
      title: "BYU Basketball Roster",
      description: "Clean roster browsing and player profiles with a minimal, focused UI.",
      liveUrl: "https://byu.christianfurr.dev/",
      sourceUrl: "https://github.com/christianfurr/byu-basketball",
      techStack: ["Next.js", "TypeScript", "Tailwind"],
      order: 2,
    });

    console.log("✅ Seed complete!");
    return { 
      success: true, 
      message: "Database seeded successfully. Now upload project images via /dashboard/projects" 
    };
  },
});
