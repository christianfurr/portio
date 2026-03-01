"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { SpymastersTeaserModal } from "@/components/easter-eggs/SpymastersTeaserModal";
import { StageLinkCurtain } from "@/components/easter-eggs/StageLinkCurtain";
import { BYUShootModal } from "@/components/easter-eggs/BYUShootModal";

type ProjectFeatureProps = {
  project: Project;
  index: number;
};

export function ProjectFeature({ project, index }: ProjectFeatureProps) {
  const imageLeft = index === 1;
  const [spyOpen, setSpyOpen] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [shootOpen, setShootOpen] = useState(false);

  const handleImageDoubleClick = () => {
    if (project.title === "Spymasters") setSpyOpen(true);
    if (project.title === "StageLink") setCurtainOpen(true);
    if (project.title === "BYU Basketball Roster") setShootOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:gap-16"
    >
      {/* Content column - order changes on desktop */}
      <div
        className={`flex flex-col justify-center ${imageLeft ? "md:order-2" : "md:order-1"}`}
      >
        <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-foreground-muted leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background-alt px-3 py-1 text-sm text-foreground-muted"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={`View ${project.title} live demo`}
          >
            Live Demo
          </a>
          {project.sourceUrl ? (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`View ${project.title} source code`}
            >
              Source
            </a>
          ) : null}
        </div>
      </div>

      {/* Image column */}
      <div
        className={`${imageLeft ? "md:order-1" : "md:order-2"}`}
      >
        <motion.div
          className="group overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-200 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onDoubleClick={handleImageDoubleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleImageDoubleClick();
            }
          }}
          aria-label={`Double-click for ${project.title} easter egg`}
        >
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            width={1200}
            height={800}
            className="w-full rounded-2xl border border-border object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>

      {spyOpen && (
        <SpymastersTeaserModal onClose={() => setSpyOpen(false)} />
      )}
      {curtainOpen && (
        <StageLinkCurtain onClose={() => setCurtainOpen(false)} />
      )}
      {shootOpen && (
        <BYUShootModal onClose={() => setShootOpen(false)} />
      )}
    </motion.article>
  );
}
