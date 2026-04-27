"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9990] h-[2px] origin-left bg-accent"
      style={{ scaleX, boxShadow: "0 0 8px var(--accent), 0 0 16px rgba(10,132,255,0.4)" }}
    />
  );
}
