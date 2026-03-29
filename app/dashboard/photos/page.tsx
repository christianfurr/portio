"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  optimizeImage,
  isValidImageType,
  formatFileSize,
} from "@/lib/image-optimization";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/dashboard/Button";
import { Input } from "@/components/dashboard/Input";
import { Card, CardContent } from "@/components/dashboard/Card";
import { useToast } from "@/components/dashboard/ToastProvider";
import { SkeletonPhotoGrid } from "@/components/dashboard/Skeleton";

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "optimizing" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  alt: string;
  caption: string;
  optimizedSize?: number;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PhotosPage() {
  const photos = useQuery(api.photos.list);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const createPhoto = useMutation(api.photos.create);
  const updatePhoto = useMutation(api.photos.update);
  const removePhoto = useMutation(api.photos.remove);
  const reorderPhotos = useMutation(api.photos.reorder);
  const replaceFile = useMutation(api.photos.replaceFile);
  const toast = useToast();

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<Id<"photos"> | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", caption: "" });
  const [reoptimizing, setReoptimizing] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Batch naming state
  const [batchMode, setBatchMode] = useState(false);
  const [baseName, setBaseName] = useState("");
  const [startingNumber, setStartingNumber] = useState(0);
  const [digitPadding, setDigitPadding] = useState<"auto" | 2 | 3>(2);

  const computePadding = useCallback((fileCount: number, start: number): number => {
    if (digitPadding !== "auto") return digitPadding;
    const maxNumber = start + fileCount - 1;
    if (maxNumber >= 1000) return 4;
    if (maxNumber >= 100) return 3;
    return 2;
  }, [digitPadding]);

  const getBatchName = useCallback((index: number): string => {
    if (!baseName.trim()) return `photo ${String(startingNumber + index).padStart(2, "0")}`;
    const padding = computePadding(uploadingFiles.length, startingNumber);
    const num = String(startingNumber + index).padStart(padding, "0");
    return `${baseName.trim()} ${num}`;
  }, [baseName, startingNumber, computePadding, uploadingFiles.length]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(isValidImageType);
    const invalidCount = fileArray.length - validFiles.length;

    if (invalidCount > 0) {
      toast.warning(`${invalidCount} file(s) skipped`, "Only image files are supported");
    }

    const newFiles: UploadingFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      progress: 0,
      alt: file.name.replace(/\.[^/.]+$/, ""),
      caption: "",
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);
    
    if (validFiles.length > 0) {
      toast.info(`${validFiles.length} photo(s) added`, "Ready to upload");
    }
  }, [toast]);

  const uploadFile = useCallback(
    async (uploadingFile: UploadingFile) => {
      const updateFile = (updates: Partial<UploadingFile>) => {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadingFile.id ? { ...f, ...updates } : f))
        );
      };

      try {
        updateFile({ status: "optimizing", progress: 10 });
        const optimized = await optimizeImage(uploadingFile.file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.85,
          format: "webp",
        });

        updateFile({ optimizedSize: optimized.blob.size });

        updateFile({ status: "uploading", progress: 30 });
        const uploadUrl = await generateUploadUrl();

        updateFile({ progress: 50 });
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": optimized.blob.type },
          body: optimized.blob,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await result.json();

        updateFile({ progress: 80 });
        await createPhoto({
          storageId,
          alt: uploadingFile.alt || "Photo",
          caption: uploadingFile.caption || undefined,
        });

        updateFile({ status: "done", progress: 100 });
        URL.revokeObjectURL(uploadingFile.preview);

        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id));
        }, 1000);

        return true;
      } catch (err) {
        console.error("Upload error:", err);
        updateFile({
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        });
        return false;
      }
    },
    [generateUploadUrl, createPhoto]
  );

  const startUploads = useCallback(async () => {
    const pendingFiles = uploadingFiles.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    if (batchMode) {
      const pendingIds = pendingFiles.map((f) => f.id);
      setUploadingFiles((prev) =>
        prev.map((f) => {
          const batchIndex = pendingIds.indexOf(f.id);
          if (batchIndex !== -1) {
            return { ...f, alt: getBatchName(batchIndex) };
          }
          return f;
        })
      );

      for (let i = 0; i < pendingFiles.length; i++) {
        const success = await uploadFile({ ...pendingFiles[i], alt: getBatchName(i) });
        if (success) successCount++;
        else errorCount++;
      }
    } else {
      for (const file of pendingFiles) {
        const success = await uploadFile(file);
        if (success) successCount++;
        else errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0 && errorCount === 0) {
      toast.success(`${successCount} photo(s) uploaded`, "Added to your gallery");
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`${successCount} uploaded, ${errorCount} failed`, "Some photos could not be uploaded");
    } else if (errorCount > 0) {
      toast.error("Upload failed", "Please try again");
    }
  }, [uploadingFiles, uploadFile, batchMode, getBatchName, toast]);

  const updateFileMetadata = (id: string, field: "alt" | "caption", value: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const startEdit = (photo: NonNullable<typeof photos>[number]) => {
    setEditingId(photo._id);
    setEditForm({ alt: photo.alt, caption: photo.caption || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updatePhoto({
        id: editingId,
        alt: editForm.alt,
        caption: editForm.caption || undefined,
      });
      toast.success("Photo updated", "Changes saved successfully");
      setEditingId(null);
    } catch {
      toast.error("Update failed", "Could not save changes");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ alt: "", caption: "" });
  };

  const deletePhoto = async (id: Id<"photos">) => {
    try {
      await removePhoto({ id });
      toast.success("Photo deleted", "Removed from gallery");
    } catch {
      toast.error("Delete failed", "Could not remove photo");
    }
  };

  const movePhoto = async (index: number, direction: "up" | "down") => {
    if (!photos) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;

    const newOrder = [...photos];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, moved);

    try {
      await reorderPhotos({ photoIds: newOrder.map((p) => p._id) });
    } catch {
      toast.error("Reorder failed", "Could not change photo order");
    }
  };

  const reoptimizePhoto = async (photo: NonNullable<typeof photos>[number]) => {
    if (!photo.url) return;

    const photoId = photo._id;
    setReoptimizing((prev) => new Set(prev).add(photoId));

    try {
      const response = await fetch(photo.url);
      if (!response.ok) throw new Error("Failed to download image");

      const blob = await response.blob();
      const file = new File([blob], "photo.jpg", { type: blob.type });

      const optimized = await optimizeImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
        format: "webp",
      });

      const uploadUrl = await generateUploadUrl();
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": optimized.blob.type },
        body: optimized.blob,
      });

      if (!uploadResult.ok) throw new Error("Upload failed");

      const { storageId } = await uploadResult.json();
      await replaceFile({ id: photoId, newStorageId: storageId });

      const savings = Math.round((1 - optimized.blob.size / file.size) * 100);
      toast.success("Photo re-optimized", `Saved ${savings}% file size`);
    } catch (err) {
      console.error("Re-optimize error:", err);
      toast.error("Re-optimization failed", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setReoptimizing((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
    }
  };

  const reoptimizeAll = async () => {
    if (!photos || photos.length === 0) return;

    toast.info("Re-optimizing all photos", "This may take a while...");
    let successCount = 0;

    for (const photo of photos) {
      try {
        await reoptimizePhoto(photo);
        successCount++;
      } catch {
        // Error already handled in reoptimizePhoto
      }
    }

    toast.success("Batch optimization complete", `${successCount} of ${photos.length} photos processed`);
  };

  const pendingCount = uploadingFiles.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Photos"
        description="Upload and manage your photography gallery."
        action={
          photos && photos.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={reoptimizeAll}
              disabled={reoptimizing.size > 0}
            >
              {reoptimizing.size > 0 ? `Re-optimizing (${reoptimizing.size})...` : "Re-optimize All"}
            </Button>
          )
        }
      />

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: "48px 24px",
          borderRadius: "16px",
          border: `2px dashed ${isDragging ? "var(--accent)" : "var(--border)"}`,
          background: isDragging ? "rgba(10, 132, 255, 0.05)" : "var(--card)",
          textAlign: "center",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div
          style={{
            width: "56px",
            height: "56px",
            margin: "0 auto 16px",
            borderRadius: "14px",
            background: isDragging ? "var(--accent)" : "rgba(10, 132, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDragging ? "white" : "var(--accent)"}
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 8l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ color: "var(--foreground)", fontWeight: 500, marginBottom: "4px" }}>
          {isDragging ? "Drop images here" : "Drag and drop images here"}
        </p>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>
          or <span style={{ color: "var(--accent)" }}>browse</span> to select files
        </p>
        <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "8px", opacity: 0.7 }}>
          Images will be optimized to WebP (max 1600px, ~85% quality)
        </p>
      </div>

      {/* Upload Queue */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)" }}>
                Upload Queue ({uploadingFiles.length})
              </h3>
              {pendingCount > 0 && (
                <Button onClick={startUploads} loading={isUploading} size="sm">
                  Upload {pendingCount} {pendingCount === 1 ? "Photo" : "Photos"}
                </Button>
              )}
            </div>

            {/* Batch Naming Controls */}
            {pendingCount > 0 && (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  marginBottom: "16px",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={batchMode}
                    onChange={(e) => setBatchMode(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--foreground)" }}>
                    Batch naming
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Auto-number files sequentially
                  </span>
                </label>

                {batchMode && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "12px" }}>
                    <div style={{ flex: "1", minWidth: "150px" }}>
                      <Input
                        label="Base name"
                        value={baseName}
                        onChange={(e) => setBaseName(e.target.value)}
                        placeholder="e.g. ava march"
                      />
                    </div>
                    <div style={{ width: "100px" }}>
                      <Input
                        label="Start at"
                        type="number"
                        value={startingNumber}
                        onChange={(e) => setStartingNumber(Math.max(0, parseInt(e.target.value) || 0))}
                        min={0}
                      />
                    </div>
                    <div style={{ width: "100px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--muted)", marginBottom: "6px" }}>
                        Digits
                      </label>
                      <select
                        value={digitPadding}
                        onChange={(e) => setDigitPadding(e.target.value === "auto" ? "auto" : parseInt(e.target.value) as 2 | 3)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid var(--border)",
                          background: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "14px",
                        }}
                      >
                        <option value="auto">Auto</option>
                        <option value={2}>2 (00-99)</option>
                        <option value={3}>3 (000-999)</option>
                      </select>
                    </div>
                  </div>
                )}

                {batchMode && (
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
                    Preview: {getBatchName(0)}
                    {pendingCount > 1 && <>, {getBatchName(1)}</>}
                    {pendingCount > 2 && <>, ..., {getBatchName(pendingCount - 1)}</>}
                  </div>
                )}
              </div>
            )}

            {/* Upload Queue Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uploadingFiles.map((file) => {
                const pendingFiles = uploadingFiles.filter(f => f.status === "pending");
                const pendingIndex = pendingFiles.findIndex(f => f.id === file.id);
                const displayName = batchMode && pendingIndex !== -1 ? getBatchName(pendingIndex) : file.alt;

                return (
                  <div
                    key={file.id}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "16/9" }}>
                      <img
                        src={file.preview}
                        alt={displayName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {file.status !== "pending" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {file.status === "done" ? (
                            <div style={{ color: "#22c55e", display: "flex", alignItems: "center", gap: "8px" }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.5 5.5L7.5 14.5L3.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Done
                            </div>
                          ) : file.status === "error" ? (
                            <div style={{ color: "#ef4444", textAlign: "center", padding: "0 16px" }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ margin: "0 auto 8px" }}>
                                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                              {file.error}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center" }}>
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  margin: "0 auto 8px",
                                  border: "2px solid rgba(255,255,255,0.3)",
                                  borderTopColor: "white",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                }}
                              />
                              <span style={{ color: "white" }}>
                                {file.status === "optimizing" ? "Optimizing..." : "Uploading..."}
                              </span>
                              <div style={{ marginTop: "4px", color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                                {file.progress}%
                              </div>
                            </div>
                          )}
                          {file.optimizedSize && file.status !== "error" && (
                            <div style={{ marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                              {formatFileSize(file.file.size)} → {formatFileSize(file.optimizedSize)}
                              {file.optimizedSize < file.file.size && (
                                <span style={{ color: "#22c55e", marginLeft: "4px" }}>
                                  (-{Math.round((1 - file.optimizedSize / file.file.size) * 100)}%)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {file.status === "pending" && (
                      <div style={{ padding: "12px" }}>
                        {batchMode ? (
                          <div
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid rgba(10, 132, 255, 0.3)",
                              background: "rgba(10, 132, 255, 0.05)",
                              fontSize: "14px",
                              color: "var(--foreground)",
                              marginBottom: "8px",
                            }}
                          >
                            {displayName}
                          </div>
                        ) : (
                          <Input
                            value={file.alt}
                            onChange={(e) => updateFileMetadata(file.id, "alt", e.target.value)}
                            placeholder="Alt text"
                            style={{ marginBottom: "8px" }}
                          />
                        )}
                        <Input
                          value={file.caption}
                          onChange={(e) => updateFileMetadata(file.id, "caption", e.target.value)}
                          placeholder="Caption (optional)"
                        />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "var(--muted)" }}>
                          <span>{formatFileSize(file.file.size)}</span>
                          <button
                            onClick={() => removeUploadingFile(file.id)}
                            style={{ color: "var(--error)", background: "none", border: "none", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Photos */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "16px" }}>
          Gallery ({photos?.length ?? 0} photos)
        </h3>

        {photos === undefined ? (
          <SkeletonPhotoGrid count={8} />
        ) : photos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 16px",
                borderRadius: "14px",
                background: "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 500, marginBottom: "4px" }}>No photos yet</p>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Upload some photos above to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                index={index}
                totalPhotos={photos.length}
                isEditing={editingId === photo._id}
                editForm={editForm}
                setEditForm={setEditForm}
                onStartEdit={() => startEdit(photo)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={() => deletePhoto(photo._id)}
                onMove={(dir) => movePhoto(index, dir)}
                onReoptimize={() => reoptimizePhoto(photo)}
                isReoptimizing={reoptimizing.has(photo._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PhotoCardProps {
  photo: NonNullable<ReturnType<typeof useQuery<typeof api.photos.list>>>[number];
  index: number;
  totalPhotos: number;
  isEditing: boolean;
  editForm: { alt: string; caption: string };
  setEditForm: (form: { alt: string; caption: string }) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onReoptimize: () => void;
  isReoptimizing: boolean;
}

function PhotoCard({
  photo,
  index,
  totalPhotos,
  isEditing,
  editForm,
  setEditForm,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onMove,
  onReoptimize,
  isReoptimizing,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-fade-in"
      style={{
        borderRadius: "14px",
        border: `1px solid ${isHovered ? "var(--accent)" : "var(--border)"}`,
        background: "var(--card)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? "0 8px 24px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16/9" }}>
        {photo.url ? (
          <img
            src={photo.url}
            alt={photo.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
            <span style={{ color: "var(--muted)" }}>No image</span>
          </div>
        )}
        {isReoptimizing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}
      </div>
      <div style={{ padding: "14px" }}>
        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Input
              value={editForm.alt}
              onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
              placeholder="Alt text"
            />
            <Input
              value={editForm.caption}
              onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
              placeholder="Caption"
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button size="sm" onClick={onSaveEdit}>Save</Button>
              <Button size="sm" variant="secondary" onClick={onCancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : showDeleteConfirm ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--foreground)", marginBottom: "12px" }}>
              Delete this photo?
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <Button size="sm" variant="destructive" onClick={() => { onDelete(); setShowDeleteConfirm(false); }}>
                Delete
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {photo.alt}
            </p>
            {photo.caption && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {photo.caption}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", fontSize: "11px", color: "var(--muted)", opacity: 0.7 }}>
              {photo.fileSize && <span>{formatFileSize(photo.fileSize)}</span>}
              {photo.contentType && <span>{photo.contentType.split("/")[1]?.toUpperCase()}</span>}
              <span>{formatDate(photo._creationTime)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", fontSize: "12px" }}>
              <button onClick={onStartEdit} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                Edit
              </button>
              <button
                onClick={onReoptimize}
                disabled={isReoptimizing}
                style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", opacity: isReoptimizing ? 0.5 : 1 }}
              >
                Re-optimize
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} style={{ color: "var(--error)", background: "none", border: "none", cursor: "pointer" }}>
                Delete
              </button>
              <span style={{ flex: 1 }} />
              <button
                onClick={() => onMove("up")}
                disabled={index === 0}
                style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", opacity: index === 0 ? 0.3 : 1, padding: "2px 4px" }}
              >
                ↑
              </button>
              <button
                onClick={() => onMove("down")}
                disabled={index === totalPhotos - 1}
                style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", opacity: index === totalPhotos - 1 ? 0.3 : 1, padding: "2px 4px" }}
              >
                ↓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
