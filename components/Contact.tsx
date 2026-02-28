export function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-24 md:py-36"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1200px] text-center">
        <h2
          id="contact-heading"
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          Let’s build something exceptional.
        </h2>
        <p className="mt-4 text-foreground-muted">
          Reach out for projects, collaboration, or a quick chat.
        </p>
        <a
          href="mailto:me@christianfurr.dev"
          className="mt-8 inline-block text-2xl font-medium text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-3xl"
          aria-label="Email me at me@christianfurr.dev"
        >
          me@christianfurr.dev
        </a>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/christianfurr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Christian Furr on GitHub"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Stage-Link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Stage-Link on GitHub"
          >
            Stage-Link
          </a>
          <a
            href="mailto:me@christianfurr.dev"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Email me"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
