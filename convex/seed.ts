/**
 * Seed script to populate Convex with initial content
 * 
 * Each section is checked independently — already-seeded sections are skipped.
 * Run with: bunx convex run seed:seed
 */

import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting seed...");
    const seeded: string[] = [];
    const skipped: string[] = [];

    // --- Hero ---
    if (await ctx.db.query("hero").first()) {
      skipped.push("hero");
    } else {
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
      seeded.push("hero");
    }

    // --- About ---
    if (await ctx.db.query("about").first()) {
      skipped.push("about");
    } else {
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
      seeded.push("about");
    }

    // --- Contact ---
    if (await ctx.db.query("contact").first()) {
      skipped.push("contact");
    } else {
      console.log("Seeding contact section...");
      await ctx.db.insert("contact", {
        heading: "Let's build something exceptional.",
        subtext: "Reach out for projects, collaboration, or a quick chat.",
      });
      seeded.push("contact");
    }

    // --- Site Settings ---
    if (await ctx.db.query("siteSettings").first()) {
      skipped.push("siteSettings");
    } else {
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
      seeded.push("siteSettings");
    }

    // --- Projects ---
    if (await ctx.db.query("projects").first()) {
      skipped.push("projects");
    } else {
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
      seeded.push("projects");
    }

    // --- Stage Crew ---
    if (await ctx.db.query("stageCrew").first()) {
      skipped.push("stageCrew");
    } else {
      console.log("Seeding stage crew section...");
      await ctx.db.insert("stageCrew", {
        heading: "Stage Crew",
        bio: "Beyond the screen, I run sound and manage stages for live theatre. From mixing musicals on a Yamaha TF5 to calling cues as stage manager, I bring the same precision and problem-solving mindset to live production.",
        roles: [
          {
            role: "Sound Engineer",
            description:
              "Designed and operated live sound for multiple full-scale theatrical productions, managing wireless mics, monitor mixes, and sound effects playback.",
          },
          {
            role: "Stage Manager",
            description:
              "Called cues, coordinated cast and crew, and managed rehearsal schedules and show logistics from pre-production through closing night.",
          },
        ],
        shows: [
          { title: "High School Musical", role: "Sound" },
          { title: "Honk", role: "Sound" },
          { title: "Matilda", role: "Sound" },
          { title: "Treasure Island", role: "Sound" },
          { title: "Macbeth", role: "Sound" },
          { title: "Elf", role: "Stage Manager" },
        ],
        equipment: [
          { name: "Yamaha TF5", category: "Digital Mixing Console" },
          { name: "Allen & Heath QU-32", category: "Digital Mixing Console" },
          { name: "ETC Eos Element 2", category: "Lighting Console" },
          { name: "ETC Ion", category: "Lighting Console" },
        ],
        software: [
          { name: "QLab", proficiency: "pro" },
          { name: "TheatreMix", proficiency: "pro" },
        ],
      });
      seeded.push("stageCrew");
    }

    // --- Summary ---
    if (seeded.length === 0) {
      console.log("⚠️  Everything already seeded. Nothing to do.");
      return { success: true, seeded: [], skipped, message: "All sections already exist" };
    }

    if (skipped.length > 0) {
      console.log(`⏭️  Skipped (already exist): ${skipped.join(", ")}`);
    }
    console.log(`✅ Seeded: ${seeded.join(", ")}`);
    return { success: true, seeded, skipped, message: "Seed complete" };
  },
});

