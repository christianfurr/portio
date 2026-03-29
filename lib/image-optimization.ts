/**
 * Client-side image optimization utilities
 * Resizes and compresses images before upload
 */

export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
}

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpeg";
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.85,
  format: "webp",
};

/**
 * Check if the browser supports WebP encoding
 */
let webpSupported: boolean | null = null;
async function supportsWebP(): Promise<boolean> {
  if (webpSupported !== null) return webpSupported;
  
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  
  const dataUrl = canvas.toDataURL("image/webp");
  webpSupported = dataUrl.startsWith("data:image/webp");
  return webpSupported;
}

/**
 * Load an image from a File object
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate the new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  // Scale down if larger than max dimensions
  if (width > maxWidth || height > maxHeight) {
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  return { width, height };
}

/**
 * Optimize an image file by resizing and compressing
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Load the image
  const img = await loadImage(file);
  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;

  // Calculate new dimensions
  const { width, height } = calculateDimensions(
    originalWidth,
    originalHeight,
    opts.maxWidth,
    opts.maxHeight
  );

  // Create canvas and draw resized image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  // Clean up the object URL
  URL.revokeObjectURL(img.src);

  // Determine the best format - fallback to JPEG if WebP not supported
  let mimeType = opts.format === "webp" ? "image/webp" : "image/jpeg";
  if (opts.format === "webp" && !(await supportsWebP())) {
    console.log("WebP encoding not supported, falling back to JPEG");
    mimeType = "image/jpeg";
  }

  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          // Verify the blob type matches what we requested
          // Some browsers silently fall back to PNG if format not supported
          if (b.type !== mimeType) {
            console.warn(`Expected ${mimeType} but got ${b.type}`);
          }
          resolve(b);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      mimeType,
      opts.quality
    );
  });

  console.log(`Optimized: ${width}x${height}, ${(blob.size / 1024).toFixed(1)}KB, ${blob.type}`);

  return { blob, width, height };
}

/**
 * Get image dimensions from a file without fully loading it
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  const { naturalWidth: width, naturalHeight: height } = img;
  URL.revokeObjectURL(img.src);
  return { width, height };
}

/**
 * Check if a file is a valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
  ];
  return validTypes.includes(file.type);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
