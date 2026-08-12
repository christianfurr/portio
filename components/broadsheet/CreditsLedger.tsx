"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { KineticHeading } from "@/components/kinetic/KineticHeading";
import { ScrollAxisText } from "@/components/kinetic/Parallax";

/* Production credits and equipment, set like end credits: title left, role right. */
export function CreditsLedger() {
  const stageCrew = useQuery(api.stageCrew.get);

  if (stageCrew === undefined) {
    return (
      <section className="px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-64 w-full animate-pulse bg-background-alt" />
        </div>
      </section>
    );
  }

  if (stageCrew === null) return null;

  return (
    <section
      id="credits"
      className="relative px-5 pb-24 md:px-10 md:pb-32"
      aria-labelledby="credits-heading"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="h-px w-full bg-foreground" />
        <div className="flex items-baseline justify-between gap-6 py-3">
          <span className="type-marginalia text-foreground-muted">Section 03</span>
          <span className="type-marginalia text-foreground-muted">Credits</span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <KineticHeading
              as="h2"
              text={stageCrew.heading}
              className="type-display text-foreground"
              wght={[200, 620]}
              soft={[100, 24]}
              wonk={[1, 0]}
            />
            <p className="type-lede mt-6 max-w-md text-foreground-muted">{stageCrew.bio}</p>

            <ul role="list" className="mt-10 space-y-6">
              {stageCrew.roles.map((role) => (
                <li key={role.role} className="border-t border-border pt-4">
                  <h3 className="font-display text-2xl text-foreground">{role.role}</h3>
                  <p className="mt-2 text-foreground-muted">{role.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Credit list, set like end credits: role right, title left. */}
          <div className="md:col-span-7">
            <h3 className="type-marginalia text-foreground-muted">Production credits</h3>
            <ul role="list" className="mt-5">
              {stageCrew.shows.map((show) => (
                <li
                  key={`${show.title}-${show.role}`}
                  className="flex items-baseline justify-between gap-6 border-b border-border py-4"
                >
                  <ScrollAxisText
                    className="font-display text-xl text-foreground md:text-3xl"
                    wght={[280, 540]}
                    wonk={[1, 0]}
                    soft={[90, 12]}
                  >
                    {show.title}
                  </ScrollAxisText>
                  <span className="type-marginalia shrink-0 text-foreground-muted">
                    {show.role}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="type-marginalia mt-12 text-foreground-muted">Equipment</h3>
            <ul role="list" className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {stageCrew.equipment.map((item) => (
                <li key={item.name} className="type-marginalia text-foreground">
                  {item.name}
                  <span className="ml-2 text-foreground-muted">{item.category}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
