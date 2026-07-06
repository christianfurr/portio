"use client";

import { CueLabel } from "@/components/CueLabel";
import { PortraitWithEgg } from "@/components/easter-eggs/PortraitWithEgg";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ReactMarkdown from "react-markdown";

export function About() {
  const about = useQuery(api.about.get);

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

  // Section hidden by admin
  if (about.isDraft) return null;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background-alt px-6 py-24 md:py-36"
      aria-labelledby="about-heading"
    >
      <div
        className="absolute -left-24 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-glow-ember/14 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-1/4 h-[360px] w-[360px] rounded-full bg-glow-amber/12 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <PortraitWithEgg />
          <div className="max-w-xl">
            <CueLabel cue="02" label="Spotlight" />
            <h2
              id="about-heading"
              className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {about.heading}
            </h2>
            <div className="mt-4 text-foreground-muted leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ href, children }: React.ComponentPropsWithoutRef<"a">) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }: React.ComponentPropsWithoutRef<"p">) => (
                    <p className="text-foreground-muted leading-relaxed mb-3 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }: React.ComponentPropsWithoutRef<"strong">) => (
                    <strong className="text-foreground font-semibold">{children}</strong>
                  ),
                  em: ({ children }: React.ComponentPropsWithoutRef<"em">) => (
                    <em className="italic">{children}</em>
                  ),
                }}
              >
                {about.bio}
              </ReactMarkdown>
            </div>
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
