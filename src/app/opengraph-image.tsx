import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph image: typographic, on-brand, no external assets. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#F4F2EC",
          padding: 72,
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
          {siteConfig.name}
          <div style={{ width: 12, height: 12, background: "#D4F796" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, fontSize: 92, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>
          <div>Build digital systems</div>
          <div>that turn attention</div>
          <div style={{ display: "flex" }}>
            <span style={{ background: "#D4F796", color: "#0A0A0A", padding: "0 14px" }}>into business.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#9A9A92" }}>
          <span>Websites · Lead systems · Automation · AI · Growth</span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
