"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ReactMarkdown from "react-markdown";

interface AboutForm {
  heading: string;
  bio: string;
  currentlyBuildingHeading: string;
  currentlyBuilding: string[];
  isDraft: boolean;
}

const emptyForm: AboutForm = {
  heading: "",
  bio: "",
  currentlyBuildingHeading: "",
  currentlyBuilding: [],
  isDraft: false,
};

export default function AboutPage() {
  const about = useQuery(api.about.get);
  const upsertAbout = useMutation(api.about.upsert);

  const [form, setForm] = useState<AboutForm>(emptyForm);
  const [currentlyBuildingText, setCurrentlyBuildingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [bioTab, setBioTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (about) {
      setForm({
        heading: about.heading,
        bio: about.bio,
        currentlyBuildingHeading: about.currentlyBuildingHeading,
        currentlyBuilding: about.currentlyBuilding,
        isDraft: about.isDraft ?? false,
      });
      setCurrentlyBuildingText(about.currentlyBuilding.join("\n"));
    }
  }, [about]);

  const handleChange = (field: keyof Omit<AboutForm, "currentlyBuilding" | "isDraft">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  const handleCurrentlyBuildingChange = (value: string) => {
    setCurrentlyBuildingText(value);
    const items = value.split("\n").filter((line) => line.trim() !== "");
    setForm((prev) => ({ ...prev, currentlyBuilding: items }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await upsertAbout(form);
      setHasChanges(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (about === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground">About Section</h2>
        <p className="mt-4 text-foreground-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">About Section</h2>
          <p className="mt-2 text-foreground-muted">Edit the about section of your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          {form.isDraft && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#f59e0b",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Draft
            </span>
          )}
          {savedMessage && <span className="text-sm text-green-500">Saved!</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Section Heading</label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="About Me"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Markdown bio editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <div style={{ display: "flex", gap: "2px", background: "var(--border)", borderRadius: "8px", padding: "2px" }}>
              {(["write", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBioTab(tab)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: bioTab === tab ? "var(--card)" : "transparent",
                    color: bioTab === tab ? "var(--foreground)" : "var(--muted)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {tab === "write" ? "Write" : "Preview"}
                </button>
              ))}
            </div>
          </div>
          {bioTab === "write" ? (
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={8}
              placeholder="Tell visitors about yourself... Supports **bold**, *italic*, and [links](https://url)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm"
            />
          ) : (
            <div
              style={{
                minHeight: "160px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              {form.bio ? (
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                        {children}
                      </a>
                    ),
                    p: ({ children }) => <p style={{ marginBottom: "12px" }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>{children}</strong>,
                  }}
                >
                  {form.bio}
                </ReactMarkdown>
              ) : (
                <span style={{ color: "var(--muted)" }}>Nothing to preview yet.</span>
              )}
            </div>
          )}
          <p className="mt-1 text-xs text-foreground-muted">
            Supports Markdown: **bold**, *italic*, [links](url)
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="mb-4 font-medium text-foreground">Currently Building Section</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Section Heading</label>
              <input
                type="text"
                value={form.currentlyBuildingHeading}
                onChange={(e) => handleChange("currentlyBuildingHeading", e.target.value)}
                placeholder="Currently Building"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Items (one per line)</label>
              <textarea
                value={currentlyBuildingText}
                onChange={(e) => handleCurrentlyBuildingChange(e.target.value)}
                rows={4}
                placeholder={"A new feature for my portfolio\nLearning Rust\nContributing to open source"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="mt-1 text-xs text-foreground-muted">
                {form.currentlyBuilding.length} item{form.currentlyBuilding.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Draft toggle + save */}
        <div className="border-t border-border pt-6 space-y-4">
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.isDraft}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, isDraft: e.target.checked }));
                setHasChanges(true);
              }}
              style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }}
            />
            <span className="text-sm font-medium text-foreground">Save as draft</span>
            <span className="text-xs text-foreground-muted">(hides this section from your public site)</span>
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="rounded-lg bg-accent px-6 py-2 font-medium text-white hover:bg-accent/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            {hasChanges && <span className="text-sm text-foreground-muted">Unsaved changes</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
