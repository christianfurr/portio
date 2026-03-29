"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ToastProvider } from "@/components/dashboard/ToastProvider";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/hero", label: "Hero" },
  { href: "/dashboard/about", label: "About" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/photos", label: "Photos" },
  { href: "/dashboard/contact", label: "Contact" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem("dashboard_auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("dashboard_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dashboard_auth");
    setIsAuthenticated(false);
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid var(--border)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <div className="text-foreground-muted text-sm">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div
          className="w-full max-w-sm animate-fade-in-up"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "32px",
          }}
        >
          <div className="text-center mb-8">
            <div
              style={{
                width: "48px",
                height: "48px",
                margin: "0 auto 16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--accent) 0%, #0066cc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
            <p className="text-sm text-foreground-muted mt-1">Enter your password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground-muted"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Enter password"
                autoFocus
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            {error && (
              <p
                className="text-sm animate-fade-in"
                style={{
                  color: "var(--error)",
                  background: "rgba(239, 68, 68, 0.1)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, #0066cc 100%)",
                boxShadow: "0 4px 14px rgba(10, 132, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(10, 132, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(10, 132, 255, 0.3)";
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(10, 10, 10, 0.85)" : "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo */}
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
                  <path
                    d="M3 5C3 3.89543 3.89543 3 5 3H11C12.1046 3 13 3.89543 13 5V11C13 12.1046 12.1046 13 11 13H5C3.89543 13 3 12.1046 3 11V5Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path d="M3 7H13" stroke="white" strokeWidth="1.5" />
                  <path d="M7 7V13" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              Dashboard
            </Link>

            {/* Desktop Navigation */}
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
                      background: active ? "rgba(10, 132, 255, 0.1)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "var(--foreground)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
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
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "var(--border)",
                  margin: "0 8px",
                }}
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--error)";
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Logout
              </button>
            </nav>

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="md:hidden animate-fade-in-down"
              style={{
                background: "var(--card)",
                borderTop: "1px solid var(--border)",
                padding: "16px",
              }}
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
                        background: active ? "rgba(10, 132, 255, 0.1)" : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    margin: "8px 0",
                  }}
                />
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-medium rounded-lg text-left transition-all"
                  style={{ color: "var(--error)" }}
                >
                  Logout
                </button>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main
          className="mx-auto max-w-7xl px-6 py-8"
          style={{ paddingTop: "96px" }}
        >
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
