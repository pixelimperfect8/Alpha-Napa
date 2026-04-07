import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Alpha School Napa Valley";
export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#1c1b19",
          color: "#FDFBF7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            letterSpacing: "0.2em",
            opacity: 0.5,
            marginBottom: 60,
          }}
        >
          <span>ALPHA SCHOOL</span>
          <span>NAPA VALLEY</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              color: "#FDFBF7",
            }}
          >
            Built for the World
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              color: "#8A7B66",
            }}
          >
            They're Growing Into.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            marginTop: 40,
            opacity: 0.6,
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          A group of Napa Valley families exploring bringing Alpha School to our community.
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 80,
            right: 80,
            width: 60,
            height: 60,
            backgroundColor: "#8A7B66",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            color: "#FDFBF7",
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size }
  );
}
