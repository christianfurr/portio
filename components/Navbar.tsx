"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const NAV_LINKS = [
  { href: "#work", label: "Work", sectionId: "work" },
  { href: "#about", label: "About", sectionId: "about" },
  { href: "#stage-crew", label: "Stage", sectionId: "stage-crew" },
  { href: "/photography", label: "Photography", sectionId: null },
  { href: "#contact", label: "Contact", sectionId: "contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  // Scroll-reactive background
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsubscribe;
  }, [scrollY]);

  // Active section tracking
  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = NAV_LINKS.map((l) => l.sectionId).filter(Boolean) as string[];

    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-35% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection(null);
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

  const handleBrandMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => setShowTooltip(true), 2500);
  };

  const handleBrandMouseLeave = () => {
    clearTimer();
  };

  const handleNavClick = () => setMobileOpen(false);

  useEffect(() => {
    const handler = () => setMobileOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <header
      className="fixed top-4 left-4 right-4 z-50 sm:top-6 sm:left-1/2 sm:right-auto sm:w-fit sm:max-w-[min(90vw,40rem)] sm:-translate-x-1/2"
      role="banner"
    >
      <motion.nav
        className="flex h-12 items-center justify-between gap-4 rounded-full border px-4 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-xl sm:gap-12 sm:px-8"
        animate={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.12)",
          borderColor: scrolled ? "rgba(56,56,58,0.8)" : "rgba(56,56,58,0.3)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={handleBrandClick}
          onMouseEnter={handleBrandMouseEnter}
          onMouseLeave={handleBrandMouseLeave}
          className="relative shrink-0 text-base font-semibold tracking-tight text-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-lg"
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

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map(({ href, label, sectionId }) => {
            const isActive = sectionId && activeSection === sectionId;
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={`text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
        >
          <span className="relative h-4 w-4">
            <span
              className="absolute left-0 top-0.5 block h-0.5 w-4 rounded-full bg-current transition-all duration-200"
              style={{
                transform: mobileOpen ? "translateY(5px) rotate(-45deg)" : "none",
              }}
            />
            <span
              className="absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-current transition-opacity duration-200"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-0 top-[11px] block h-0.5 w-4 rounded-full bg-current transition-all duration-200"
              style={{
                transform: mobileOpen ? "translateY(-5px) rotate(45deg)" : "none",
              }}
            />
          </span>
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden sm:hidden"
          >
            <ul className="mt-2 flex flex-col gap-0 rounded-2xl border border-border bg-black/70 py-2 backdrop-blur-xl backdrop-saturate-150 shadow-xl">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={handleNavClick}
                    className="block px-5 py-3 text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground focus-visible:bg-white/5 focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
