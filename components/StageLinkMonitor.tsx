"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const CAMERAS = [
  { id: "CAM 1", label: "Wings SL" },
  { id: "CAM 2", label: "Full stage" },
  { id: "CAM 3", label: "House" },
  { id: "CAM 4", label: "Booth" },
];

const ACTIVE_CAMERA = 1;

const FPS = 25;
// Show clock starts at 19:32:00:00 — curtain for an evening performance.
const TIMECODE_BASE_FRAMES = (19 * 3600 + 32 * 60) * FPS;

function formatTimecode(elapsedFrames: number) {
  const t = TIMECODE_BASE_FRAMES + elapsedFrames;
  const frames = t % FPS;
  const totalSeconds = Math.floor(t / FPS);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600) % 24;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

export function StageLinkMonitor() {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [latency, setLatency] = useState(28);

  useEffect(() => {
    if (reducedMotion) return;

    const timecodeTimer = setInterval(() => {
      setFrame((f) => f + 5);
    }, 200);
    const latencyTimer = setInterval(() => {
      setLatency(24 + Math.floor(Math.random() * 9));
    }, 900);

    return () => {
      clearInterval(timecodeTimer);
      clearInterval(latencyTimer);
    };
  }, [reducedMotion]);

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 font-mono text-xs shadow-2xl"
      role="img"
      aria-label="Animated demo of the StageLink monitor: a low-latency stage camera feed with camera switcher, timecode, and latency readout"
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

      {/* Main feed viewport */}
      <div
        className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-[#04070c]"
        aria-hidden
      >
        {/* Sweeping spotlight beam */}
        <div
          className="absolute -top-1/3 left-1/2 h-[130%] w-1/3 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/35 via-accent/10 to-transparent blur-md"
          style={
            reducedMotion
              ? undefined
              : { animation: "spot-sweep 7s ease-in-out infinite" }
          }
        />
        {/* Stage floor wash */}
        <div className="absolute bottom-0 h-1/3 w-full bg-gradient-to-t from-accent/15 to-transparent" />
        {/* Proscenium edges */}
        <div className="absolute inset-y-0 left-0 w-4 bg-black/60" />
        <div className="absolute inset-y-0 right-0 w-4 bg-black/60" />

        {/* Feed overlays */}
        <span className="absolute left-3 top-2 uppercase tracking-widest text-foreground/80">
          {CAMERAS[ACTIVE_CAMERA].id} · {CAMERAS[ACTIVE_CAMERA].label}
        </span>
        <span className="absolute right-3 top-2 tabular-nums text-foreground/80">
          {formatTimecode(frame)}
        </span>
        <span className="absolute bottom-2 left-3 text-foreground-muted/70">
          1080p50
        </span>
        <span className="absolute bottom-2 right-3 text-accent">
          {latency} ms
        </span>
      </div>

      {/* Camera switcher */}
      <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden>
        {CAMERAS.map((cam, i) => {
          const isActive = i === ACTIVE_CAMERA;
          return (
            <div key={cam.id}>
              <div
                className={`aspect-video rounded-sm bg-gradient-to-br from-background-alt to-background ${
                  isActive ? "ring-1 ring-accent" : "opacity-60"
                }`}
              />
              <p
                className={`mt-1 truncate text-[10px] uppercase ${
                  isActive ? "text-accent" : "text-foreground-muted/60"
                }`}
              >
                {cam.id}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-foreground-muted">
        <span className="uppercase tracking-widest">Feed latency</span>
        <span className="text-accent" aria-live="off">
          {latency} ms · WebRTC
        </span>
      </div>
    </div>
  );
}
