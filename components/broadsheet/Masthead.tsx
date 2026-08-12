"use client";

import { createTimeline, stagger } from "animejs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useIsomorphicLayoutEffect, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { Magnetic } from "@/components/kinetic/Magnetic";
import { Parallax } from "@/components/kinetic/Parallax";
import { RevealFigure } from "@/components/kinetic/RevealFigure";

/*
 * The opening spread.
 *
 * One anime.js timeline owns the entrance for everything except the headline
 * glyphs, which KineticHeading animates on matching delays. Keeping the
 * choreography in a single authored timeline — rather than per-element delay
 * props scattered across the tree — is what lets the rules, marginalia, figure
 * and CTAs land as one sequence instead of six unrelated fades.
 */
const BEAT = {
  rules: 0.15,
  eyebrow: 0.3,
  name: 0.45,
  title: 0.72,
  lede: 1.05,
  cta: 1.25,
} as const;

export function Masthead() {
  const hero = useQuery(api.hero.get);
  const rootRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  /*
   * Elements render visible and are hidden here, before paint, only once this
   * effect proves JavaScript is running. Rendering them pre-hidden would leave
   * the masthead permanently blank if the bundle failed or motion was blocked.
   */
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;
    // Chrome only, and only once. Re-running this when `hero` resolved was
    // re-hiding marginalia that the chrome timeline had already revealed.
    root.querySelectorAll<HTMLElement>("[data-marginalia]").forEach((el) => {
      el.style.opacity = "0";
    });
  }, [prefersReduced]);

  /*
   * Page chrome animates on mount and never waits for Convex — gating it on
   * data meant a slow query left the rules and marginalia invisible.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline.add(
      root.querySelectorAll<HTMLElement>("[data-rule]"),
      { scaleX: [0, 1], duration: 1200, delay: stagger(120), ease: "inOutQuart" },
      BEAT.rules * 1000,
    );

    timeline.add(
      root.querySelectorAll<HTMLElement>("[data-marginalia]"),
      { opacity: [0, 1], translateY: [12, 0], duration: 800, delay: stagger(90) },
      BEAT.eyebrow * 1000,
    );

    return () => {
      timeline.pause();
    };
  }, [prefersReduced]);

  // Copy and CTAs only exist once hero resolves, so they get their own pass.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced || !hero) return;

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline.add(
      root.querySelectorAll<HTMLElement>("[data-lede], [data-figcaption]"),
      { opacity: [0, 1], translateY: [18, 0], duration: 900, delay: stagger(90) },
      0,
    );

    timeline.add(
      root.querySelectorAll<HTMLElement>("[data-cta]"),
      { opacity: [0, 1], translateY: [16, 0], duration: 800, delay: stagger(90) },
      200,
    );

    return () => {
      timeline.pause();
    };
  }, [hero, prefersReduced]);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-24 md:px-10 md:pt-28"
      aria-labelledby="masthead-heading"
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col">
        <div data-rule className="h-px w-full origin-left bg-foreground" />

        <div className="flex items-baseline justify-between gap-6 py-3">
          <span data-marginalia className="type-marginalia text-foreground-muted">
            Portfolio — Issue No. 01
          </span>
          <span
            data-marginalia
            className="type-marginalia hidden text-foreground-muted sm:block"
          >
            Salt Lake City
          </span>
          <span data-marginalia className="type-marginalia text-accent">
            Available for work
          </span>
        </div>

        <div data-rule className="h-px w-full origin-left bg-border" />

        <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-12 md:py-16">
          <div className="md:col-span-7 lg:col-span-8">
            {hero ? (
              <>
                <KineticHeading
                  as="h1"
                  text={hero.name}
                  trigger="mount"
                  delay={BEAT.name}
                  className="type-masthead text-foreground"
                  wght={[200, 700]}
                  soft={[100, 18]}
                  wonk={[1, 0]}
                  stride={22}
                />
                <KineticHeading
                  as="p"
                  text={hero.title}
                  trigger="mount"
                  delay={BEAT.title}
                  className="type-display mt-2 text-accent md:mt-4"
                  wght={[200, 400]}
                  soft={[100, 60]}
                  wonk={[1, 1]}
                  stride={16}
                />
              </>
            ) : (
              <div className="h-[22vw] w-full animate-pulse bg-background-alt" />
            )}

            <p
              data-lede

              className="type-lede mt-8 max-w-xl text-foreground-muted md:mt-10"
            >
              {hero?.tagline}
            </p>

            {hero ? (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <div data-cta>
                  <Magnetic strength={16}>
                    <Link
                      href={hero.ctaPrimaryLink}
                      className="inline-flex items-center gap-3 bg-foreground px-7 py-4 type-marginalia text-background transition-colors hover:bg-accent"
                    >
                      {hero.ctaPrimaryText}
                      <span aria-hidden>↓</span>
                    </Link>
                  </Magnetic>
                </div>
                <div data-cta>
                  <Magnetic strength={16}>
                    <Link
                      href={hero.ctaSecondaryLink}
                      className="inline-flex items-center gap-3 border border-foreground px-7 py-4 type-marginalia text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                      {hero.ctaSecondaryText}
                      <span aria-hidden>→</span>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            {hero?.portraitUrl ? (
              <Parallax distance={-28}>
                <figure className="relative">
                  <RevealFigure
                    src={hero.portraitUrl}
                    alt={`${hero.name} portrait`}
                    ratio="4 / 5"
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 33vw"
                    drift={6}
                  />
                  <figcaption
                    data-figcaption
                   
                    className="type-marginalia mt-3 flex justify-between text-foreground-muted"
                  >
                    <span>Fig. 01</span>
                    <span>The developer</span>
                  </figcaption>
                </figure>
              </Parallax>
            ) : null}
          </div>
        </div>

        <div data-rule className="h-px w-full origin-left bg-foreground" />

        <h2 id="masthead-heading" className="sr-only">
          Introduction
        </h2>
      </div>
    </section>
  );
}
