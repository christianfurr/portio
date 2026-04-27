"use client";

import { motion } from "framer-motion";

export function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute h-[700px] w-[700px] rounded-full bg-accent/5 blur-3xl"
        animate={{ x: [0, 80, -20, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        style={{ left: "5%", top: "10%" }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-glow-pink/8 blur-3xl"
        animate={{ x: [0, -60, 30, 0], y: [0, 80, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 }}
        style={{ right: "5%", top: "40%" }}
      />
      <motion.div
        className="absolute h-[450px] w-[450px] rounded-full bg-glow-orange/8 blur-3xl"
        animate={{ x: [0, 50, -30, 0], y: [0, -50, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 5 }}
        style={{ left: "25%", bottom: "15%" }}
      />
    </div>
  );
}
