"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CUES = [
  { id: "LX 47", label: "Blackout — end of Act I" },
  { id: "SQ 12", label: "Thunder roll, fade 4s" },
  { id: "LX 48", label: "House to half" },
  { id: "SQ 13", label: "Entr'acte playback" },
];

const METER_BARS = [
  { duration: 0.9, delay: 0 },
  { duration: 1.3, delay: 0.2 },
  { duration: 0.7, delay: 0.5 },
  { duration: 1.1, delay: 0.1 },
  { duration: 0.8, delay: 0.35 },
  { duration: 1.4, delay: 0.05 },
  { duration: 1.0, delay: 0.45 },
  { duration: 0.75, delay: 0.25 },
];

export function StageLinkMonitor() {
  const reducedMotion = useReducedMotion();
  const [activeCue, setActiveCue] = useState(0);
  const [latency, setLatency] = useState(28);

  useEffect(() => {
    if (reducedMotion) return;

    const cueTimer = setInterval(() => {
      setActiveCue((i) => (i + 1) % CUES.length);
    }, 3200);
    const latencyTimer = setInterval(() => {
      setLatency(24 + Math.floor(Math.random() * 9));
    }, 900);

    return () => {
      clearInterval(cueTimer);
      clearInterval(latencyTimer);
    };
  }, [reducedMotion]);

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5 font-mono text-xs shadow-2xl"
      role="img"
      aria-label="Animated demo of the StageLink stage monitor: live audio meters, a cue stack, and a latency readout"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="uppercase tracking-[0.2em] text-foreground-muted">
          StageLink · Stage Monitor
        </span>
        <span className="flex items-center gap-1.5 text-glow-red">
          <span
            className={`h-2 w-2 rounded-full bg-glow-red ${reducedMotion ? "" : "animate-pulse"}`}
            aria-hidden
          />
          LIVE
        </span>
      </div>

      {/* Meters */}
      <div className="mt-4 flex h-20 items-end gap-2" aria-hidden>
        {METER_BARS.map((bar, i) => (
          <div
            key={i}
            className="flex h-full flex-1 items-end overflow-hidden rounded-sm bg-background"
          >
            <div
              className="w-full origin-bottom rounded-sm bg-gradient-to-t from-accent/70 to-accent"
              style={
                reducedMotion
                  ? { height: "100%", transform: "scaleY(0.55)" }
                  : {
                      height: "100%",
                      animation: `vu-meter ${bar.duration}s ease-in-out ${bar.delay}s infinite`,
                    }
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] uppercase text-foreground-muted/60" aria-hidden>
        <span>Ch 1–8</span>
        <span>-6 dB</span>
      </div>

      {/* Cue stack */}
      <div className="mt-4 space-y-1.5" aria-hidden>
        {CUES.map((cue, i) => {
          const isGo = i === activeCue;
          const isStandby = i === (activeCue + 1) % CUES.length;
          return (
            <div
              key={cue.id}
              className={`flex items-center justify-between rounded-sm px-2.5 py-1.5 transition-colors duration-500 ${
                isGo
                  ? "bg-accent/15 text-accent"
                  : isStandby
                    ? "bg-background text-foreground-muted"
                    : "text-foreground-muted/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-12">{cue.id}</span>
                <span className="hidden truncate sm:inline">{cue.label}</span>
              </span>
              <span className="uppercase tracking-widest">
                {isGo ? "GO" : isStandby ? "Standby" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Latency readout */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-foreground-muted">
        <span className="uppercase tracking-widest">Feed latency</span>
        <span className="text-accent" aria-live="off">
          {latency} ms
        </span>
      </div>
    </div>
  );
}
