"use client";

import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { PortraitWithEgg } from "@/components/easter-eggs/PortraitWithEgg";
import { Parallax, ScrollAxisText } from "@/components/kinetic/Parallax";

/*
 * The feature spread: a wide measure of body copy set against a narrow
 * marginalia rail, which is the layout convention this whole design borrows
 * from. The drop cap is CSS-only (::first-letter on the first paragraph) so it
 * survives whatever markdown the CMS produces.
 */
export function AboutSpread() {
  const about = useQuery(api.about.get);

  if (about === undefined) {
    return (
      <section id="about" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-[40vh] w-full animate-pulse bg-background-alt" />
        </div>
      </section>
    );
  }

  if (about === null || about.isDraft) return null;

  return (
    <section id="about" className="relative px-5 py-24 md:px-10 md:py-32" aria-labelledby="about-heading">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Section 02</span>
          <span className="type-marginalia text-foreground-muted">Biography</span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-4">
            <Parallax distance={-40}>
              <figure>
                <PortraitWithEgg />
                <figcaption className="type-marginalia mt-3 flex justify-between text-foreground-muted">
                  <span>Fig. 09</span>
                  <span>Off duty</span>
                </figcaption>
              </figure>
            </Parallax>
          </div>

          <div className="md:col-span-8">
            <KineticHeading
              as="h2"
              text={about.heading}
              className="type-display text-foreground"
              wght={[200, 620]}
              soft={[100, 24]}
              wonk={[1, 0]}
            />

            <div className="broadsheet-copy mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted md:columns-2 md:gap-10">
              <ReactMarkdown
                components={{
                  a: ({ href, children }: React.ComponentPropsWithoutRef<"a">) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline decoration-1 underline-offset-4"
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }: React.ComponentPropsWithoutRef<"p">) => (
                    <p className="mb-4 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }: React.ComponentPropsWithoutRef<"strong">) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  em: ({ children }: React.ComponentPropsWithoutRef<"em">) => (
                    <em className="italic">{children}</em>
                  ),
                }}
              >
                {about.bio}
              </ReactMarkdown>
            </div>

            {about.currentlyBuilding.length > 0 ? (
              <div className="mt-12 border-t border-border pt-6">
                <h3 className="type-marginalia text-foreground-muted">
                  {about.currentlyBuildingHeading}
                </h3>
                <ul role="list" className="mt-5 space-y-3">
                  {about.currentlyBuilding.map((item, index) => (
                    <li key={index} className="flex items-baseline gap-4">
                      <span className="type-marginalia text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <ScrollAxisText
                        className="font-display text-2xl text-foreground md:text-3xl"
                        wght={[300, 560]}
                        wonk={[1, 0]}
                        soft={[80, 10]}
                      >
                        {item}
                      </ScrollAxisText>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
