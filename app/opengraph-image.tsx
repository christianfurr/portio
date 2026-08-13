import { ImageResponse } from "next/og";
import { loadBroadsheetFonts } from "@/lib/og-fonts";

export const alt = "Christian Furr — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Broadsheet palette, mirrored from the .editorial tokens in app/globals.css. */
const PAPER = "#f2efe9";
const INK = "#0b0b0c";
const INK_MUTED = "#56534d";
const RULE = "#cec7b8";
const VERMILLION = "#c42b0c";

/*
 * The share card is the masthead reduced to its frame: heavy rule, mono
 * marginalia, hairline, display type, and the same rules closing it out. Every
 * container declares display:flex because Satori has no block layout — a div
 * with more than one child silently misrenders without it.
 */
export default async function OpenGraphImage() {
  const fonts = await loadBroadsheetFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          backgroundColor: PAPER,
          color: INK,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", height: 3, backgroundColor: INK }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            letterSpacing: 3,
            color: INK_MUTED,
          }}
        >
          <div style={{ display: "flex" }}>PORTFOLIO — ISSUE NO. 01</div>
          <div style={{ display: "flex" }}>SALT LAKE CITY</div>
        </div>

        <div style={{ display: "flex", height: 1, backgroundColor: RULE }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontWeight: 700,
              fontSize: 108,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Christian Furr
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Fraunces",
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1,
              letterSpacing: -1,
              color: VERMILLION,
            }}
          >
            Full Stack Developer
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              maxWidth: 720,
              fontSize: 27,
              lineHeight: 1.45,
              color: INK_MUTED,
            }}
          >
            I build real-time systems and beautifully crafted web experiences.
          </div>
        </div>

        <div style={{ display: "flex", height: 1, backgroundColor: RULE }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            letterSpacing: 3,
            color: INK_MUTED,
          }}
        >
          <div style={{ display: "flex" }}>CHRISTIANFURR.DEV</div>
          <div style={{ display: "flex", color: VERMILLION }}>
            AVAILABLE FOR WORK
          </div>
        </div>

        <div style={{ display: "flex", height: 3, backgroundColor: INK }} />
      </div>
    ),
    { ...size, fonts },
  );
}
