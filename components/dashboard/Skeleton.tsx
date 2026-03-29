"use client";

import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gradient-to-r from-border/50 via-border to-border/50 bg-[length:200%_100%]";

  const variants: Record<string, string> = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const defaultSizes: Record<string, { width?: string; height?: string }> = {
    text: { height: "1em", width: "100%" },
    circular: { width: "40px", height: "40px" },
    rectangular: { width: "100%", height: "100px" },
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        width: width ?? defaultSizes[variant].width,
        height: height ?? defaultSizes[variant].height,
        ...style,
      }}
      {...props}
    />
  );
}

// Pre-built skeleton components
function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="0.875rem"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-background-alt p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height="1rem" width="40%" />
          <Skeleton variant="text" height="0.75rem" width="60%" />
        </div>
      </div>
    </div>
  );
}

function SkeletonStatsCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-background-alt p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton variant="text" height="0.875rem" width="60px" />
          <Skeleton variant="text" height="2rem" width="80px" />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
    </div>
  );
}

function SkeletonActivityItem({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start gap-4 py-3 ${className}`}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height="0.875rem" width="70%" />
        <Skeleton variant="text" height="0.75rem" width="30%" />
      </div>
    </div>
  );
}

function SkeletonPhotoGrid({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-background-alt overflow-hidden">
          <Skeleton variant="rectangular" height="150px" className="rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton variant="text" height="0.875rem" width="60%" />
            <Skeleton variant="text" height="0.75rem" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonStatsCard,
  SkeletonActivityItem,
  SkeletonPhotoGrid,
};
