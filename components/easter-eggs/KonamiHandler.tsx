"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right B A

function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.6 }, zIndex: 9999 };
  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export function KonamiHandler({
  onSnake,
}: {
  onSnake?: () => void;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const bufferRef = useRef<number[]>([]);
  const konamiIndexRef = useRef(0);

  useEffect(() => {
    const bufferMax = 10;
    const snakeCode = "snake";
    const snakeLen = snakeCode.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest("input") ||
          e.target.closest("textarea") ||
          e.target.isContentEditable)
      ) {
        return;
      }

      const key = e.keyCode ?? e.which;

      // Konami
      if (key === KONAMI[konamiIndexRef.current]) {
        konamiIndexRef.current++;
        if (konamiIndexRef.current === KONAMI.length) {
          konamiIndexRef.current = 0;
          fireConfetti();
          setToast("+10 dev points");
          setTimeout(() => setToast(null), 2500);
        }
      } else {
        konamiIndexRef.current = 0;
      }

      // Snake trigger: type "snake"
      const char = e.key?.toLowerCase();
      if (char && char.length === 1) {
        bufferRef.current.push(key);
        if (bufferRef.current.length > bufferMax) bufferRef.current.shift();
        const str = bufferRef.current
          .map((k) => {
            if (k >= 65 && k <= 90) return String.fromCharCode(k + 32);
            if (k >= 97 && k <= 122) return String.fromCharCode(k);
            return "";
          })
          .join("");
        if (str.slice(-snakeLen) === snakeCode) {
          bufferRef.current = [];
          onSnake?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSnake]);
  return toast ? (
    <div
      className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground shadow-lg"
      role="status"
      aria-live="polite"
    >
      {toast}
    </div>
  ) : null;
}
