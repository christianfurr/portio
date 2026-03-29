"use client";

import { PortraitWithEgg } from "@/components/easter-eggs/PortraitWithEgg";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function About() {
  const about = useQuery(api.about.get);

  // Show loading or fallback while data loads
  if (!about) {
    return (
      <section
        id="about"
        className="relative overflow-hidden bg-background-alt px-6 py-24 md:py-36"
        aria-labelledby="about-heading"
      >
        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <PortraitWithEgg />
            <div className="max-w-xl">
              <div className="h-10 w-32 animate-pulse rounded bg-border" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-border" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-border" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background-alt px-6 py-24 md:py-36"
      aria-labelledby="about-heading"
    >
      <div
        className="absolute -left-24 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-glow-pink/14 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-1/4 h-[360px] w-[360px] rounded-full bg-glow-orange/12 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <PortraitWithEgg />
          <div className="max-w-xl">
            <h2
              id="about-heading"
              className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {about.heading}
            </h2>
            <p className="mt-4 text-foreground-muted leading-relaxed">
              {about.bio}
            </p>
            {about.currentlyBuilding.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
                  {about.currentlyBuildingHeading}
                </h3>
                <ul className="mt-3 space-y-2 text-foreground" role="list">
                  {about.currentlyBuilding.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
