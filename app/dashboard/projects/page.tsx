"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";
import {
  optimizeImage,
  isValidImageType,
  formatFileSize,
} from "@/lib/image-optimization";

interface ProjectForm {
  title: string;
  description: string;
  liveUrl: string;
  sourceUrl: string;
  techStack: string;
  isDraft: boolean;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  liveUrl: "",
  sourceUrl: "",
  techStack: "",
  isDraft: false,
};

export default function ProjectsPage() {
  const projects = useQuery(api.projects.list, { showDrafts: true });
  const [descTab, setDescTab] = useState<"write" | "preview">("write");
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const updateImage = useMutation(api.projects.updateImage);
  const removeProject = useMutation(api.projects.remove);
  const reorderProjects = useMutation(api.projects.reorder);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImageFor, setUploadingImageFor] = useState<Id<"projects"> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isValidImageType(file)) return;

    setPendingImage(file);
    setPendingImagePreview(URL.createObjectURL(file));
  };

  // Clear pending image
  const clearPendingImage = () => {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImage(null);
    setPendingImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image and return storage ID
  const uploadImage = async (file: File): Promise<Id<"_storage">> => {
    // Optimize image
    const optimized = await optimizeImage(file, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.85,
      format: "webp",
    });

    // Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Upload to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": optimized.blob.type },
      body: optimized.blob,
    });

    if (!result.ok) {
      throw new Error("Upload failed");
    }

    const { storageId } = await result.json();
    return storageId;
  };

  // Create new project
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageStorageId: Id<"_storage"> | undefined;

      if (pendingImage) {
        imageStorageId = await uploadImage(pendingImage);
      }

      await createProject({
        title: form.title,
        description: form.description,
        liveUrl: form.liveUrl,
        sourceUrl: form.sourceUrl || undefined,
        techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        imageStorageId,
        isDraft: form.isDraft,
      });

      setForm(emptyForm);
      clearPendingImage();
      setIsAdding(false);
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing
  const startEdit = (project: NonNullable<typeof projects>[number]) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      sourceUrl: project.sourceUrl || "",
      techStack: project.techStack.join(", "),
      isDraft: project.isDraft ?? false,
    });
  };

  // Save edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsSubmitting(true);

    try {
      await updateProject({
        id: editingId,
        title: form.title,
        description: form.description,
        liveUrl: form.liveUrl,
        sourceUrl: form.sourceUrl || undefined,
        techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        isDraft: form.isDraft,
      });

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    clearPendingImage();
  };

  // Delete project
  const handleDelete = async (id: Id<"projects">) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await removeProject({ id });
  };

  // Replace project image
  const handleReplaceImage = async (projectId: Id<"projects">, file: File) => {
    if (!isValidImageType(file)) return;

    setUploadingImageFor(projectId);
    try {
      const imageStorageId = await uploadImage(file);
      await updateImage({ id: projectId, imageStorageId });
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploadingImageFor(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = "";
      }
    }
  };

  // Move project up/down
  const moveProject = async (index: number, direction: "up" | "down") => {
    if (!projects) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, moved);

    await reorderProjects({ projectIds: newOrder.map((p) => p._id) });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
          <p className="mt-2 text-foreground-muted">
            Manage your portfolio projects.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Add Project
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form
          onSubmit={editingId ? handleSaveEdit : handleCreate}
          className="mt-6 rounded-lg border border-border bg-background-alt p-6"
        >
          <h3 className="mb-4 font-medium text-foreground">
            {editingId ? "Edit Project" : "New Project"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-foreground-muted">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-foreground-muted">Description * (Markdown supported)</label>
                <div style={{ display: "flex", gap: "2px", background: "var(--border)", borderRadius: "8px", padding: "2px" }}>
                  {(["write", "preview"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setDescTab(tab)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 500,
                        background: descTab === tab ? "var(--card)" : "transparent",
                        color: descTab === tab ? "var(--foreground)" : "var(--muted)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {tab === "write" ? "Write" : "Preview"}
                    </button>
                  ))}
                </div>
              </div>
              {descTab === "write" ? (
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm"
                />
              ) : (
                <div
                  style={{
                    minHeight: "80px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {form.description ? (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }: React.ComponentPropsWithoutRef<"a">) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>{children}</a>
                        ),
                        p: ({ children }: React.ComponentPropsWithoutRef<"p">) => <p style={{ marginBottom: "8px" }}>{children}</p>,
                      }}
                    >
                      {form.description}
                    </ReactMarkdown>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>Nothing to preview.</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Live URL *
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                required
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Source URL (optional)
              </label>
              <input
                type="url"
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-foreground-muted">
                Tech Stack (comma-separated) *
              </label>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                required
                placeholder="React, TypeScript, Tailwind CSS"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {isAdding && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-foreground-muted">
                  Project Image (optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {pendingImagePreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={pendingImagePreview}
                      alt="Preview"
                      className="h-20 w-32 rounded object-cover"
                    />
                    <div className="text-sm text-foreground-muted">
                      {pendingImage && formatFileSize(pendingImage.size)}
                    </div>
                    <button
                      type="button"
                      onClick={clearPendingImage}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-dashed border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    Choose Image
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isDraft}
                onChange={(e) => setForm({ ...form, isDraft: e.target.checked })}
                style={{ width: "15px", height: "15px", accentColor: "var(--accent)" }}
              />
              <span className="text-sm text-foreground-muted">Save as draft (hide from public)</span>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Project"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                cancelEdit();
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted hover:bg-background"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="mt-8">
        {projects === undefined ? (
          <p className="text-foreground-muted">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-foreground-muted">No projects yet. Add your first one!</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="flex gap-4 rounded-lg border border-border bg-background-alt p-4"
              >
                {/* Image */}
                <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded bg-background">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-foreground-muted">
                      No image
                    </div>
                  )}
                  {uploadingImageFor === project._id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-xs text-white">Uploading...</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{project.title}</h4>
                    {project.isDraft && (
                      <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontSize: "11px", fontWeight: 500 }}>
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-foreground-muted line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-background px-2 py-0.5 text-xs text-foreground-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Live
                    </a>
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveProject(index, "up")}
                      disabled={index === 0}
                      className="text-foreground-muted hover:text-foreground disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      onClick={() => moveProject(index, "down")}
                      disabled={index === projects.length - 1}
                      className="text-foreground-muted hover:text-foreground disabled:opacity-30"
                    >
                      &darr;
                    </button>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceImage(project._id, file);
                      }}
                      className="hidden"
                      id={`replace-image-${project._id}`}
                    />
                    <label
                      htmlFor={`replace-image-${project._id}`}
                      className="cursor-pointer text-foreground-muted hover:text-accent"
                    >
                      {project.imageUrl ? "Replace" : "Add"} Image
                    </label>
                    <button
                      onClick={() => startEdit(project)}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
