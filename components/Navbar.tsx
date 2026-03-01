"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  const handleBrandMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => setShowTooltip(true), 2500);
  };

  const handleBrandMouseLeave = () => {
    clearTimer();
  };

  return (
    <header
      className="fixed top-6 left-1/2 z-50 w-fit max-w-[min(90vw,40rem)] -translate-x-1/2"
      role="banner"
    >
      <nav
        className="flex h-12 items-center justify-between gap-12 rounded-full border border-border bg-black/20 px-8 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-xl"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={handleBrandClick}
          onMouseEnter={handleBrandMouseEnter}
          onMouseLeave={handleBrandMouseLeave}
          className="relative text-lg font-semibold tracking-tight text-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Christian Furr, go to top"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                key="tooltip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background"
              >
                That&apos;s me!
              </motion.span>
            )}
          </AnimatePresence>
          Christian Furr
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="#work"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
