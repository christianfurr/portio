"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isValidImageType } from "@/lib/image-optimization";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface HeroForm {
  name: string;
  title: string;
  tagline: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

const emptyForm: HeroForm = {
  name: "",
  title: "",
  tagline: "",
  ctaPrimaryText: "",
  ctaPrimaryLink: "",
  ctaSecondaryText: "",
  ctaSecondaryLink: "",
};

// Helper to create cropped image blob
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  // Set canvas size to the crop size (high quality - no downscaling)
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped portion
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as high-quality PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      1.0
    );
  });
}

export default function HeroPage() {
  const hero = useQuery(api.hero.get);
  const upsertHero = useMutation(api.hero.upsert);
  const generateUploadUrl = useMutation(api.hero.generateUploadUrl);
  const updatePortrait = useMutation(api.hero.updatePortrait);
  const removePortrait = useMutation(api.hero.removePortrait);

  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Portrait upload state
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Load existing data when available
  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name,
        title: hero.title,
        tagline: hero.tagline,
        ctaPrimaryText: hero.ctaPrimaryText,
        ctaPrimaryLink: hero.ctaPrimaryLink,
        ctaSecondaryText: hero.ctaSecondaryText,
        ctaSecondaryLink: hero.ctaSecondaryLink,
      });
    }
  }, [hero]);

  // Track changes
  const handleChange = (field: keyof HeroForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSavedMessage(false);
  };

  // Handle file selection - open crop modal
  const handleFileSelect = useCallback((file: File) => {
    if (!isValidImageType(file)) {
      alert("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle crop complete
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Upload the cropped image
  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setCropModalOpen(false);
    setIsUploadingPortrait(true);
    setUploadProgress("Processing crop...");

    try {
      // Get cropped image blob (high quality PNG)
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);

      setUploadProgress("Uploading...");

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": croppedBlob.type },
        body: croppedBlob,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      setUploadProgress("Saving...");

      // Update the hero with new portrait
      await updatePortrait({ storageId });

      setUploadProgress(null);
      setImageToCrop(null);
    } catch (err) {
      console.error("Portrait upload error:", err);
      alert("Failed to upload portrait. Please try again.");
      setUploadProgress(null);
    } finally {
      setIsUploadingPortrait(false);
    }
  };

  // Cancel crop
  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Remove portrait handler
  const handleRemovePortrait = async () => {
    try {
      await removePortrait();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Remove portrait error:", err);
      alert("Failed to remove portrait. Please try again.");
    }
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await upsertHero(form);
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

  if (hero === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Hero Section</h2>
        <p className="mt-4 text-foreground-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Crop Modal */}
      {cropModalOpen && imageToCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative flex h-[90vh] w-[90vw] max-w-3xl flex-col rounded-xl bg-background p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Crop Portrait
            </h3>
            <p className="mb-4 text-sm text-foreground-muted">
              Drag to reposition and use the slider to zoom. The crop is circular.
            </p>

            {/* Cropper container */}
            <div className="relative flex-1 overflow-hidden rounded-lg bg-black">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom slider */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-foreground-muted">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCropCancel}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background-alt"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Hero Section</h2>
          <p className="mt-2 text-foreground-muted">
            Edit the main hero section of your portfolio.
          </p>
        </div>
        {savedMessage && (
          <span className="text-sm text-green-500">Changes saved!</span>
        )}
      </div>

      {/* Portrait Upload Section */}
      <div className="mt-8 max-w-2xl">
        <h3 className="mb-4 font-medium text-foreground">Portrait Image</h3>
        <p className="mb-4 text-sm text-foreground-muted">
          Upload a portrait photo. You&apos;ll be able to crop it to a circle.
        </p>

        <div className="flex items-start gap-6">
          {/* Current Portrait Preview */}
          {hero?.portraitUrl && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* Gradient border preview */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent via-pink-500 to-accent opacity-75" />
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-background">
                  <img
                    src={hero.portraitUrl}
                    alt="Current portrait"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleRemovePortrait}
                    className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded border border-border px-2 py-1 text-xs text-foreground-muted hover:bg-background-alt"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            } ${isUploadingPortrait ? "pointer-events-none opacity-50" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {isUploadingPortrait ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="text-sm text-foreground-muted">
                  {uploadProgress}
                </span>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 8l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {hero?.portraitUrl ? "Replace portrait" : "Upload portrait"}
                </p>
                <p className="mt-1 text-xs text-foreground-muted">
                  Drag & drop or click to browse
                </p>
                <p className="mt-1 text-xs text-foreground-muted opacity-70">
                  High quality PNG, crop to circle
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Your name as displayed in the hero section
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Full Stack Developer"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Your professional title or role
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Tagline
          </label>
          <textarea
            value={form.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            rows={2}
            placeholder="Building beautiful, functional web experiences..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            A brief description or tagline
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="mb-4 font-medium text-foreground">Primary CTA Button</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Button Text
              </label>
              <input
                type="text"
                value={form.ctaPrimaryText}
                onChange={(e) => handleChange("ctaPrimaryText", e.target.value)}
                placeholder="View My Work"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Button Link
              </label>
              <input
                type="text"
                value={form.ctaPrimaryLink}
                onChange={(e) => handleChange("ctaPrimaryLink", e.target.value)}
                placeholder="#projects"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="mb-4 font-medium text-foreground">Secondary CTA Button</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Button Text
              </label>
              <input
                type="text"
                value={form.ctaSecondaryText}
                onChange={(e) => handleChange("ctaSecondaryText", e.target.value)}
                placeholder="Contact Me"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Button Link
              </label>
              <input
                type="text"
                value={form.ctaSecondaryLink}
                onChange={(e) => handleChange("ctaSecondaryLink", e.target.value)}
                placeholder="#contact"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
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
