"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Travel in px across the element's full scroll pass. Negative moves against
   * the scroll (reads as further away), positive moves with it (nearer).
   */
  distance?: number;
  /** Slight scale-up as the element crosses the viewport. */
  zoom?: number;
};

const SPRING = { stiffness: 90, damping: 26, mass: 0.5 };

/*
 * Scroll-linked depth layer.
 *
 * The raw scroll progress is passed through a spring so the layer keeps easing
 * for a beat after the wheel stops. Without it, parallax tracks the scrollbar
 * exactly and reads as mechanical rather than as weight.
 */
export function Parallax({ children, className, distance = -80, zoom = 0 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, SPRING);
  const y = useTransform(smooth, [0, 1], [-distance, distance]);
  const scale = useTransform(smooth, [0, 0.5, 1], [1, 1 + zoom, 1]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={
          prefersReduced ? undefined : { y, scale: zoom ? scale : undefined, willChange: "transform" }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

type ScrollAxisProps = {
  children: ReactNode;
  className?: string;
  /** Weight axis range driven by scroll position. */
  wght?: [number, number];
  /** WONK toggles Fraunces' alternate letterforms; 0 to 1 across the pass. */
  wonk?: [number, number];
  soft?: [number, number];
};

/*
 * Drives Fraunces' variable axes from scroll position rather than from a
 * one-shot entrance. Used on the section headings so the letterforms are still
 * changing while the reader moves through the page.
 */
export function ScrollAxisText({
  children,
  className,
  wght = [200, 700],
  wonk = [1, 0],
  soft = [100, 0],
}: ScrollAxisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const fvWght = useTransform(smooth, [0, 1], wght);
  const fvWonk = useTransform(smooth, [0, 1], wonk);
  const fvSoft = useTransform(smooth, [0, 1], soft);

  /*
   * Motion renders CSS custom properties fine at runtime, but its MotionStyle
   * type only lists known CSS properties, so custom axes need a cast.
   */
  const axisStyle = (
    prefersReduced
      ? { "--fv-wght": wght[1], "--fv-wonk": wonk[1], "--fv-soft": soft[1] }
      : { "--fv-wght": fvWght, "--fv-wonk": fvWonk, "--fv-soft": fvSoft }
  ) as unknown as MotionStyle;

  return (
    <motion.div ref={ref} className={cn("kinetic-type", className)} style={axisStyle}>
      {children}
    </motion.div>
  );
}
