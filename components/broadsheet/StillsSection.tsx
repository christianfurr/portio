"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { Magnetic } from "@/components/kinetic/Magnetic";
import { Parallax } from "@/components/kinetic/Parallax";
import { RevealFigure } from "@/components/kinetic/RevealFigure";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";

const PREVIEW_COUNT = 6;

/* Column offsets that make the contact sheet read as hand-laid rather than a grid. */
const COLUMN_DRIFT = [-70, 40, -30];
const RATIOS = ["4 / 5", "1 / 1", "3 / 4", "5 / 4", "2 / 3", "4 / 3"];

/*
 * The act break: the page inverts from paper to ink here and stays inverted
 * through to the footer.
 *
 * The inversion is one class (.act-ink) flipping the semantic tokens, and the
 * progressive blur at the top edge dissolves the hard boundary so the two acts
 * bleed into each other instead of butting up.
 */
export function StillsSection() {
  const photosData = useQuery(api.photos.list, {});

  const photos = (photosData ?? [])
    .filter((photo) => photo.url !== null)
    .map((photo) => ({
      id: photo._id,
      url: photo.url as string,
      alt: photo.alt,
      caption: photo.caption,
    }));

  const preview = photos.slice(0, PREVIEW_COUNT);
  const isLoading = photosData === undefined;

  // Deal the preview into three columns so each can drift independently.
  const columns: (typeof preview)[] = [[], [], []];
  preview.forEach((photo, index) => {
    columns[index % 3].push(photo);
  });

  return (
    <section
      id="stills"
      className="act-ink relative overflow-hidden px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="stills-heading"
    >
      <ProgressiveBlur
        position="top"
        backgroundColor="var(--ink)"
        height="220px"
        blurAmount="6px"
        className="z-10"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Section 04</span>
          <span className="type-marginalia text-foreground-muted">
            {isLoading ? "—" : `${photos.length} frames`}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <KineticHeading
            as="h2"
            text="Stills"
            className="type-masthead text-foreground"
            wght={[200, 700]}
            soft={[100, 16]}
            wonk={[1, 0]}
            stride={26}
          />
          <p className="type-lede max-w-sm text-foreground-muted">
            Landscape, street, and the occasional portrait — shot on whatever I had
            with me.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-[46vh] w-full animate-pulse bg-background-alt" />
            ))}
          </div>
        ) : preview.length > 0 ? (
          <>
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {columns.map((column, columnIndex) => (
                <Parallax
                  key={columnIndex}
                  distance={COLUMN_DRIFT[columnIndex]}
                  className={columnIndex === 2 ? "hidden md:block" : undefined}
                >
                  <ul role="list" className="space-y-4 md:space-y-6">
                    {column.map((photo, photoIndex) => {
                      const globalIndex = photoIndex * 3 + columnIndex;
                      return (
                        <li key={photo.id}>
                          <Link href="/photography" className="group block">
                            <RevealFigure
                              src={photo.url}
                              alt={photo.alt}
                              ratio={RATIOS[globalIndex % RATIOS.length]}
                              unoptimized
                              drift={6}
                              sizes="(max-width: 768px) 50vw, 30vw"
                            />
                            <span className="type-marginalia mt-2 flex justify-between text-foreground-muted">
                              <span>Frame {String(globalIndex + 1).padStart(2, "0")}</span>
                              <span className="opacity-0 transition-opacity group-hover:opacity-100">
                                View →
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Parallax>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
              <span className="type-marginalia text-foreground-muted">
                {photos.length > PREVIEW_COUNT
                  ? `${photos.length - PREVIEW_COUNT} more in the gallery`
                  : "Full gallery"}
              </span>
              <Magnetic strength={18}>
                <Link
                  href="/photography"
                  className="inline-flex items-center gap-3 border border-foreground px-7 py-4 type-marginalia text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Open gallery <span aria-hidden>→</span>
                </Link>
              </Magnetic>
            </div>
          </>
        ) : (
          <div className="mt-16">
            <Magnetic strength={18}>
              <Link
                href="/photography"
                className="inline-flex items-center gap-3 border border-foreground px-7 py-4 type-marginalia text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Open gallery <span aria-hidden>→</span>
              </Link>
            </Magnetic>
          </div>
        )}
      </div>
    </section>
  );
}
