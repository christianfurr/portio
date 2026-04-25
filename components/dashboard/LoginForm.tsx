"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function LoginForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-sm text-foreground-muted mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="you@example.com"
              autoFocus
              required
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Enter password"
              required
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
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
            disabled={isSubmitting}
            className="w-full rounded-xl px-4 py-3 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #0066cc 100%)",
              boxShadow: "0 4px 14px rgba(10, 132, 255, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(10,132,255,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(10,132,255,0.3)";
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
