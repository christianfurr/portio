"use client";

import { useState } from "react";

const CLICKS_NEEDED = 5;
const TOOLTIP = "Okay, you can stop now.";

export function PortraitWithEgg() {
  const [clicks, setClicks] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= CLICKS_NEEDED && !showTooltip) {
      setShowTooltip(true);
      const t = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(t);
    }
  };

  return (
    <div className="relative flex justify-center md:justify-start">
      <button
        type="button"
        onClick={handleClick}
        className="relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-2xl"
        aria-label="Christian Furr portrait"
      >
        <img
          src="/images/portrait.jpeg"
          alt="Christian Furr"
          className="h-64 w-48 rounded-2xl border border-border object-cover shadow-sm md:h-80 md:w-56"
          width={224}
          height={320}
        />
      </button>
      {showTooltip && (
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background-alt px-3 py-1.5 text-xs text-foreground-muted shadow-lg"
          role="status"
        >
          {TOOLTIP}
        </div>
      )}
    </div>
  );
}
