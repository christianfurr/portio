import { ImageResponse } from "next/og";
import { loadFrauncesDisplay } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/*
 * Home-screen icon. Full-bleed square — iOS applies its own corner mask, so
 * rounding it here would double up. Same paper/ink/vermillion tile as the
 * favicon, with room at this size for the marginalia rule to read.
 */
export default async function AppleIcon() {
  const fonts = await loadFrauncesDisplay();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f2efe9",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            color: "#0b0b0c",
            fontFamily: "Fraunces",
            fontWeight: 700,
            fontSize: 104,
            letterSpacing: -5,
          }}
        >
          CF
        </div>
        <div
          style={{ display: "flex", height: 18, backgroundColor: "#c42b0c" }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
