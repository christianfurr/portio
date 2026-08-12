"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { Magnetic } from "@/components/kinetic/Magnetic";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

/*
 * Back page: the call to action set as a full-bleed closing statement, then the
 * colophon — the printed-matter convention of ending on how the thing was made.
 * The colophon is also where the Skiper UI attribution lives, which their free
 * tier requires.
 */
export function ContactColophon() {
  const contact = useQuery(api.contact.get);
  const settings = useQuery(api.siteSettings.get);

  const isLoading = contact === undefined || settings === undefined;

  return (
    <footer
      id="contact"
      className="act-ink relative overflow-hidden px-5 pb-10 pt-24 md:px-10 md:pt-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Section 05</span>
          <span className="type-marginalia text-accent">Get in touch</span>
        </div>
        <div className="h-px w-full bg-border" />

        {isLoading ? (
          <div className="mt-16 h-[38vh] w-full animate-pulse bg-background-alt" />
        ) : (
          <>
            <div className="mt-14 md:mt-20">
              <KineticHeading
                as="h2"
                text={contact?.heading ?? "Let's build something"}
                className="type-masthead text-foreground"
                wght={[200, 700]}
                soft={[100, 14]}
                wonk={[1, 0]}
                stride={20}
              />
              <p className="type-lede mt-8 max-w-xl text-foreground-muted">
                {contact?.subtext}
              </p>
            </div>

            {settings ? (
              <div className="mt-14 flex flex-col gap-10 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="type-marginalia text-foreground-muted">Email</span>
                  <Magnetic strength={14} className="mt-3 block">
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-display text-3xl text-foreground underline decoration-1 underline-offset-8 transition-colors hover:text-accent md:text-5xl"
                    >
                      {settings.email}
                    </a>
                  </Magnetic>
                </div>

                <ul role="list" className="flex flex-wrap gap-x-8 gap-y-4">
                  {settings.socialLinks.map((link) => (
                    <li key={link.platform}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="type-marginalia text-foreground transition-colors hover:text-accent"
                      >
                        <TextRoll>{link.platform}</TextRoll>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

        {/* Colophon */}
        <div className="mt-20 border-t border-border pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <p className="type-marginalia max-w-md text-foreground-muted">
              Set in Fraunces, Inter and JetBrains Mono. Built with Next.js and
              Convex. Motion by Motion and anime.js. Components from{" "}
              <a
                href="https://skiper-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Skiper UI
              </a>
              .
            </p>
            <span className="type-marginalia text-foreground-muted">
              © {new Date().getFullYear()} Christian Furr
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
