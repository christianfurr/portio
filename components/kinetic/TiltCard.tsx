"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's corners. */
  max?: number;
  /** Perspective distance; lower is a more extreme 3D read. */
  perspective?: number;
  /** Adds a cursor-tracking sheen. Off for text-heavy cards. */
  glare?: boolean;
};

const SPRING = { stiffness: 200, damping: 22, mass: 0.7 };

/*
 * Cursor-reactive 3D tilt.
 *
 * rotateX is negated against pointer Y so the card leans toward the cursor
 * rather than away from it — leaning away reads as the card dodging the mouse.
 * Children need their own translateZ to actually separate in depth; this only
 * establishes the perspective and rotation.
 */
export function TiltCard({
  children,
  className,
  max = 9,
  perspective = 1100,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-max, max]), SPRING);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [max, -max]), SPRING);

  const glareX = useTransform(pointerX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(pointerY, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 55%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        rotateX: prefersReduced ? 0 : rotateX,
        rotateY: prefersReduced ? 0 : rotateY,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
      {glare && !prefersReduced ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}
