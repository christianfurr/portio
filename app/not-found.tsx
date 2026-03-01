import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found | Christian Furr",
  description:
    "The page you're looking for doesn't exist or has been moved. Back to Christian Furr's portfolio.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-32 pb-24">
        <div className="mx-auto max-w-[1200px] text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-foreground-muted">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Back to home"
          >
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
