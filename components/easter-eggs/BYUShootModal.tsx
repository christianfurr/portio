"use client";

import { useCallback, useRef, useState, useEffect } from "react";

type BYUShootModalProps = { onClose: () => void };

const HOOP_CX = 160;
const HOOP_CY = 80;
const HOOP_R = 45;
const BALL_R = 12;
const GRAVITY = 0.4;
const CANVAS_W = 320;
const CANVAS_H = 200;

export function BYUShootModal({ onClose }: BYUShootModalProps) {
  const [ball, setBall] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef(ball);
  ballRef.current = ball;

  useEffect(() => {
    if (!ball) return;
    let id: number;
    const loop = () => {
      const b = ballRef.current;
      if (!b) return;
      let { x, y, vx, vy } = b;
      vy += GRAVITY;
      x += vx;
      y += vy;

      const dist = Math.hypot(x - HOOP_CX, y - HOOP_CY);
      if (dist < HOOP_R && y > HOOP_CY - 20) {
        setScore((s) => s + 1);
        setMessage("Splash!");
        setTimeout(() => setMessage(null), 1500);
        ballRef.current = null;
        setBall(null);
        return;
      }

      if (y > CANVAS_H + 20 || x < -20 || x > CANVAS_W + 20) {
        ballRef.current = null;
        setBall(null);
        return;
      }

      const next = { x, y, vx: vx * 0.99, vy };
      ballRef.current = next;
      setBall(next);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ball]);

  const shoot = useCallback(
    (fromX: number, fromY: number, toX: number, toY: number) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const mag = Math.min(Math.hypot(dx, dy) * 0.15, 14);
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * mag;
      const vy = Math.sin(angle) * mag;
      setBall({ x: fromX, y: fromY, vx, vy });
      setMessage(null);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (ball) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (y > CANVAS_H - 50) {
        dragStart.current = { x, y };
      }
    },
    [ball]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current || ball) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      shoot(dragStart.current.x, dragStart.current.y, x, y);
      dragStart.current = null;
    },
    [ball, shoot]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.strokeStyle = "var(--color-foreground)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(HOOP_CX, HOOP_CY, HOOP_R, 0, Math.PI);
      ctx.stroke();
      if (ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fillStyle = "var(--color-accent)";
        ctx.fill();
      }
    };
    draw();
  }, [ball]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="BYU shoot mini-game"
    >
      <div className="rounded-2xl border border-border bg-background-alt p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Shoot the hoop
        </h3>
        <p className="mb-3 text-xs text-foreground-muted">
          Drag from the bottom and release to shoot.
        </p>
        <div className="mb-2 text-sm text-foreground-muted">Score: {score}</div>
        {message && (
          <p className="mb-2 text-sm font-medium text-accent">{message}</p>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block rounded-lg border-2 border-border bg-background"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            dragStart.current = null;
          }}
          style={{
            touchAction: "none",
            cursor: ball ? "default" : "crosshair",
          }}
        />
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
