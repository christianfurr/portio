"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard, StatsIcons } from "@/components/dashboard/StatsCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/dashboard/Card";
import { SkeletonStatsCard, SkeletonActivityItem } from "@/components/dashboard/Skeleton";

export default function DashboardPage() {
  const stats = useQuery(api.analytics.getContentStats);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const activityFeed = useQuery(api.analytics.getActivityFeed, {
    limit: 20,
    typeFilter: activityFilter === "all" ? undefined : activityFilter,
  });
  const activityTypes = useQuery(api.analytics.getActivityTypes);

  const isLoading = stats === undefined || activityFeed === undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Content statistics and recent activity"
      />

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonStatsCard />
            <SkeletonStatsCard />
            <SkeletonStatsCard />
            <SkeletonStatsCard />
          </>
        ) : (
          <>
            <div className="animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
              <StatsCard
                title="Photos"
                value={stats.photoCount}
                subtitle="In gallery"
                icon={StatsIcons.photos}
                accentColor="#0a84ff"
              />
            </div>
            <div className="animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
              <StatsCard
                title="Projects"
                value={stats.projectCount}
                subtitle="Portfolio items"
                icon={StatsIcons.projects}
                accentColor="#22c55e"
              />
            </div>
            <div className="animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
              <StatsCard
                title="Storage"
                value={parseFloat(stats.totalStorageMB)}
                subtitle="MB used"
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 17a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 17h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                accentColor="#f59e0b"
              />
            </div>
            <div className="animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
              <StatsCard
                title="Total Items"
                value={stats.photoCount + stats.projectCount}
                subtitle="All content"
                icon={StatsIcons.activity}
                accentColor="#a855f7"
              />
            </div>
          </>
        )}
      </div>

      {/* Activity Feed Section */}
      <Card variant="default" className="animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes and uploads</CardDescription>
            </div>

            {/* Activity Filter */}
            {activityTypes && activityTypes.length > 0 && (
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                style={{
                  padding: "8px 32px 8px 12px",
                  fontSize: "14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1a6' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  transition: "all 0.15s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10, 132, 255, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="all">All Activity</option>
                {activityTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </div>
          ) : activityFeed.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "var(--muted)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 16px",
                  borderRadius: "12px",
                  background: "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <p style={{ fontWeight: 500, marginBottom: "4px" }}>No activity yet</p>
              <p style={{ fontSize: "13px" }}>Activity will appear here as you make changes</p>
            </div>
          ) : (
            <div className="custom-scrollbar" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {activityFeed.map((activity, index) => (
                <div
                  key={activity._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s`, opacity: 0 }}
                >
                  <ActivityItem activity={activity} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.35s", opacity: 0 }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: "16px",
          }}
        >
          Quick Actions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            href="/dashboard/photos"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="Upload Photos"
            description="Add to gallery"
            color="#0a84ff"
          />
          <QuickActionCard
            href="/dashboard/projects"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="Add Project"
            description="Create new project"
            color="#22c55e"
          />
          <QuickActionCard
            href="/dashboard/hero"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9 4H5a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-4m-7 0l7-7m0 0v4m0-4h-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Edit Hero"
            description="Update homepage"
            color="#f59e0b"
          />
          <QuickActionCard
            href="/dashboard/settings"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M10 2v2m0 12v2m-8-8h2m12 0h2M4.93 4.93l1.41 1.41m7.32 7.32l1.41 1.41m0-10.14l-1.41 1.41m-7.32 7.32l-1.41 1.41"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
            title="Settings"
            description="Configure site"
            color="#a855f7"
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "block",
        padding: "20px",
        borderRadius: "16px",
        border: `1px solid ${isHovered ? `${color}40` : "var(--border)"}`,
        background: isHovered ? `linear-gradient(135deg, var(--card) 0%, ${color}08 100%)` : "var(--card)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? `0 8px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px ${color}20` : "none",
        textDecoration: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${color}15`,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          {icon}
        </div>
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            {title}
          </h4>
          <p
            style={{
              margin: "2px 0 0 0",
              fontSize: "13px",
              color: "var(--muted)",
            }}
          >
            {description}
          </p>
        </div>
        <div
          style={{
            marginLeft: "auto",
            color: "var(--muted)",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-8px)",
            transition: "all 0.3s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: Doc<"activityLog"> }) {
  const [isHovered, setIsHovered] = useState(false);

  const getActivityIcon = (type: string) => {
    if (type.includes("upload") || type.includes("photo_")) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M14 10l-3-3c-.3-.3-.7-.3-1 0L6 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    }
    if (type.includes("project")) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 5a1.5 1.5 0 011.5-1.5h7A1.5 1.5 0 0113 5v6a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 11V5z" stroke="currentColor" strokeWidth="1.25" />
          <path d="M3 7h10" stroke="currentColor" strokeWidth="1.25" />
          <path d="M7 7v5.5" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    }
    if (type.includes("updated") || type.includes("hero") || type.includes("about") || type.includes("contact") || type.includes("settings")) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8.5 3.5H5a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8M6.5 9.5l6-6M12.5 3.5v2.5h-2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type.includes("delete")) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 5l-.65 7.82a1.5 1.5 0 01-1.5 1.38H5.15a1.5 1.5 0 01-1.5-1.38L3 5m3.5 3v4m3-4v4M4 5h8m-2-2h-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    );
  };

  const getActivityColor = (type: string): string => {
    if (type.includes("upload") || type.includes("created")) return "#22c55e";
    if (type.includes("delete")) return "#ef4444";
    if (type.includes("update")) return "#0a84ff";
    return "#a855f7";
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const color = getActivityColor(activity.type);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px",
        marginLeft: "-14px",
        marginRight: "-14px",
        borderRadius: "12px",
        background: isHovered ? "rgba(255, 255, 255, 0.03)" : "transparent",
        transition: "background 0.15s ease",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: `${color}15`,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {getActivityIcon(activity.type)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--foreground)",
            lineHeight: 1.4,
          }}
        >
          {activity.description}
        </p>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          {formatTimeAgo(activity._creationTime)}
        </p>
      </div>
    </div>
  );
}
