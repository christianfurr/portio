"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useEasterEggs } from "@/components/easter-eggs/EasterEggsProvider";

const FAKE_YEARS = [1985, 1999, 2030];
const JOKES = [
  "Built with coffee.",
  "Built with curiosity.",
  "No divs were harmed in the making.",
];

type FooterMode = "year" | "joke";

export function Footer() {
  const easterEggs = useEasterEggs();
  const realYear = new Date().getFullYear();
  const [yearIndex, setYearIndex] = useState(0); // 0 = real, 1=1985, 2=1999, 3=2030, then switch to joke
  const [jokeIndex, setJokeIndex] = useState(0);
  const [mode, setMode] = useState<FooterMode>("year");

  const handleCopyrightClick = useCallback(() => {
    if (mode === "year") {
      setYearIndex((i) => {
        const next = i + 1;
        if (next >= FAKE_YEARS.length + 1) setMode("joke");
        return next;
      });
    } else {
      setJokeIndex((i) => (i + 1) % JOKES.length);
    }
  }, [mode]);

  const displayYear =
    mode === "year"
      ? yearIndex === 0
        ? realYear
        : FAKE_YEARS[yearIndex - 1] ?? realYear
      : realYear;

  return (
    <footer
      className="relative border-t border-border px-6 py-6 md:px-8"
      role="contentinfo"
    >
      <div
        className="absolute bottom-0 left-1/4 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-accent/7 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 right-1/3 h-[220px] w-[220px] rounded-full bg-glow-orange/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopyrightClick}
            className="rounded text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Easter egg: click to cycle"
          >
          {mode === "joke"
              ? JOKES[jokeIndex]
              : `© ${displayYear} Christian Furr`}
          </button>
          <button
            type="button"
            onClick={easterEggs?.onHintsClick}
            className="rounded p-0.5 text-xs text-foreground-muted/40 transition-colors hover:text-foreground-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Discover a secret"
            title="?"
          >
            ?
          </button>
        </div>
        <Link
          href="https://github.com/christianfurr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Christian Furr on GitHub"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
