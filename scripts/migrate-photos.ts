/**
 * Migration script to upload existing photos to Convex storage
 *
 * Usage: bun run scripts/migrate-photos.ts
 *
 * This reads photos from public/images/photography/ and uploads them to Convex.
 * Supports .webp, .jpg, .jpeg, and .png files (excluding thumbnails).
 */

import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const PHOTOS_DIR = "public/images/photography";

const SUPPORTED_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"];
const CONTENT_TYPE_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  process.exit(1);
}

// Extract the deployment name from the URL
const deploymentMatch = CONVEX_URL.match(/https:\/\/([^.]+)\.convex\.cloud/);
if (!deploymentMatch) {
  console.error("Invalid CONVEX_URL format");
  process.exit(1);
}
const deploymentName = deploymentMatch[1];

/**
 * Generate alt text from filename
 * e.g., "sunset-beach-photo.webp" -> "Sunset beach photo"
 */
function generateAltText(filename: string): string {
  const ext = extname(filename);
  const baseName = filename.replace(ext, "");
  const words = baseName
    .split(/[-_]/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return words.join(" ") || "Photo";
}

async function getUploadUrl(): Promise<string> {
  const response = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "photos:generateUploadUrl",
      args: {},
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get upload URL: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.value;
}

async function createPhoto(storageId: string, alt: string): Promise<string> {
  const response = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "photos:create",
      args: { storageId, alt },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create photo: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.value;
}

async function uploadFile(filePath: string): Promise<string> {
  const ext = extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPE_MAP[ext] || "image/webp";

  const uploadUrl = await getUploadUrl();
  const fileData = await readFile(filePath);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: fileData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload file: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.storageId;
}

async function main() {
  console.log(`\n📸 Photo Migration Script`);
  console.log(`${"─".repeat(40)}`);
  console.log(`Source: ${PHOTOS_DIR}`);
  console.log(`Deployment: ${deploymentName}\n`);

  const cwd = process.cwd();
  const photosDir = join(cwd, PHOTOS_DIR);

  // Get all supported image files (excluding thumbnails)
  const files = await readdir(photosDir);
  const photoFiles = files.filter((f) => {
    const ext = extname(f).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext) && !f.includes("-thumb");
  });

  if (photoFiles.length === 0) {
    console.log("No photos found to migrate.");
    return;
  }

  console.log(`Found ${photoFiles.length} photos to migrate\n`);

  let successCount = 0;
  let failCount = 0;
  const errors: Array<{ file: string; error: string }> = [];

  for (const file of photoFiles) {
    const filePath = join(photosDir, file);
    const altText = generateAltText(file);

    process.stdout.write(`  Uploading ${file}...`);

    try {
      const storageId = await uploadFile(filePath);
      await createPhoto(storageId, altText);
      console.log(` ✓`);
      successCount++;
    } catch (err) {
      console.log(` ✗`);
      const errorMessage = err instanceof Error ? err.message : String(err);
      errors.push({ file, error: errorMessage });
      failCount++;
    }
  }

  // Print summary
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Migration complete!`);
  console.log(`  ✓ Success: ${successCount}`);
  if (failCount > 0) {
    console.log(`  ✗ Failed:  ${failCount}`);
    console.log(`\nErrors:`);
    for (const { file, error } of errors) {
      console.log(`  - ${file}: ${error}`);
    }
  }
  console.log();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
