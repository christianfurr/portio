"use client";

import { createTimeline, stagger } from "animejs";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ElementType } from "react";

import { cn } from "@/lib/utils";

/** [from, to] for a Fraunces variable axis. */
type Axis = [number, number];

export type KineticHeadingProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds before the timeline starts, for choreographing against siblings. */
  delay?: number;
  /** Hero copy animates on mount; section copy waits until scrolled to. */
  trigger?: "mount" | "inView";
  wght?: Axis;
  soft?: Axis;
  wonk?: Axis;
  opsz?: Axis;
  /** Per-glyph stagger in ms. Lower reads as a sweep, higher as a cascade. */
  stride?: number;
};

const DEFAULTS = {
  wght: [300, 600] as Axis,
  soft: [100, 22] as Axis,
  wonk: [1, 0] as Axis,
  opsz: [9, 120] as Axis,
};

/*
 * Splits in React rather than with anime's splitText.
 *
 * anime's splitter rewrites innerHTML, which fights React's ownership of these
 * nodes and desyncs on re-render. Building the spans in render keeps the DOM
 * React's, keeps it identical between server and client, and still leaves anime
 * doing the part it is actually best at — timeline choreography over the glyphs.
 *
 * The visible glyphs are aria-hidden and the real text is exposed once via
 * aria-label, so screen readers read a word, not a column of letters.
 */
export function KineticHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  trigger = "inView",
  wght = DEFAULTS.wght,
  soft = DEFAULTS.soft,
  wonk = DEFAULTS.wonk,
  opsz = DEFAULTS.opsz,
  stride = 16,
}: KineticHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const shouldRun = trigger === "mount" ? true : inView;

  /*
   * Axis tuples are fresh array literals on every render, so they are collapsed
   * to a primitive key. Depending on the arrays directly would rebuild the
   * timeline on each render and restart the animation mid-flight.
   */
  const axisKey = `${wght.join()}|${soft.join()}|${wonk.join()}|${opsz.join()}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced || !shouldRun) return;

    const glyphs = el.querySelectorAll<HTMLElement>("[data-glyph]");
    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    // Axes settle over the whole line while individual glyphs rise beneath it,
    // so the letterforms are still resolving as the words become readable.
    timeline.add(
      el,
      {
        "--fv-wght": [wght[0], wght[1]],
        "--fv-soft": [soft[0], soft[1]],
        "--fv-wonk": [wonk[0], wonk[1]],
        "--fv-opsz": [opsz[0], opsz[1]],
        duration: 1400,
        ease: "outQuart",
      },
      delay * 1000,
    );

    timeline.add(
      glyphs,
      {
        translateY: ["115%", "0%"],
        opacity: [0, 1],
        duration: 1050,
        delay: stagger(stride),
      },
      delay * 1000,
    );

    /*
     * StrictMode mounts, cleans up, then mounts again. The timeline must be
     * fully revert()ed here rather than just paused — pausing left the glyphs
     * frozen at opacity 0, and a guard against re-running made it permanent.
     */
    return () => {
      timeline.pause();
      timeline.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRun, prefersReduced, delay, stride, axisKey]);

  // Words stay unbroken so the mask never splits a word across lines mid-glyph.
  const words = text.split(" ");

  const initialAxes = {
    "--fv-wght": prefersReduced ? wght[1] : wght[0],
    "--fv-soft": prefersReduced ? soft[1] : soft[0],
    "--fv-wonk": prefersReduced ? wonk[1] : wonk[0],
    "--fv-opsz": prefersReduced ? opsz[1] : opsz[0],
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={cn("kinetic-type", className)}
      style={initialAxes}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(word).map((char, charIndex) => (
            <span key={charIndex} className="glyph-mask">
              <span
                className="glyph"
                data-glyph
                style={prefersReduced ? undefined : { transform: "translateY(115%)", opacity: 0 }}
              >
                {char}
              </span>
            </span>
          ))}
          {wordIndex < words.length - 1 ? (
            <span className="glyph-mask">
              <span className="glyph">&nbsp;</span>
            </span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}
