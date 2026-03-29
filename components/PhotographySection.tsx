"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const PREVIEW_COUNT = 6;

const ASPECT_CLASSES = [
  "aspect-square",
  "aspect-4/3",
  "aspect-3/4",
  "aspect-5/4",
  "aspect-3/2",
  "aspect-2/3",
] as const;

function getAspectClass(index: number) {
  return ASPECT_CLASSES[index % ASPECT_CLASSES.length];
}

export function PhotographySection() {
  const photosData = useQuery(api.photos.list);

  // Filter out photos without URLs
  const photos = (photosData ?? [])
    .filter((p) => p.url !== null)
    .map((p) => ({
      _id: p._id,
      url: p.url as string,
      alt: p.alt,
      caption: p.caption,
    }));

  const preview = photos.slice(0, PREVIEW_COUNT);
  const isLoading = photosData === undefined;

  return (
    <section
      id="photography"
      className="relative overflow-hidden bg-background-alt px-6 py-24 md:py-36"
      aria-labelledby="photography-heading"
    >
      <div
        className="absolute -left-24 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-glow-pink/14 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-1/4 h-[360px] w-[360px] rounded-full bg-glow-orange/12 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px]">
        <h2
          id="photography-heading"
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          Photography
        </h2>
        <p className="mt-4 max-w-xl text-foreground-muted leading-relaxed">
          A selection of photos I've taken. I like to shoot landscapes, street,
          and the occasional portrait.
        </p>
        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground-muted border-t-accent" />
          </div>
        ) : preview.length > 0 ? (
          <>
            <ul
              className="mt-12 columns-2 gap-3 sm:columns-3 md:gap-4 [&>li]:break-inside-avoid [&>li]:mb-3 md:[&>li]:mb-4"
              role="list"
            >
              {preview.map((img, index) => (
                <li key={img._id}>
                  <Link
                    href="/photography"
                    className="block overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span
                      className={`relative block w-full ${getAspectClass(index)}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        unoptimized
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {photos.length > PREVIEW_COUNT && (
              <p className="mt-4 text-sm text-foreground-muted">
                and {photos.length - PREVIEW_COUNT} more
              </p>
            )}
            <Link
              href="/photography"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View more
            </Link>
          </>
        ) : (
          <Link
            href="/photography"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View gallery
          </Link>
        )}
      </div>
    </section>
  );
}
