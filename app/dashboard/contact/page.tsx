"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ContactForm {
  heading: string;
  subtext: string;
}

const emptyForm: ContactForm = {
  heading: "",
  subtext: "",
};

export default function ContactPage() {
  const contact = useQuery(api.contact.get);
  const upsertContact = useMutation(api.contact.upsert);

  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Load existing data when available
  useEffect(() => {
    if (contact) {
      setForm({
        heading: contact.heading,
        subtext: contact.subtext,
      });
    }
  }, [contact]);

  // Track changes
  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await upsertContact(form);
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

  if (contact === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Contact Section</h2>
        <p className="mt-4 text-foreground-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Contact Section</h2>
          <p className="mt-2 text-foreground-muted">
            Edit the contact section of your portfolio.
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
            placeholder="Get In Touch"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Subtext
          </label>
          <textarea
            value={form.subtext}
            onChange={(e) => handleChange("subtext", e.target.value)}
            rows={3}
            placeholder="I'm always open to discussing new projects or opportunities..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Text displayed below the contact heading
          </p>
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

      <div className="mt-8 rounded-lg border border-border bg-background-alt p-4">
        <h3 className="font-medium text-foreground">Note</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Social links and email are managed in the{" "}
          <a href="/dashboard/settings" className="text-accent hover:underline">
            Settings
          </a>{" "}
          page and will appear in the contact section.
        </p>
      </div>
    </div>
  );
}
