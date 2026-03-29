"use client";

import React, { ReactNode, useState } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "32px",
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
            fontSize: "13px",
          }}
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span style={{ color: "var(--muted)", opacity: 0.5 }}>/</span>
              )}
              {crumb.href ? (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              ) : (
                <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header content */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--foreground)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "15px",
                color: "var(--muted)",
                lineHeight: 1.5,
                maxWidth: "600px",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  );
}

function BreadcrumbLink({ href, children }: { href: string; children: ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? "var(--accent)" : "var(--muted)",
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
    >
      {children}
    </a>
  );
}

// Divider for separating sections
export function PageDivider() {
  return (
    <hr
      style={{
        border: "none",
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        margin: "32px 0",
      }}
    />
  );
}

// Section header for subsections within a page
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--foreground)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "14px",
              color: "var(--muted)",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

export default PageHeader;
