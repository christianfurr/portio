"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Hero() {
  const hero = useQuery(api.hero.get);

  // Show loading or fallback while data loads
  if (!hero) {
    return (
      <section
        className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 pb-32 pt-28 md:px-8"
        aria-labelledby="hero-heading"
      >
        <div className="relative mx-auto w-full max-w-[1200px]">
          <div className="relative flex flex-col-reverse items-center gap-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="h-16 w-64 animate-pulse rounded bg-border" />
            </div>
            <div className="h-64 w-64 animate-pulse rounded-full bg-border md:h-96 md:w-96" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 pb-32 pt-28 md:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div
          className="absolute -left-20 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/11 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute right-0 top-1/3 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-glow-ember/16 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col-reverse items-center gap-12 md:flex-row md:items-center md:justify-between">
          {/* Text Content - Left Side */}
          <div className="max-w-3xl flex-1 text-center md:text-left">
            <motion.h1
              id="hero-heading"
              className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {hero.name}
            </motion.h1>
            <motion.p
              className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            >
              {hero.title}
            </motion.p>
            <motion.p
              className="mt-6 max-w-xl text-lg text-foreground-muted leading-relaxed mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            >
              {hero.tagline}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            >
              <Link
                href={hero.ctaPrimaryLink}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`Scroll to ${hero.ctaPrimaryText} section`}
              >
                <motion.span
                  className="block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {hero.ctaPrimaryText}
                </motion.span>
              </Link>
              <Link
                href={hero.ctaSecondaryLink}
                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-background-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={hero.ctaSecondaryText}
              >
                <motion.span
                  className="block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {hero.ctaSecondaryText}
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Portrait - Right Side */}
          {hero.portraitUrl && (
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              {/* Gradient glow behind */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-accent via-glow-ember to-accent opacity-50 blur-xl" />
              
              {/* Portrait container */}
              <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-2xl md:h-96 md:w-96">
                <Image
                  src={hero.portraitUrl}
                  alt={`${hero.name} portrait`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 384px"
                  priority
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
