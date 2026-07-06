"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/hero", label: "Hero" },
  { href: "/dashboard/about", label: "About" },
  { href: "/dashboard/stage-crew", label: "Stage Crew" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/photos", label: "Photos" },
  { href: "/dashboard/contact", label: "Contact" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/sessions", label: "Sessions" },
];

export function DashboardNav() {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on navigation — state adjustment during render
  // (per React docs) instead of a cascading setState-in-effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(26,26,26,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-lg font-semibold text-foreground transition-all hover:text-accent"
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--accent) 0%, #0066cc 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 5C3 3.89543 3.89543 3 5 3H11C12.1046 3 13 3.89543 13 5V11C13 12.1046 12.1046 13 11 13H5C3.89543 13 3 12.1046 3 11V5Z" stroke="white" strokeWidth="1.5" />
              <path d="M3 7H13" stroke="white" strokeWidth="1.5" />
              <path d="M7 7V13" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          Dashboard
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  color: active ? "var(--foreground)" : "var(--muted)",
                  background: active ? "rgba(10,132,255,0.1)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--foreground)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            );
          })}
          <div style={{ width: "1px", height: "24px", background: "var(--border)", margin: "0 8px" }} />
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--error)";
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Logout
          </button>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--foreground)" }}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 6h16" strokeLinecap="round" />
                <path d="M4 12h16" strokeLinecap="round" />
                <path d="M4 18h16" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden animate-fade-in-down"
          style={{ background: "var(--card)", borderTop: "1px solid var(--border)", padding: "16px" }}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-all"
                  style={{
                    color: active ? "var(--foreground)" : "var(--muted)",
                    background: active ? "rgba(10,132,255,0.1)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
            <button
              onClick={() => signOut()}
              className="px-4 py-3 text-sm font-medium rounded-lg text-left transition-all"
              style={{ color: "var(--error)" }}
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
