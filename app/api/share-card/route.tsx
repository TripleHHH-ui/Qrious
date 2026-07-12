import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get("place") ?? "a hidden gem";
  const emoji = searchParams.get("emoji") ?? "🌶️";
  const points = searchParams.get("points") ?? "100";
  const streak = searchParams.get("streak") ?? "1";

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "92px 84px", color: "#2b2320", background: "linear-gradient(145deg,#f7b32b 0%,#fff2c2 44%,#e1623f 100%)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
        <span>QUESTLUNCH</span><span>DAY {streak} 🔥</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "flex", fontSize: 230, marginBottom: 40 }}>{emoji}</div>
        <div style={{ display: "flex", fontSize: 42, textTransform: "uppercase", letterSpacing: 6, marginBottom: 22 }}>QUEST COMPLETE</div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1, fontWeight: 900, maxWidth: 900 }}>{place}</div>
        <div style={{ display: "flex", marginTop: 54, padding: "22px 40px", borderRadius: 999, background: "#2b2320", color: "#fff7ee", fontSize: 42, fontWeight: 800 }}>{`+${points} POINTS`}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 31 }}>
        <span>Where should lunch take you?</span><span style={{ fontSize: 64 }}>🧭</span>
      </div>
    </div>,
    { width: 1080, height: 1920 },
  );
}
