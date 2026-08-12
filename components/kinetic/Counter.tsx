"use client";

import NumberFlow from "@number-flow/react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  /** Seconds to stagger this counter behind its neighbours. */
  delay?: number;
};

/*
 * Counts up once when scrolled to.
 *
 * NumberFlow animates on value *change*, so the component must render 0 first
 * and only then set the real figure — passing the target on mount would show a
 * static number. Reduced motion skips straight to the value.
 */
export function Counter({ value, className, prefix, suffix, delay = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion collapses the stagger to zero rather than taking a
    // separate synchronous path, which keeps one code path for both cases.
    const wait = prefersReduced ? 0 : delay * 1000;
    const timeout = window.setTimeout(() => setDisplay(value), wait);
    return () => window.clearTimeout(timeout);
  }, [inView, value, delay, prefersReduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <NumberFlow
        value={display}
        transformTiming={{ duration: 1200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        trend={1}
      />
      {suffix}
    </span>
  );
}
