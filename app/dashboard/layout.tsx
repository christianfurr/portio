"use client";

import { ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { ToastProvider } from "@/components/dashboard/ToastProvider";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

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
    return <LoginForm />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="mx-auto max-w-7xl px-6 py-8" style={{ paddingTop: "96px" }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </ToastProvider>
  );
}
