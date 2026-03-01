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

function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

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

  const shoot = useCallback(
    (fromX: number, fromY: number, toX: number, toY: number) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const mag = Math.min(Math.hypot(dx, dy) * 0.12, 12);
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * mag;
      const vy = Math.sin(angle) * mag;
      setBall({ x: fromX, y: fromY, vx, vy });
      setMessage(null);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (ball) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getCanvasPoint(canvas, e.clientX, e.clientY);
      if (y > CANVAS_H - 50) {
        dragStart.current = { x, y };
      }
    },
    [ball]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragStart.current || ball) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getCanvasPoint(canvas, e.clientX, e.clientY);
      shoot(dragStart.current.x, dragStart.current.y, x, y);
      dragStart.current = null;
    },
    [ball, shoot]
  );

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
      const inCircle = dist < HOOP_R;
      const belowRim = y > HOOP_CY;
      if (inCircle && belowRim && y < HOOP_CY + HOOP_R) {
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

      const next = { x, y, vx: vx * 0.998, vy };
      ballRef.current = next;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ball]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const strokeColor =
      typeof document !== "undefined"
        ? (getComputedStyle(document.documentElement)
            .getPropertyValue("--color-foreground")
            .trim() || "#f5f5f7")
        : "#f5f5f7";
    const fillColor =
      typeof document !== "undefined"
        ? (getComputedStyle(document.documentElement)
            .getPropertyValue("--color-accent")
            .trim() || "#0a84ff")
        : "#0a84ff";

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(HOOP_CX, HOOP_CY, HOOP_R, 0, Math.PI);
      ctx.stroke();
      const b = ballRef.current;
      if (b) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    };
    draw();

    let drawId: number;
    const drawLoop = () => {
      draw();
      drawId = requestAnimationFrame(drawLoop);
    };
    drawId = requestAnimationFrame(drawLoop);
    return () => cancelAnimationFrame(drawId);
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
