"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.05)",
          }}
        >
          <p style={{ color: "var(--error)", fontWeight: 500, marginBottom: "8px" }}>
            Something went wrong
          </p>
          <p style={{ color: "var(--muted)", fontSize: "13px", fontFamily: "monospace" }}>
            {this.state.error?.message ?? "Unknown error"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              marginTop: "12px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--foreground)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
