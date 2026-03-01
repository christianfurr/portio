"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { photographyImages } from "@/data/photography";

function PhotographyLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof photographyImages;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[currentIndex];
  if (!img) return null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

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
          src={img.src}
          alt={img.alt}
          width={1600}
          height={1200}
          className="max-h-[90vh] w-auto max-w-full object-contain"
          sizes="90vw"
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

export default function PhotographyPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    if (photographyImages.length === 0) return;
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photographyImages.length) % photographyImages.length
    );
  }, []);

  const goNext = useCallback(() => {
    if (photographyImages.length === 0) return;
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % photographyImages.length
    );
  }, []);

  return (
    <>
      <div className="min-h-screen px-6 pt-32 pb-24 md:pt-48 md:pb-36">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/#photography"
            className="mb-8 inline-block text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            &larr; Back
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Photography
          </h1>
          <p className="mt-4 max-w-xl text-foreground-muted leading-relaxed">
            A selection of photos I’ve taken.
          </p>
          {photographyImages.length > 0 ? (
            <ul
              className="mt-12 columns-2 gap-3 sm:columns-3 lg:columns-4 md:gap-4 [&>li]:break-inside-avoid [&>li]:mb-3 md:[&>li]:mb-4"
              role="list"
            >
              {photographyImages.map((img, index) => (
                <li key={`${img.src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="w-full overflow-hidden rounded-lg border border-border text-left transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span
                      className={`relative block w-full ${
                        [
                          "aspect-square",
                          "aspect-4/3",
                          "aspect-3/4",
                          "aspect-5/4",
                          "aspect-3/2",
                          "aspect-2/3",
                        ][index % 6]
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </span>
                    {img.caption && (
                      <p className="mt-2 px-2 pb-2 text-xs text-foreground-muted line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-foreground-muted">
              No photos yet. Add images to <code className="rounded bg-background-alt px-1.5 py-0.5 text-sm">photography-src/</code>, run{" "}
              <code className="rounded bg-background-alt px-1.5 py-0.5 text-sm">bun run optimize-photos</code>, then add entries to{" "}
              <code className="rounded bg-background-alt px-1.5 py-0.5 text-sm">data/photography.ts</code>.
            </p>
          )}
        </div>
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
              images={photographyImages}
              currentIndex={lightboxIndex}
              onClose={closeLightbox}
              onPrev={goPrev}
              onNext={goNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
