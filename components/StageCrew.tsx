"use client";

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CueLabel } from "@/components/CueLabel";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const roleIcons: Record<string, string> = {
  "Sound Engineer": "🎧",
  "Stage Manager": "🎬",
};

const proficiencyStyles: Record<string, { label: string; bg: string; text: string }> = {
  pro: {
    label: "Pro",
    bg: "bg-accent/15 border-accent/30",
    text: "text-accent",
  },
  familiar: {
    label: "Familiar",
    bg: "bg-glow-blue/15 border-glow-blue/30",
    text: "text-glow-blue",
  },
};

export function StageCrew() {
  const stageCrew = useQuery(api.stageCrew.get);

  if (!stageCrew) {
    return (
      <section
        id="stage-crew"
        className="relative overflow-hidden px-6 py-24 md:py-36"
        aria-labelledby="stage-crew-heading"
      >
        <div className="relative mx-auto max-w-[1200px]">
          <div className="h-10 w-48 animate-pulse rounded bg-border" />
          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-border" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-border" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="stage-crew"
      className="relative overflow-hidden px-6 py-24 md:py-36"
      aria-labelledby="stage-crew-heading"
    >
      {/* Decorative glows */}
      <div
        className="absolute -right-24 top-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -left-16 bottom-1/4 h-[380px] w-[380px] rounded-full bg-glow-royal/12 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Header */}
        <CueLabel cue="03" label="Backstage" />
        <motion.h2
          id="stage-crew-heading"
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
          variants={fadeUp}
        >
          {stageCrew.heading}
        </motion.h2>
        <motion.p
          className="mt-4 max-w-2xl text-foreground-muted leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={1}
          variants={fadeUp}
        >
          {stageCrew.bio}
        </motion.p>

        {/* Roles */}
        {stageCrew.roles.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {stageCrew.roles.map((r, i) => (
              <motion.div
                key={r.role}
                className="group relative rounded-2xl border border-border bg-background-alt/50 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i + 2}
                variants={fadeUp}
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-glow-royal/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <span className="text-2xl" aria-hidden>
                    {roleIcons[r.role] || "🎭"}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {r.role}
                  </h3>
                  <p className="mt-1 text-sm text-foreground-muted leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Show History */}
        {stageCrew.shows.length > 0 && (
          <motion.div
            className="mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={4}
            variants={fadeUp}
          >
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
              Show History
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stageCrew.shows.map((show, i) => (
                <motion.div
                  key={`${show.title}-${i}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-background-alt/30 px-4 py-3 transition-colors hover:border-border/80"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={i * 0.5 + 5}
                  variants={fadeUp}
                >
                  <span className="font-medium text-foreground">{show.title}</span>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {show.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Equipment & Software */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* Equipment */}
          {stageCrew.equipment.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={7}
              variants={fadeUp}
            >
              <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
                Equipment
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {stageCrew.equipment.map((eq, i) => (
                  <li
                    key={`${eq.name}-${i}`}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="text-foreground">{eq.name}</span>
                    <span className="text-xs text-foreground-muted">
                      {eq.category}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Software */}
          {stageCrew.software.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={8}
              variants={fadeUp}
            >
              <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
                Software
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {stageCrew.software.map((sw, i) => {
                  const style = proficiencyStyles[sw.proficiency] || proficiencyStyles.familiar;
                  return (
                    <li
                      key={`${sw.name}-${i}`}
                      className="flex items-center gap-3"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow-royal" aria-hidden />
                      <span className="text-foreground">{sw.name}</span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
