/**
 * Generates a tiny 20×20 base64 JPEG data URL for use as a blur placeholder.
 * Called client-side before upload; the result is stored in Convex alongside
 * the full-resolution image.
 */
export function generateBlurDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2d context"));
      ctx.drawImage(img, 0, 0, 20, 20);
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for blur placeholder"));
    };

    img.src = objectUrl;
  });
}
