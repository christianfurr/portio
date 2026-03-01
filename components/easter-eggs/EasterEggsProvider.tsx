"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { KonamiHandler } from "./KonamiHandler";

const SnakeModal = dynamic(
  () => import("./SnakeModal").then((m) => ({ default: m.SnakeModal })),
  { ssr: false }
);

type EasterEggsContextValue = {
  onHintsClick: () => void;
  openSnake: () => void;
};

const EasterEggsContext = createContext<EasterEggsContextValue | null>(null);

export function useEasterEggs() {
  const ctx = useContext(EasterEggsContext);
  return ctx;
}

function HintsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg hints"
    >
      <div className="rounded-2xl border border-border bg-background-alt p-6 text-center shadow-xl max-w-sm">
        <p className="text-sm text-foreground-muted">
          There are a few secrets on this site. Try the Konami code, or type
          &quot;snake&quot;.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export function EasterEggsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [snakeOpen, setSnakeOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        router.push("/terminal");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const onHintsClick = useCallback(() => {
    setHintsOpen(true);
  }, []);

  const openSnake = useCallback(() => {
    setSnakeOpen(true);
  }, []);

  return (
    <EasterEggsContext.Provider value={{ onHintsClick, openSnake }}>
      {children}
      <KonamiHandler onSnake={openSnake} />
      {hintsOpen && (
        <HintsModal onClose={() => setHintsOpen(false)} />
      )}
      {snakeOpen && <SnakeModal onClose={() => setSnakeOpen(false)} />}
    </EasterEggsContext.Provider>
  );
}
