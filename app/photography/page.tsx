"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BroadsheetNav } from "@/components/broadsheet/BroadsheetNav";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { RevealFigure } from "@/components/kinetic/RevealFigure";
import { SmoothScroll } from "@/components/kinetic/SmoothScroll";
import { TiltCard } from "@/components/kinetic/TiltCard";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Photo = {
  _id: string;
  url: string | null;
  alt: string;
  caption?: string;
  blurDataUrl?: string;
};

function PhotographyLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[currentIndex];

  useEffect(() => {
    if (!img || !img.url) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [img, onClose, onPrev, onNext]);

  if (!img || !img.url) return null;

  return (
    <div
      className="fixed inset-0 z-9998 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Close"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Previous photo"
          >
            <span className="text-3xl leading-none">&larr;</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Next photo"
          >
            <span className="text-3xl leading-none">&rarr;</span>
          </button>
        </>
      )}
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <Image
          src={img.url}
          alt={img.alt}
          width={1600}
          height={1200}
          className="max-h-[90vh] w-auto max-w-full object-contain"
          sizes="90vw"
          unoptimized
        />
        {(img.caption ?? img.alt) && (
          <p className="mt-2 text-center text-sm text-white/80">
            {img.caption ?? img.alt}
          </p>
        )}
      </div>
      {images.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

/* Varied frame ratios so the contact sheet reads as laid out, not tiled. */
const GALLERY_RATIOS = ["4 / 5", "1 / 1", "3 / 4", "5 / 4", "2 / 3", "4 / 3"];

export default function PhotographyPage() {
  const photosData = useQuery(api.photos.list, {});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter out photos without URLs and cast to correct type
  const photos = (photosData ?? [])
    .filter((p) => p.url !== null)
    .map((p) => ({
      _id: p._id,
      url: p.url as string,
      alt: p.alt,
      caption: p.caption,
      blurDataUrl: p.blurDataUrl,
    }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    if (photos.length === 0) return;
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const goNext = useCallback(() => {
    if (photos.length === 0) return;
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % photos.length
    );
  }, [photos.length]);

  const isLoading = photosData === undefined;

  return (
    <SmoothScroll>
      <div className="editorial act-ink paper-grain relative min-h-screen">
        <BroadsheetNav />
        <main className="px-5 pb-24 pt-24 md:px-10 md:pb-32 md:pt-28">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="h-px w-full bg-foreground" />
            <div className="flex items-baseline justify-between gap-6 py-3">
              <Link
                href="/#stills"
                className="type-marginalia text-foreground-muted transition-colors hover:text-accent"
              >
                &larr; Back to index
              </Link>
              <span className="type-marginalia text-foreground-muted">
                {isLoading ? "—" : `${photos.length} frames`}
              </span>
            </div>
            <div className="h-px w-full bg-border" />

            <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <KineticHeading
                as="h1"
                text="Contact Sheet"
                trigger="mount"
                delay={0.25}
                className="type-masthead text-foreground"
                wght={[200, 700]}
                soft={[100, 16]}
                wonk={[1, 0]}
                stride={22}
              />
              <p className="type-lede max-w-sm text-foreground-muted">
                Everything worth keeping, in the order I shot it.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="aspect-4/5 w-full animate-pulse bg-background-alt" />
                ))}
              </div>
            ) : photos.length > 0 ? (
              <ul
                className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
                role="list"
              >
                {photos.map((img, index) => (
                  <li key={img._id}>
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      aria-label={`Open ${img.alt} in lightbox`}
                    >
                      <TiltCard max={5} glare={false}>
                        <RevealFigure
                          src={img.url}
                          alt={img.alt}
                          ratio={GALLERY_RATIOS[index % GALLERY_RATIOS.length]}
                          unoptimized
                          drift={5}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </TiltCard>
                      <span className="type-marginalia mt-2 flex items-baseline justify-between text-foreground-muted">
                        <span>Frame {String(index + 1).padStart(2, "0")}</span>
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">
                          Enlarge
                        </span>
                      </span>
                      {img.caption ? (
                        <span className="mt-1 block text-sm text-foreground-muted line-clamp-2">
                          {img.caption}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-16 text-foreground-muted">No photos yet.</p>
            )}
          </div>
        </main>
      </div>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PhotographyLightbox
              images={photos}
              currentIndex={lightboxIndex}
              onClose={closeLightbox}
              onPrev={goPrev}
              onNext={goNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SmoothScroll>
  );
}
