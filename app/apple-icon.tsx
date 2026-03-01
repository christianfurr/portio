import { ImageResponse } from "next/og";
import { loadManufacturingConsent } from "@/lib/favicon-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await loadManufacturingConsent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          color: "#ffffff",
          fontFamily: "Manufacturing Consent",
          fontSize: 120,
          fontWeight: 400,
        }}
      >
        CF
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Manufacturing Consent",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
