import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the plan-and-elevation monogram on architectural black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0D0D" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <rect x="6" y="6" width="52" height="52" fill="none" stroke="#F4F1EB" strokeWidth="2" />
          <path d="M17 48V27l15-11 15 11v21" fill="none" stroke="#F4F1EB" strokeWidth="2" />
          <path d="M27 48V35h10v13" fill="none" stroke="#F4F1EB" strokeWidth="2" />
          <path d="M10 48h44" stroke="#A8875A" strokeWidth="2" />
        </svg>
      </div>
    ),
    size,
  );
}
