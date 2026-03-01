"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Line = { type: "input" | "output"; text: string };

const COMMANDS: Record<
  string,
  string | string[]
> = {
  whoami: "Christian Furr — full stack developer.",
  projects: [
    "StageLink — real-time stage monitoring.",
    "Spymasters — strategy game.",
    "BYU Basketball Roster — roster browsing.",
  ],
  contact: "me@christianfurr.dev",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs.",
  clear: "",
};

export default function TerminalPage() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: 'Type "help" for commands.' },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) {
      setLines((prev) => [...prev, { type: "input", text: cmd }]);
      return;
    }
    setLines((prev) => [...prev, { type: "input", text: cmd }]);

    if (trimmed === "clear" || trimmed === "cls") {
      setLines([]);
      return;
    }
    if (trimmed === "help") {
      setLines((prev) => [
        ...prev,
        { type: "output", text: "whoami | projects | contact | joke | clear | type | exit" },
      ]);
      return;
    }
    if (trimmed === "exit" || trimmed === "back") {
      router.push("/");
      return;
    }
    if (trimmed === "type") {
      router.push("/type");
      return;
    }

    const result = COMMANDS[trimmed];
    if (result === undefined) {
      setLines((prev) => [
        ...prev,
        { type: "output", text: `Unknown command: ${trimmed}` },
      ]);
      return;
    }
    if (result === "") return;
    if (Array.isArray(result)) {
      result.forEach((line) => {
        setLines((prev) => [...prev, { type: "output", text: line }]);
      });
      return;
    }
    setLines((prev) => [...prev, { type: "output", text: result }]);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background p-4 font-mono text-sm">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-background-alt p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
          <span className="text-foreground-muted">terminal</span>
          <Link
            href="/"
            className="text-foreground-muted hover:text-foreground"
          >
            ← back
          </Link>
        </div>
        <div className="min-h-[320px] space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2">
              {line.type === "input" && (
                <span className="text-accent">$</span>
              )}
              <span
                className={
                  line.type === "output"
                    ? "text-foreground-muted"
                    : "text-foreground"
                }
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent text-foreground outline-none"
            placeholder="..."
            autoFocus
            aria-label="Command input"
          />
        </form>
      </div>
    </div>
  );
}
