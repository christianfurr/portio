import { ImageResponse } from "next/og";

export const alt = "Christian Furr — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f5f7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 600, marginBottom: 16 }}>
          Christian Furr
        </div>
        <div style={{ fontSize: 32, color: "#a1a1a6" }}>
          Full Stack Developer
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#0a84ff",
            marginTop: 24,
            maxWidth: 560,
            textAlign: "center",
          }}
        >
          I build real-time systems and beautifully crafted web experiences.
        </div>
      </div>
    ),
    { ...size }
  );
}
