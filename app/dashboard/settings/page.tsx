"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  email: string;
  socialLinks: SocialLink[];
}

const emptyForm: SettingsForm = {
  siteName: "",
  siteDescription: "",
  email: "",
  socialLinks: [],
};

const emptySocialLink: SocialLink = {
  platform: "",
  url: "",
  label: "",
};

export default function SettingsPage() {
  const settings = useQuery(api.siteSettings.get);
  const upsertSettings = useMutation(api.siteSettings.upsert);

  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Load existing data when available
  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        email: settings.email,
        socialLinks: settings.socialLinks,
      });
    }
  }, [settings]);

  // Track changes
  const handleChange = (field: keyof Omit<SettingsForm, "socialLinks">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Social link handlers
  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...emptySocialLink }],
    }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  const removeSocialLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  const moveSocialLink = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= form.socialLinks.length) return;

    setForm((prev) => {
      const newLinks = [...prev.socialLinks];
      const [moved] = newLinks.splice(index, 1);
      newLinks.splice(newIndex, 0, moved);
      return { ...prev, socialLinks: newLinks };
    });
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await upsertSettings(form);
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

  if (settings === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Site Settings</h2>
        <p className="mt-4 text-foreground-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Site Settings</h2>
          <p className="mt-2 text-foreground-muted">
            Manage site-wide settings, SEO, and social links.
          </p>
        </div>
        {savedMessage && (
          <span className="text-sm text-green-500">Changes saved!</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        {/* Site Info */}
        <div>
          <h3 className="mb-4 font-medium text-foreground">Site Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Site Name
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                placeholder="John Doe Portfolio"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="mt-1 text-xs text-foreground-muted">
                Used for page titles and SEO
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Site Description
              </label>
              <textarea
                value={form.siteDescription}
                onChange={(e) => handleChange("siteDescription", e.target.value)}
                rows={2}
                placeholder="Full-stack developer portfolio showcasing projects and skills..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="mt-1 text-xs text-foreground-muted">
                Used for meta description and SEO
              </p>
            </div>
          </div>
        </div>

        {/* Contact Email */}
        <div className="border-t border-border pt-6">
          <h3 className="mb-4 font-medium text-foreground">Contact</h3>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="hello@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="mt-1 text-xs text-foreground-muted">
              Displayed in the contact section
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-foreground">Social Links</h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="rounded-lg border border-border px-3 py-1 text-sm text-foreground-muted transition-colors hover:border-accent hover:text-accent"
            >
              Add Link
            </button>
          </div>
          {form.socialLinks.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              No social links yet. Click &quot;Add Link&quot; to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {form.socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-background-alt p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Link {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, "up")}
                        disabled={index === 0}
                        className="text-foreground-muted hover:text-foreground disabled:opacity-30"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, "down")}
                        disabled={index === form.socialLinks.length - 1}
                        className="text-foreground-muted hover:text-foreground disabled:opacity-30"
                      >
                        &darr;
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-foreground-muted">
                        Platform
                      </label>
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(index, "platform", e.target.value)
                        }
                        placeholder="GitHub"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-foreground-muted">
                        URL
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                        placeholder="https://github.com/..."
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-foreground-muted">
                        Label (for accessibility)
                      </label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          updateSocialLink(index, "label", e.target.value)
                        }
                        placeholder="View my GitHub profile"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
