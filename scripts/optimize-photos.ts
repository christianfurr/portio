/**
 * Optimize photos for web: resize, compress, convert to WebP.
 * Put originals in photography-src/, run: bun run optimize-photos
 * Output goes to public/images/photography/
 */

import { readdir, mkdir, stat } from "node:fs/promises";
import { join, relative, dirname } from "node:path";

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".tif"]);

function parseArgs(): {
  input: string;
  output: string;
  maxWidth: number;
  quality: number;
  thumbSize: number | null;
  skipUnchanged: boolean;
} {
  const args = process.argv.slice(2);
  let input = "photography-src";
  let output = "public/images/photography";
  let maxWidth = 1600;
  let quality = 82;
  let thumbSize: number | null = 400;
  let skipUnchanged = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      input = args[++i];
    } else if (args[i] === "--output" && args[i + 1]) {
      output = args[++i];
    } else if (args[i] === "--max-width" && args[i + 1]) {
      maxWidth = parseInt(args[++i], 10);
    } else if (args[i] === "--quality" && args[i + 1]) {
      quality = parseInt(args[++i], 10);
    } else if (args[i] === "--thumb" && args[i + 1]) {
      thumbSize = parseInt(args[++i], 10);
    } else if (args[i] === "--no-skip") {
      skipUnchanged = false;
    } else if (args[i] === "--no-thumb") {
      thumbSize = null;
    }
  }

  return { input, output, maxWidth, quality, thumbSize, skipUnchanged };
}

async function findImageFiles(
  dir: string,
  baseDir: string,
  files: string[] = []
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      await findImageFiles(full, baseDir, files);
    } else if (ent.isFile()) {
      const ext = ent.name.slice(ent.name.lastIndexOf(".")).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

async function ensureDir(path: string): Promise<void> {
  try {
    await mkdir(path, { recursive: true });
  } catch {
    // already exists
  }
}

async function main(): Promise<void> {
  const { input, output, maxWidth, quality, thumbSize, skipUnchanged } = parseArgs();

  const sharp = await import("sharp");
  const cwd = process.cwd();
  const inputDir = join(cwd, input);
  const outputDir = join(cwd, output);

  let inputStats: { isDirectory: () => boolean } | null = null;
  try {
    inputStats = await stat(inputDir);
  } catch {
    // ignore
  }
  if (!inputStats?.isDirectory()) {
    console.error(`Input directory does not exist: ${inputDir}`);
    console.error("Create photography-src/ and add images, then run: bun run optimize-photos");
    process.exit(1);
  }

  const files = await findImageFiles(inputDir, inputDir);
  if (files.length === 0) {
    console.log(`No image files found in ${inputDir}`);
    process.exit(0);
  }

  await ensureDir(outputDir);

  for (const filePath of files) {
    const relPath = relative(inputDir, filePath);
    const baseName = relPath.replace(/\.[^.]+$/i, "");
    const subDir = dirname(relPath);
    const outSubDir = subDir !== "." ? join(outputDir, subDir) : outputDir;
    await ensureDir(outSubDir);

    const srcMtime = (await stat(filePath)).mtimeMs;

    const processOne = async (
      outPath: string,
      size: number | null
    ): Promise<boolean> => {
      if (skipUnchanged) {
        try {
          const destStat = await stat(outPath);
          if (destStat.mtimeMs >= srcMtime) {
            return false;
          }
        } catch {
          // file doesn't exist, process
        }
      }

      let pipeline = sharp.default(filePath);
      const meta = await pipeline.metadata();
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;
      const max = size ?? maxWidth;
      if (w > max || h > max) {
        pipeline = pipeline.resize(max, max, { fit: "inside", withoutEnlargement: true });
      }
      await pipeline.webp({ quality }).toFile(outPath);
      return true;
    };

    const fullOut = join(outSubDir, `${baseName}.webp`);
    const didFull = await processOne(fullOut, null);
    if (didFull) {
      console.log(relPath, "->", relative(cwd, fullOut));
    }

    if (thumbSize) {
      const thumbOut = join(outSubDir, `${baseName}-thumb.webp`);
      const didThumb = await processOne(thumbOut, thumbSize);
      if (didThumb) {
        console.log(relPath, "->", relative(cwd, thumbOut), "(thumb)");
      }
    }
  }

  console.log(`Done. ${files.length} source(s) -> ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
