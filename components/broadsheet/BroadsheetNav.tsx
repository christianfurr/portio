"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { TextRoll } from "@/components/ui/skiper-ui/skiper58";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#stills", label: "Stills" },
  { href: "/photography", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

/*
 * Editorial masthead rule rather than a floating pill.
 *
 * The bar is transparent over the hero and fades in a paper backdrop only after
 * the reader leaves the masthead, so the opening spread is never covered. The
 * accent hairline underneath doubles as a scroll-progress indicator.
 */
export function BroadsheetNav() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [onInk, setOnInk] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  /*
   * Invert the bar whenever a dark section sits beneath it. Section rects are
   * measured against the nav's own midline rather than a hardcoded scroll
   * offset, so this keeps working as content length changes.
   */
  useMotionValueEvent(scrollY, "change", (value) => {
    setLifted(value > 80);

    const midline = 32;
    const darkSections = document.querySelectorAll<HTMLElement>(".act-ink");
    let covered = false;
    darkSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= midline && rect.bottom >= midline) covered = true;
    });
    setOnInk(covered);
  });

  // Pages that are dark from the first paint (the gallery) start inverted.
  // Measured in rAF so layout has settled and the state write is not synchronous.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(".act-ink");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      setOnInk(rect.top <= 32 && rect.bottom >= 32);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const clearTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  // Long-hover reveal, kept from the previous nav as a hidden easter egg.
  const handleBrandMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => setShowTooltip(true), 2500);
  };

  useEffect(() => {
    const handler = () => setMobileOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-500", onInk && "act-ink-tokens")}
      role="banner"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 border-b border-border bg-background/80 backdrop-blur-xl"
        initial={false}
        animate={{ opacity: lifted ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />

      <nav
        className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-6 px-5 md:h-16 md:px-10"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={handleBrandClick}
          onMouseEnter={handleBrandMouseEnter}
          onMouseLeave={clearTimer}
          onFocus={handleBrandMouseEnter}
          onBlur={clearTimer}
          className="group relative type-marginalia text-foreground"
          aria-label="Christian Furr, go to top"
        >
          <span className="font-semibold">Christian Furr</span>
          <span className="ml-2 hidden text-foreground-muted sm:inline">— Developer</span>
          <AnimatePresence>
            {showTooltip ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 top-full mt-2 whitespace-nowrap rounded-sm border border-border bg-background px-2 py-1 text-[10px] tracking-widest text-foreground-muted"
              >
                try the konami code
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Link>

        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="type-marginalia text-foreground transition-colors hover:text-accent"
              >
                <TextRoll>{label}</TextRoll>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="type-marginalia text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="broadsheet-mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? "Close" : "Index"}
        </button>
      </nav>

      {/* Accent hairline doubling as scroll progress. */}
      <motion.div
        aria-hidden
        className="h-px w-full origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="broadsheet-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <ul className="flex flex-col px-5 py-4" role="list">
              {NAV_LINKS.map(({ href, label }, index) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block border-b border-border py-3 font-display text-2xl text-foreground",
                      index === NAV_LINKS.length - 1 && "border-b-0",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
