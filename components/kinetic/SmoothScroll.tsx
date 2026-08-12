"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/*
 * Lenis in root mode renders its children unwrapped, so this component adds no
 * DOM of its own. That matters: it means the smooth/reduced branches produce
 * identical markup and cannot cause a hydration mismatch. Reduced-motion users
 * get smoothWheel off rather than a different tree.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: prefersReduced ? 1 : 0.085,
        duration: prefersReduced ? 0 : 1.15,
        smoothWheel: !prefersReduced,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
