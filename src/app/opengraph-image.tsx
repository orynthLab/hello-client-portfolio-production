import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#030407",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#52f2ff",
          }}
        >
          OrynthBuild
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.15,
            color: "#f4f6fb",
            maxWidth: 980,
          }}
        >
          AI, ML, Web &amp; App Development, Tech Partner
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 26,
            color: "rgba(244, 246, 251, 0.62)",
            maxWidth: 900,
          }}
        >
          For founders and businesses worldwide — direct, or white-label for agencies.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
