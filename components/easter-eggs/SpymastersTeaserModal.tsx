"use client";

import { useCallback, useState } from "react";

type SpymastersTeaserModalProps = { onClose: () => void };

const GRID = 3;

export function SpymastersTeaserModal({ onClose }: SpymastersTeaserModalProps) {
  const [spyIndex] = useState(() =>
    Math.floor(Math.random() * (GRID * GRID))
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  const handleCell = useCallback(
    (index: number) => {
      if (picked !== null) return;
      setPicked(index);
      setWon(index === spyIndex);
    },
    [picked, spyIndex]
  );

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Spymasters teaser"
    >
      <div className="rounded-2xl border border-border bg-background-alt p-6 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Find the spy
        </h3>
        <p className="mb-4 text-xs text-foreground-muted">
          One cell hides the spy. Click to guess.
        </p>
        <div
          className="inline-grid gap-1 rounded-lg border-2 border-border p-1"
          style={{
            gridTemplateColumns: `repeat(${GRID}, 56px)`,
            gridTemplateRows: `repeat(${GRID}, 56px)`,
          }}
        >
          {Array.from({ length: GRID * GRID }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleCell(i)}
              disabled={picked !== null}
              className="rounded border border-border bg-background text-foreground transition-colors hover:bg-border disabled:pointer-events-none"
              style={{
                backgroundColor:
                  picked === i
                    ? won
                      ? "var(--color-accent)"
                      : "var(--color-red-500)"
                    : undefined,
                color: picked === i ? "white" : undefined,
              }}
            >
              {picked === i ? (won ? "✓" : "✗") : "?"}
            </button>
          ))}
        </div>
        {won !== null && (
          <p className="mt-3 text-sm font-medium text-foreground">
            {won ? "You found the spy!" : "Wrong cell. The spy escapes."}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}
