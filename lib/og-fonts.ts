import { readFile } from "fs/promises";
import { join } from "path";

/*
 * Font loading for next/og (Satori) images.
 *
 * Satori cannot use next/font — it needs raw font binaries handed to it, and it
 * reads ttf/otf/woff only, never woff2. Fontsource ships both formats, so every
 * path below must point at the .woff file or the image renders in a fallback.
 *
 * These routes are prerendered at build time, so reading from node_modules is
 * safe; nothing here runs per-request.
 */

/** Weights Satori accepts. Plain `number` is not assignable to its font option. */
type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

async function loadFont(relativePath: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), "node_modules", relativePath));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

/** Fraunces alone, for the favicon and app icon. */
export async function loadFrauncesDisplay(): Promise<OgFont[]> {
  const data = await loadFont(
    "@fontsource/fraunces/files/fraunces-latin-700-normal.woff",
  );
  return [{ name: "Fraunces", data, weight: 700, style: "normal" }];
}

/**
 * The three Broadsheet families: Fraunces for display, Inter for body copy,
 * JetBrains Mono for marginalia. Returned in the shape ImageResponse expects.
 */
export async function loadBroadsheetFonts(): Promise<OgFont[]> {
  const [frauncesBold, frauncesRegular, inter, mono] = await Promise.all([
    loadFont("@fontsource/fraunces/files/fraunces-latin-700-normal.woff"),
    loadFont("@fontsource/fraunces/files/fraunces-latin-400-normal.woff"),
    loadFont("@fontsource/inter/files/inter-latin-400-normal.woff"),
    loadFont("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
  ]);

  return [
    { name: "Fraunces", data: frauncesBold, weight: 700, style: "normal" },
    { name: "Fraunces", data: frauncesRegular, weight: 400, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
  ];
}
