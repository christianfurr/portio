type ScreenshotPlaceholderProps = {
  className?: string;
};

export function ScreenshotPlaceholder({ className = "" }: ScreenshotPlaceholderProps) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-border bg-background-alt shadow-2xl ${className}`}
      aria-hidden
    >
      <div className="relative">
        {/* Fake top bar */}
        <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="ml-4 h-2 flex-1 max-w-[180px] rounded bg-border" />
        </div>
        <div className="flex">
          {/* Fake side nav */}
          <div className="w-16 border-r border-border bg-background p-2">
            <div className="mb-2 h-8 rounded-lg bg-border" />
            <div className="mb-2 h-8 rounded-lg bg-border" />
            <div className="mb-2 h-8 rounded-lg bg-border" />
            <div className="h-8 rounded-lg bg-border opacity-60" />
          </div>
          {/* Fake content area */}
          <div className="flex-1 p-4">
            <div className="mb-4 h-4 w-1/3 rounded bg-border" />
            <div className="mb-2 h-3 w-full max-w-md rounded bg-border/80" />
            <div className="mb-4 h-3 w-full max-w-sm rounded bg-border/60" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-24 rounded-xl border border-border bg-background-alt" />
              <div className="h-24 rounded-xl border border-border bg-background-alt" />
              <div className="h-24 rounded-xl border border-border bg-background-alt" />
              <div className="h-24 rounded-xl border border-border bg-background-alt" />
            </div>
          </div>
        </div>
        {/* Subtle gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
