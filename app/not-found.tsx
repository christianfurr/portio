import type { Metadata } from "next";
import Link from "next/link";

import { BroadsheetNav } from "@/components/broadsheet/BroadsheetNav";

export const metadata: Metadata = {
  title: "Page not found | Christian Furr",
  description:
    "The page you're looking for doesn't exist or has been moved. Back to Christian Furr's portfolio.",
};

export default function NotFound() {
  return (
    <div className="editorial act-ink paper-grain relative min-h-screen">
      <BroadsheetNav />
      <main
        id="main"
        className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-5 py-24 md:px-10"
      >
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Error</span>
          <span className="type-marginalia text-accent">404</span>
        </div>
        <div className="h-px w-full bg-border" />

        <h1 className="type-masthead mt-12 font-display text-foreground">Not found</h1>
        <p className="type-lede mt-8 max-w-lg text-foreground-muted">
          That page doesn’t exist, or it has been moved. The rest of the issue is
          still here.
        </p>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-foreground px-7 py-4 type-marginalia text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Back to the index <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
