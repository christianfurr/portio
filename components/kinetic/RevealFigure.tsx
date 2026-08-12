"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type RevealFigureProps = {
  src: string;
  alt: string;
  className?: string;
  /** Frame aspect ratio, e.g. "4 / 5". */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  /** Convex-hosted images are already optimised and served signed. */
  unoptimized?: boolean;
  /** How far the image drifts inside its frame, in percent. */
  drift?: number;
};

/*
 * Editorial figure with an over-scaled image inside a fixed frame.
 *
 * The image is rendered at 118% and drifts within the frame as the section
 * scrolls, so the crop moves without ever exposing an edge. The frame itself
 * unmasks via clip-path, which keeps the reveal on the compositor rather than
 * animating layout.
 */
export function RevealFigure({
  src,
  alt,
  className,
  ratio = "4 / 5",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  unoptimized = false,
  drift = 8,
}: RevealFigureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 26 });
  const y = useTransform(smooth, [0, 1], [`-${drift}%`, `${drift}%`]);
  const scale = useTransform(smooth, [0, 0.5, 1], [1.02, 1.12, 1.02]);

  /*
   * The observed element and the clipped element must be different.
   *
   * clip-path: inset(100%) leaves an element with zero visible area, so
   * IntersectionObserver reports ratio 0 and it never counts as in view — the
   * figure hides itself into a deadlock and never reveals. The outer wrapper
   * below is never clipped, so it can be observed honestly; only the inner
   * layer carries the clip.
   */
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const revealed = prefersReduced || inView;

  return (
    <div
      ref={ref}
      className={cn("relative bg-background-alt", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={false}
        animate={{ clipPath: revealed ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/*
         * drift={0} pins the image dead still. Screenshots shown inside a
         * device frame must not drift or over-scale — the content would slide
         * against the bezel and break the illusion that it is a screen.
         */}
        <motion.div
          className="absolute inset-0"
          style={
            prefersReduced || drift === 0 ? undefined : { y, scale, willChange: "transform" }
          }
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={unoptimized}
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
