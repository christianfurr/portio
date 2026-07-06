"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Contact() {
  const contact = useQuery(api.contact.get);
  const settings = useQuery(api.siteSettings.get);

  // Show loading or fallback while data loads
  if (!contact || !settings) {
    return (
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-24 md:py-36"
        aria-labelledby="contact-heading"
      >
        <div className="relative mx-auto max-w-[1200px] text-center">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-border" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-24 md:py-36"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/11 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/3 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-glow-red/14 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-1/4 top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-glow-royal/12 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Cue 05 · Curtain call
        </p>
        <h2
          id="contact-heading"
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          {contact.heading}
        </h2>
        <p className="mt-4 text-foreground-muted">
          {contact.subtext}
        </p>
        <a
          href={`mailto:${settings.email}`}
          className="mt-8 inline-block text-2xl font-medium text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-3xl"
          aria-label={`Email me at ${settings.email}`}
        >
          {settings.email}
        </a>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {settings.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={link.label}
            >
              {link.platform}
            </a>
          ))}
          <a
            href={`mailto:${settings.email}`}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Email me"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
