import { projects } from "@/data/projects";
import { ProjectFeature } from "./ProjectFeature";

export function Projects() {
  return (
    <section
      id="work"
      className="px-6 pt-32 pb-24 md:pt-48 md:pb-36"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="work-heading"
          className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          Work
        </h2>
        <p className="mb-16 max-w-xl text-foreground-muted">
          Selected projects I’ve built and shipped.
        </p>
        <div className="divide-y divide-border">
          {projects.map((project, index) => (
            <ProjectFeature key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
