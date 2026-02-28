import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border px-6 py-6 md:px-8"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-foreground-muted">
          © {year} Christian Furr
        </p>
        <Link
          href="https://github.com/christianfurr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Christian Furr on GitHub"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
