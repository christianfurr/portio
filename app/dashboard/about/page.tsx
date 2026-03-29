"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AboutForm {
  heading: string;
  bio: string;
  currentlyBuildingHeading: string;
  currentlyBuilding: string[];
}

const emptyForm: AboutForm = {
  heading: "",
  bio: "",
  currentlyBuildingHeading: "",
  currentlyBuilding: [],
};

export default function AboutPage() {
  const about = useQuery(api.about.get);
  const upsertAbout = useMutation(api.about.upsert);

  const [form, setForm] = useState<AboutForm>(emptyForm);
  const [currentlyBuildingText, setCurrentlyBuildingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Load existing data when available
  useEffect(() => {
    if (about) {
      setForm({
        heading: about.heading,
        bio: about.bio,
        currentlyBuildingHeading: about.currentlyBuildingHeading,
        currentlyBuilding: about.currentlyBuilding,
      });
      setCurrentlyBuildingText(about.currentlyBuilding.join("\n"));
    }
  }, [about]);

  // Track changes
  const handleChange = (field: keyof Omit<AboutForm, "currentlyBuilding">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Handle currently building list changes
  const handleCurrentlyBuildingChange = (value: string) => {
    setCurrentlyBuildingText(value);
    const items = value.split("\n").filter((line) => line.trim() !== "");
    setForm((prev) => ({ ...prev, currentlyBuilding: items }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Save changes
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
          <p className="mt-2 text-foreground-muted">
            Edit the about section of your portfolio.
          </p>
        </div>
        {savedMessage && (
          <span className="text-sm text-green-500">Changes saved!</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Section Heading
          </label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="About Me"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={6}
            placeholder="Tell visitors about yourself..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Your personal bio or introduction
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="mb-4 font-medium text-foreground">
            Currently Building Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Section Heading
              </label>
              <input
                type="text"
                value={form.currentlyBuildingHeading}
                onChange={(e) => handleChange("currentlyBuildingHeading", e.target.value)}
                placeholder="Currently Building"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Items (one per line)
              </label>
              <textarea
                value={currentlyBuildingText}
                onChange={(e) => handleCurrentlyBuildingChange(e.target.value)}
                rows={4}
                placeholder="A new feature for my portfolio&#10;Learning Rust&#10;Contributing to open source"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="mt-1 text-xs text-foreground-muted">
                {form.currentlyBuilding.length} item{form.currentlyBuilding.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="rounded-lg bg-accent px-6 py-2 font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          {hasChanges && (
            <span className="text-sm text-foreground-muted">
              You have unsaved changes
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
