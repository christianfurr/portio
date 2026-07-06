"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SnakeModalProps = { onClose: () => void };

const COLS = 20;
const ROWS = 16;
const CELL_PX = 20;
const INITIAL_SPEED_MS = 120;

type Dir = "up" | "down" | "left" | "right";

function nextHead(head: { x: number; y: number }, d: Dir): { x: number; y: number } {
  switch (d) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
      return { x: head.x + 1, y: head.y };
  }
}

function initSnake(): { x: number; y: number }[] {
  const midX = Math.floor(COLS / 2);
  const midY = Math.floor(ROWS / 2);
  return [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
  ];
}

function randomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  const set = new Set(snake.map((s) => `${s.x},${s.y}`));
  let x: number;
  let y: number;
  do {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  } while (set.has(`${x},${y}`));
  return { x, y };
}

export function SnakeModal({ onClose }: SnakeModalProps) {
  const [snake, setSnake] = useState(initSnake);
  const [food, setFood] = useState(() => randomFood(initSnake()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const reset = useCallback(() => {
    const initial = initSnake();
    setSnake(initial);
    setFood(randomFood(initial));
    setScore(0);
    setGameOver(false);
    setStarted(false);
    dirRef.current = "right";
    nextDirRef.current = "right";
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const id = setInterval(() => {
      const s = snakeRef.current;
      const f = foodRef.current;
      const d = nextDirRef.current;
      dirRef.current = d;
      const head = s[0];
      const newHead = nextHead(head, d);

      if (
        newHead.x < 0 ||
        newHead.x >= COLS ||
        newHead.y < 0 ||
        newHead.y >= ROWS
      ) {
        setGameOver(true);
        return;
      }

      const bodySet = new Set(s.slice(0, -1).map((b) => `${b.x},${b.y}`));
      if (bodySet.has(`${newHead.x},${newHead.y}`)) {
        setGameOver(true);
        return;
      }

      const ate = newHead.x === f.x && newHead.y === f.y;
      const nextSnake = [newHead, ...s];
      if (!ate) nextSnake.pop();
      setSnake(nextSnake);

      if (ate) {
        setScore((sc) => sc + 10);
        setFood(randomFood(nextSnake));
      }
    }, INITIAL_SPEED_MS);

    return () => clearInterval(id);
  }, [started, gameOver]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      const cur = nextDirRef.current;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (cur !== "down") nextDirRef.current = "up";
          break;
        case "ArrowDown":
          e.preventDefault();
          if (cur !== "up") nextDirRef.current = "down";
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (cur !== "right") nextDirRef.current = "left";
          break;
        case "ArrowRight":
          e.preventDefault();
          if (cur !== "left") nextDirRef.current = "right";
          break;
        default:
          return;
      }
      setStarted(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Snake game"
    >
      <div className="rounded-2xl border border-border bg-background-alt p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Snake</span>
          <span className="text-sm text-foreground-muted">Score: {score}</span>
        </div>
        {!started && (
          <p className="mb-2 text-xs text-foreground-muted">
            Press any arrow key to start.
          </p>
        )}
        {gameOver && (
          <p className="mb-2 text-sm text-red-500">Game over. Score: {score}</p>
        )}
        <div
          className="inline-block rounded-lg border-2 border-border bg-background"
          style={{
            width: COLS * CELL_PX,
            height: ROWS * CELL_PX,
          }}
        >
          <svg
            width={COLS * CELL_PX}
            height={ROWS * CELL_PX}
            className="block"
            aria-hidden
          >
            {snake.map((seg, i) => (
              <rect
                key={`${seg.x}-${seg.y}-${i}`}
                x={seg.x * CELL_PX + 1}
                y={seg.y * CELL_PX + 1}
                width={CELL_PX - 2}
                height={CELL_PX - 2}
                style={
                  i === 0
                    ? { fill: "var(--color-accent)" }
                    : { fill: "var(--color-foreground)" }
                }
              />
            ))}
            <rect
              x={food.x * CELL_PX + 2}
              y={food.y * CELL_PX + 2}
              width={CELL_PX - 4}
              height={CELL_PX - 4}
              style={{ fill: "var(--color-accent)" }}
            />
          </svg>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-background-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-border"
          >
            Close
          </button>
          {gameOver && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Play again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
