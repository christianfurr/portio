export type Project = {
  title: string;
  description: string;
  liveUrl: string;
  sourceUrl: string | null;
  techStack: string[];
  image: string;
};

export const projects: Project[] = [
  {
    title: "StageLink",
    description:
      "Real-time stage monitoring and ultra-low latency viewing for theater crews.",
    liveUrl: "https://thestagelink.app/",
    sourceUrl: "https://github.com/Stage-Link",
    techStack: ["Next.js", "WebRTC", "Socket.IO", "Node.js"],
    image: "/images/stagelink.png",
  },
  {
    title: "Spymasters",
    description: "A strategy game built for quick sessions and tactical play.",
    liveUrl: "https://spymasters.christianfurr.dev/",
    sourceUrl: null,
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    image: "/images/spymasters.png",
  },
  {
    title: "BYU Basketball Roster",
    description:
      "Clean roster browsing and player profiles with a minimal, focused UI.",
    liveUrl: "https://byu.christianfurr.dev/",
    sourceUrl: "https://github.com/christianfurr/byu-basketball",
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    image: "/images/byu-roster.png",
  },
];
