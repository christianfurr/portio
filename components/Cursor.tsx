"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 600, damping: 30 });
  const dotY = useSpring(y, { stiffness: 600, damping: 30 });
  const ringX = useSpring(x, { stiffness: 180, damping: 20 });
  const ringY = useSpring(y, { stiffness: 180, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setIsPointerFine(fine);
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-magnetic]")) {
        setIsHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-magnetic]")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [x, y]);

  if (!mounted || !isPointerFine) return null;

  return (
    <div aria-hidden className="pointer-events-none">
      {/* Dot */}
      <motion.div
        className="fixed left-0 top-0 z-[9999] rounded-full bg-accent"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Ring */}
      <motion.div
        className="fixed left-0 top-0 z-[9998] rounded-full border-2"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderColor: isHovering ? "rgba(10,132,255,1)" : "rgba(10,132,255,0.6)",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
