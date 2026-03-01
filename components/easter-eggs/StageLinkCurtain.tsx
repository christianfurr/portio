"use client";

import { useCallback, useState } from "react";

type StageLinkCurtainProps = { onClose: () => void };

const PUNCHLINE = "The backend was the real star.";

export function StageLinkCurtain({ onClose }: StageLinkCurtainProps) {
  const [closed, setClosed] = useState(false);

  const handleClose = useCallback(() => {
    setClosed(true);
    const t = setTimeout(onClose, 600);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label="StageLink easter egg"
    >
      <div
        className={`absolute inset-0 flex transition-transform duration-500 ease-out ${
          closed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ left: "0%" }}
        aria-hidden
      >
        <div className="w-1/2 bg-background-alt" />
      </div>
      <div
        className={`absolute inset-0 flex justify-end transition-transform duration-500 ease-out ${
          closed ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ right: "0%" }}
        aria-hidden
      >
        <div className="w-1/2 bg-background-alt" />
      </div>
      <div
        className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-300 ${
          closed ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="max-w-xs text-lg font-medium text-foreground">
          {PUNCHLINE}
        </p>
        <button
          type="button"
          onClick={handleClose}
          className="mt-4 rounded-full border border-border bg-background-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-border"
        >
          Close curtain
        </button>
      </div>
    </div>
  );
}
