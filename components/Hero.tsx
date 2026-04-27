"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: delay + i * 0.07, ease: [0.33, 1, 0.68, 1] }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}

function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20 });
  const springY = useSpring(y, { stiffness: 250, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const hero = useQuery(api.hero.get);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  if (!hero) {
    return (
      <section
        className="relative flex min-h-[90vh] flex-col justify-center px-6 pb-32 pt-28 md:px-8"
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
      className="relative flex min-h-[90vh] flex-col justify-center px-6 pb-32 pt-28 md:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div className="relative flex flex-col-reverse items-center gap-12 md:flex-row md:items-center md:justify-between">
          {/* Text Content */}
          <div className="max-w-3xl flex-1 text-center md:text-left">
            <h1
              id="hero-heading"
              className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <WordReveal text={hero.name} delay={0} />
            </h1>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <WordReveal text={hero.title} delay={0.15} />
            </p>
            <motion.p
              className="mt-6 max-w-xl text-lg text-foreground-muted leading-relaxed mx-auto md:mx-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              {hero.tagline}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: "easeOut" }}
            >
              <MagneticWrapper>
                <Link
                  href={hero.ctaPrimaryLink}
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={`Scroll to ${hero.ctaPrimaryText} section`}
                >
                  {hero.ctaPrimaryText}
                </Link>
              </MagneticWrapper>
              <MagneticWrapper>
                <Link
                  href={hero.ctaSecondaryLink}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-background-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={hero.ctaSecondaryText}
                >
                  {hero.ctaSecondaryText}
                </Link>
              </MagneticWrapper>
            </motion.div>
          </div>

          {/* Portrait */}
          {hero.portraitUrl && (
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-accent via-glow-pink to-accent opacity-50 blur-xl" />
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: scrollIndicatorOpacity }}
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground-muted">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
