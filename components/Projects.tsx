"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectFeature } from "./ProjectFeature";

export function Projects() {
  const projects = useQuery(api.projects.list);

  return (
    <section
      id="work"
      className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-36"
      aria-labelledby="work-heading"
    >
      <div
        className="absolute -right-32 top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/4 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-glow-orange/14 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px]">
        <h2
          id="work-heading"
          className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          Work
        </h2>
        <p className="mb-16 max-w-xl text-foreground-muted">
          Selected projects I've built and shipped.
        </p>
        {!projects ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-border" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-foreground-muted">No projects yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {projects.map((project, index) => (
              <ProjectFeature
                key={project._id}
                project={{
                  title: project.title,
                  description: project.description,
                  liveUrl: project.liveUrl,
                  sourceUrl: project.sourceUrl || null,
                  techStack: project.techStack,
                  image: project.imageUrl || "/images/placeholder.png",
                }}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
