import { ImageResponse } from "next/og";

export const alt = "Kennedy | Data Analytics Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f3efe9",
          color: "#17171a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ color: "#67635f", fontSize: 28, letterSpacing: "0.24em" }}>
          KENNEDY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: "-0.05em" }}>
            Data into decisions.
          </div>
          <div style={{ color: "#4d4b49", fontSize: 30 }}>
            Data analytics, dashboards, and practical business insight.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
