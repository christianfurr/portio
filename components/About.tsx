import { PortraitWithEgg } from "@/components/easter-eggs/PortraitWithEgg";

export function About() {
  return (
    <section
      id="about"
      className="bg-background-alt px-6 py-24 md:py-36"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <PortraitWithEgg />
          <div className="max-w-xl">
            <h2
              id="about-heading"
              className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              About
            </h2>
            <p className="mt-4 text-foreground-muted leading-relaxed">
              I’m a full stack developer with an eye for polish and performance.
              I care about building interfaces that feel fast and intentional,
              and I’m especially interested in real-time systems and the
              infrastructure that makes them possible. I’ve worked across the
              stack at internships and on side projects, and I’m always looking
              for the next problem that rewards both craft and scale.
            </p>
            <div className="mt-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
                Currently building
              </h3>
              <ul className="mt-3 space-y-2 text-foreground" role="list">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>Real-time collaboration and low-latency web experiences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>Developer tools and dashboards that stay out of the way.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>Clean, accessible UIs with a focus on performance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
