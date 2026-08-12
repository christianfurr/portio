"use client";

import { RevealFigure } from "@/components/kinetic/RevealFigure";
import { cn } from "@/lib/utils";

type DeviceFrameProps = {
  src: string;
  alt: string;
  /** Shown in the address bar. A full URL is reduced to its hostname. */
  url?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
};

/** Strip protocol and trailing slash so the bar reads like a real address. */
function hostname(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

/*
 * Browser-window mockup for project screenshots.
 *
 * The captures are 16:9 desktop screenshots, so the viewport is locked to that
 * ratio — the previous 16/11 frame cropped a chunk off every one of them. The
 * chrome is drawn flat in the design's own tokens rather than as a glossy
 * skeuomorphic device, so it reads as an editorial diagram of a screen.
 */
export function DeviceFrame({
  src,
  alt,
  url,
  className,
  sizes = "(max-width: 768px) 92vw, 40vw",
  priority = false,
  unoptimized = false,
}: DeviceFrameProps) {
  const address = hostname(url);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-background-alt shadow-2xl shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full border border-border" />
          <span className="h-2.5 w-2.5 rounded-full border border-border" />
          <span className="h-2.5 w-2.5 rounded-full border border-border" />
        </span>
        {address ? (
          <span className="min-w-0 flex-1 truncate rounded-sm bg-background px-3 py-1 text-center type-marginalia text-foreground-muted">
            {address}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        <span className="w-8 shrink-0" aria-hidden />
      </div>

      <RevealFigure
        src={src}
        alt={alt}
        ratio="16 / 9"
        drift={0}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
      />
    </div>
  );
}
