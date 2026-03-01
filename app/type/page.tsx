"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const QUOTE =
  "I build real-time systems and beautifully crafted web experiences.";

export default function TypePage() {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const elapsedMs = startTime && endTime ? endTime - startTime : 0;
  const wpm =
    elapsedMs > 0 && done
      ? Math.round(
          (QUOTE.split(/\s+/).length / (elapsedMs / 60000))
        )
      : null;
  const accuracy =
    typed.length > 0
      ? Math.round(
          (QUOTE.slice(0, typed.length)
            .split("")
            .filter((c, i) => c === typed[i]).length /
            typed.length) *
            100
        )
      : null;

  useEffect(() => {
    if (!started && typed.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
  }, [started, typed.length]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (v.length > QUOTE.length) return;
      setTyped(v);
      if (v === QUOTE) {
        setDone(true);
        setEndTime(Date.now());
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Typing test
          </h1>
          <Link
            href="/"
            className="text-foreground-muted hover:text-foreground"
          >
            ← back
          </Link>
        </div>
        <p className="mb-4 text-foreground-muted">
          Type the quote below. Your WPM and accuracy will show when you finish.
        </p>
        <div className="rounded-xl border border-border bg-background-alt p-6">
          <p className="mb-4 font-serif text-lg leading-relaxed text-foreground-muted">
            {QUOTE.split("").map((char, i) => (
              <span
                key={i}
                className={
                  i < typed.length
                    ? typed[i] === char
                      ? "text-foreground"
                      : "text-red-500"
                    : ""
                }
              >
                {char}
              </span>
            ))}
          </p>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleChange}
            onFocus={() => inputRef.current?.select()}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent"
            rows={3}
            placeholder="Start typing..."
            disabled={done}
            aria-label="Type the quote"
          />
          {done && wpm !== null && accuracy !== null && (
            <p className="mt-4 text-sm text-foreground-muted">
              {wpm} WPM · {accuracy}% accuracy
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
