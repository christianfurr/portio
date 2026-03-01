"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative flex min-h-[90vh] flex-col justify-center px-6 pb-32 pt-28 md:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div
          className="absolute -left-20 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/11 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute right-0 top-1/3 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-glow-pink/16 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-3xl">
          <motion.h1
            id="hero-heading"
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Christian Furr
          </motion.h1>
          <motion.p
            className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            Full Stack Developer.
          </motion.p>
          <motion.p
            className="mt-6 max-w-xl text-lg text-foreground-muted leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
          >
            I build real-time systems and beautifully crafted web experiences.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
          >
            <Link
              href="#work"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Scroll to Work section"
            >
              <motion.span
                className="block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Work
              </motion.span>
            </Link>
            <a
              href="mailto:me@christianfurr.dev"
              className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-background-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Email me at me@christianfurr.dev"
            >
              <motion.span
                className="block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Email Me
              </motion.span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
