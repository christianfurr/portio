import { readFile } from "fs/promises";
import { join } from "path";

export async function loadManufacturingConsent(): Promise<ArrayBuffer> {
  const fontPath = join(
    process.cwd(),
    "node_modules/@fontsource/manufacturing-consent/files/manufacturing-consent-latin-400-normal.woff",
  );
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}
