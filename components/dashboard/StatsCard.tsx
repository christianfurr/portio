"use client";

import React, { useEffect, useState, useRef } from "react";

// Count-up animation hook
export function useCountUp(
  endValue: number,
  duration: number = 1500,
  startOnMount: boolean = true
): { value: number; start: () => void } {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const frameRef = useRef<number | null>(null);

  const start = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.round(startValue + (endValue - startValue) * eased);

      setValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (startOnMount && endValue > 0) {
      // Small delay for visual effect
      const timer = setTimeout(start, 100);
      return () => {
        clearTimeout(timer);
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `start` is recreated each render; including it would cancel the animation on every re-render
  }, [endValue, startOnMount]);

  // Reset when endValue changes — state adjustment during render
  // (per React docs) instead of a cascading setState-in-effect.
  const [prevEndValue, setPrevEndValue] = useState(endValue);
  if (prevEndValue !== endValue) {
    setPrevEndValue(endValue);
    setValue(0);
    setHasStarted(false);
  }

  return { value, start };
}

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "#0a84ff",
  loading = false,
}: StatsCardProps) {
  const { value: animatedValue } = useCountUp(value, 1500, !loading);
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            animation: "shimmer 1.5s infinite",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "60%",
            background: "var(--border)",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            height: "36px",
            width: "40%",
            background: "var(--border)",
            borderRadius: "6px",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "50%",
            background: "var(--border)",
            borderRadius: "4px",
          }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? `linear-gradient(135deg, var(--card) 0%, ${accentColor}08 100%)`
          : "var(--card)",
        border: `1px solid ${isHovered ? `${accentColor}40` : "var(--border)"}`,
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered
          ? `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px ${accentColor}20`
          : "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80, transparent)`,
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `${accentColor}15`,
              color: accentColor,
              transition: "all 0.3s ease",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: 700,
          color: "var(--foreground)",
          lineHeight: 1.1,
          marginBottom: "8px",
          fontFeatureSettings: '"tnum"',
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {animatedValue.toLocaleString()}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {subtitle && (
          <span
            style={{
              fontSize: "13px",
              color: "var(--muted)",
            }}
          >
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: trend.isPositive ? "#22c55e" : "#ef4444",
              background: trend.isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: trend.isPositive ? "rotate(0deg)" : "rotate(180deg)",
              }}
            >
              <path
                d="M6 2.5L10 6.5M6 2.5L2 6.5M6 2.5V9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}

// Pre-built icons for common stats
export const StatsIcons = {
  photos: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M18 13L14.5 9.5C14.1 9.1 13.5 9.1 13.1 9.5L8 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M2 10H5L7 4L10 16L13 7L15 10H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  views: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 17C4 14.2386 6.68629 12 10 12C13.3137 12 16 14.2386 16 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default StatsCard;
