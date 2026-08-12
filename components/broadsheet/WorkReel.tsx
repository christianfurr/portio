"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { DeviceFrame } from "@/components/kinetic/DeviceFrame";
import { TiltCard } from "@/components/kinetic/TiltCard";

type ReelProject = {
  id: string;
  title: string;
  description: string;
  liveUrl: string;
  sourceUrl: string | null;
  techStack: string[];
  image: string | null;
};

/*
 * Pinned horizontal reel.
 *
 * The section is n screens tall; an inner sticky viewport stays fixed while
 * that height scrolls past, and vertical progress is remapped to horizontal
 * translation. Track width is derived from the project count so the last card
 * lands flush at the right edge instead of over- or under-shooting.
 *
 * On small screens the pin is dropped entirely — pinning a horizontal track on
 * touch fights the browser's own scroll and reads as broken — so mobile gets an
 * ordinary vertical stack.
 */
export function WorkReel() {
  const projectsData = useQuery(api.projects.list, {});

  const projects: ReelProject[] = (projectsData ?? []).map((project) => ({
    id: project._id,
    title: project.title,
    description: project.description,
    liveUrl: project.liveUrl,
    sourceUrl: project.sourceUrl ?? null,
    techStack: project.techStack,
    image: project.imageUrl ?? null,
  }));

  const isLoading = projectsData === undefined;

  return (
    <section id="work" className="relative" aria-labelledby="work-heading">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-24 md:px-10 md:pt-32">
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Section 01</span>
          <span className="type-marginalia text-foreground-muted">
            {isLoading ? "—" : `${projects.length} selected`}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <KineticHeading
          as="h2"
          text="Selected Work"
          className="type-display mt-10 text-foreground"
          wght={[200, 650]}
          soft={[100, 20]}
          wonk={[1, 0]}
        />
        <p className="type-lede mt-5 max-w-xl text-foreground-muted">
          Things I designed, built and shipped — mostly real-time systems and the
          interfaces that sit on top of them.
        </p>
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
          <div className="h-[50vh] w-full animate-pulse bg-background-alt" />
        </div>
      ) : projects.length === 0 ? (
        <p className="mx-auto max-w-[1440px] px-5 py-20 text-foreground-muted md:px-10">
          No projects yet.
        </p>
      ) : (
        <>
          {/* Desktop: pinned horizontal track. */}
          <PinnedReel projects={projects} />

          {/* Mobile: plain vertical stack. */}
          <ul role="list" className="space-y-12 px-5 py-16 md:hidden">
            {projects.map((project, index) => (
              <li key={project.id}>
                <ProjectPlate project={project} index={index} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/*
 * The pinned track lives in its own component so useScroll's target ref mounts
 * on the same render as the hook. Calling useScroll in the parent — where the
 * track only renders once projects load — left the ref null on first commit and
 * threw Motion's "defined but not hydrated" invariant, which aborted the rest
 * of that commit's effects and silently killed the masthead's entrance.
 */
function PinnedReel({ projects }: { projects: ReelProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });

  // Each card is ~78vw wide including its gap; the track travels the overflow.
  const travel = Math.max(projects.length - 1, 0) * 78;
  const x = useTransform(smooth, [0, 1], ["0vw", `-${travel}vw`]);

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
      style={{ height: `${Math.max(projects.length, 1) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.ul
          role="list"
          className="flex gap-[4vw] pl-10 pr-[22vw]"
          style={prefersReduced ? undefined : { x, willChange: "transform" }}
        >
          {projects.map((project, index) => (
            <li key={project.id} className="w-[74vw] shrink-0 lg:w-[68vw]">
              <ProjectPlate project={project} index={index} />
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/*
 * Dark plate on paper. The act-ink class flips the semantic tokens inside the
 * card, so the browser mockup's chrome picks up ink borders and a dark address
 * bar without restating any colours.
 */
function ProjectPlate({ project, index }: { project: ReelProject; index: number }) {
  return (
    <TiltCard max={6} glare>
      {/*
       * Height is tuned to the 16:9 mockup. At 68vh the device floated in a
       * pool of dead space and the text column stretched to match it.
       */}
      <article className="act-ink grid gap-0 border border-border md:min-h-[54vh] md:grid-cols-2">
        <div className="relative order-2 md:order-1 flex flex-col justify-between p-7 md:p-10">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="type-marginalia text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="type-marginalia text-foreground-muted">Fig. {index + 2}</span>
            </div>

            <h3 className="mt-6 font-display text-4xl leading-none text-foreground lg:text-6xl">
              {project.title}
            </h3>

            <p className="mt-5 max-w-md text-foreground-muted leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="mt-8">
            <ul role="list" className="flex flex-wrap gap-x-4 gap-y-2">
              {project.techStack.map((tech) => (
                <li key={tech} className="type-marginalia text-foreground-muted">
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-6">
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-marginalia border-b border-accent pb-1 text-accent transition-opacity hover:opacity-70"
              >
                Visit site →
              </Link>
              {project.sourceUrl ? (
                <Link
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-marginalia border-b border-border pb-1 text-foreground-muted transition-colors hover:text-foreground"
                >
                  Source
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 relative flex items-center justify-center border-b border-border p-6 md:border-b-0 md:border-l md:p-8">
          {project.image ? (
            <DeviceFrame
              src={project.image}
              alt={`${project.title} screenshot`}
              url={project.liveUrl}
              unoptimized
              sizes="(max-width: 768px) 88vw, 38vw"
            />
          ) : (
            <div className="aspect-16/9 w-full bg-background-alt" />
          )}
        </div>
      </article>
    </TiltCard>
  );
}
