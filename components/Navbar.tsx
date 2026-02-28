"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-6 left-1/2 z-50 w-fit max-w-[min(90vw,40rem)] -translate-x-1/2"
      role="banner"
    >
      <nav
        className="flex h-12 items-center justify-between gap-12 rounded-full border border-border bg-black/20 px-8 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-xl"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={handleBrandClick}
          className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Christian Furr, go to top"
        >
          Christian Furr
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="#work"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
