import { ImageResponse } from "next/og";
import { loadFrauncesDisplay } from "@/lib/og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/*
 * The site in miniature: a paper tile, ink monogram, vermillion rule.
 *
 * The field is painted rather than left transparent — the previous icon was
 * white on transparent, which disappeared entirely against a light tab bar.
 * Paper also keeps the tile visible against dark browser chrome, where a
 * near-black icon would blend in.
 */
export default async function Icon() {
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
            fontSize: 23,
            letterSpacing: -1,
          }}
        >
          CF
        </div>
        <div style={{ display: "flex", height: 3, backgroundColor: "#c42b0c" }} />
      </div>
    ),
    { ...size, fonts },
  );
}
