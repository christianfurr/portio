"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to chase the cursor, in px. */
  strength?: number;
  /** Inner content trails the wrapper slightly, which reads as weight. */
  childStrength?: number;
};

const SPRING = { stiffness: 260, damping: 18, mass: 0.6 };

/*
 * Pointer-following wrapper. The element and its contents move on separate
 * springs so the label lags a few pixels behind its container — the small
 * parallax between the two is what makes the effect feel physical rather than
 * like a rigid offset.
 *
 * Pointer-only by design: touch has no hover, and the pointerleave that resets
 * position never reliably fires, so on coarse pointers this stays inert.
 */
export function Magnetic({
  children,
  className,
  strength = 22,
  childStrength = 10,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const childX = useMotionValue(0);
  const childY = useMotionValue(0);

  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const childSpringX = useSpring(childX, SPRING);
  const childSpringY = useSpring(childY, SPRING);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Normalised to [-1, 1] from the element's centre.
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
    childX.set(relX * childStrength * 2);
    childY.set(relY * childStrength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    childX.set(0);
    childY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div style={{ x: childSpringX, y: childSpringY }} className="inline-flex">
        {children}
      </motion.div>
    </motion.div>
  );
}
