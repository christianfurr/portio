"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/dashboard/Card";
import { useToast } from "@/components/dashboard/ToastProvider";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function SessionsPage() {
  const sessions = useQuery(api.sessions.list);
  const revoke = useMutation(api.sessions.revoke);
  const revokeAll = useMutation(api.sessions.revokeAll);
  const toast = useToast();
  const [revoking, setRevoking] = useState<Set<string>>(new Set());
  const [revokingAll, setRevokingAll] = useState(false);

  const handleRevoke = async (sessionId: Id<"authSessions">) => {
    setRevoking((prev) => new Set(prev).add(sessionId));
    try {
      await revoke({ sessionId });
      toast.success("Session revoked", "That session can no longer access the dashboard.");
    } catch (err) {
      toast.error("Failed to revoke", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRevoking((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Revoke all sessions? You will be signed out.")) return;
    setRevokingAll(true);
    try {
      const count = await revokeAll({});
      toast.success(`Revoked ${count} session(s)`, "All sessions cleared.");
    } catch (err) {
      toast.error("Failed to revoke all", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRevokingAll(false);
    }
  };

  const activeSessions = sessions?.filter((s) => !s.isExpired) ?? [];
  const expiredSessions = sessions?.filter((s) => s.isExpired) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sessions"
        description="Manage active login sessions for your account."
        action={
          activeSessions.length > 0 && (
            <button
              onClick={handleRevokeAll}
              disabled={revokingAll}
              className="rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
              style={{
                border: "1px solid rgba(239,68,68,0.4)",
                color: "var(--error)",
                background: "rgba(239,68,68,0.05)",
              }}
            >
              {revokingAll ? "Revoking..." : "Revoke All"}
            </button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            {activeSessions.length === 0
              ? "No active sessions"
              : `${activeSessions.length} active session${activeSessions.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions === undefined ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Loading...</p>
          ) : activeSessions.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No active sessions found.</p>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <SessionRow
                  key={session._id}
                  session={session}
                  onRevoke={() => handleRevoke(session._id as Id<"authSessions">)}
                  isRevoking={revoking.has(session._id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {expiredSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expired Sessions</CardTitle>
            <CardDescription>These sessions are no longer valid.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredSessions.map((session) => (
                <SessionRow
                  key={session._id}
                  session={session}
                  onRevoke={() => handleRevoke(session._id as Id<"authSessions">)}
                  isRevoking={revoking.has(session._id)}
                  expired
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SessionRow({
  session,
  onRevoke,
  isRevoking,
  expired,
}: {
  session: { _id: string; _creationTime: number; expirationTime: number; isExpired: boolean };
  onRevoke: () => void;
  isRevoking: boolean;
  expired?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "var(--background)",
        opacity: expired ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: expired ? "var(--border)" : "rgba(10,132,255,0.1)",
          color: expired ? "var(--muted)" : "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2a5 5 0 100 10A5 5 0 009 2zm0 12c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z" fill="currentColor" opacity="0.8" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--foreground)" }}>
          Session created {timeAgo(session._creationTime)}
        </p>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
          Started {formatDate(session._creationTime)} · Expires {formatDate(session.expirationTime)}
        </p>
      </div>

      {expired ? (
        <span style={{ fontSize: "12px", color: "var(--muted)", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          Expired
        </span>
      ) : (
        <button
          onClick={onRevoke}
          disabled={isRevoking}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid rgba(239,68,68,0.4)",
            background: "rgba(239,68,68,0.05)",
            color: "var(--error)",
            fontSize: "13px",
            cursor: "pointer",
            opacity: isRevoking ? 0.5 : 1,
            transition: "all 0.15s",
          }}
        >
          {isRevoking ? "Revoking..." : "Revoke"}
        </button>
      )}
    </div>
  );
}
