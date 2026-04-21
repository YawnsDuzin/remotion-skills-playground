import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { drawIn, enterFromBottom } from "../motion";
import type { FinanceBrollProps } from "../schema";

type Props = FinanceBrollProps["kospi"];

export const KospiCard = ({ close, changePercent, history }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = drawIn(frame, 60);

  const w = 900;
  const h = 280;
  const min = Math.min(...history.map((p) => p.close));
  const max = Math.max(...history.map((p) => p.close));
  const points = history.map((p, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((p.close - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const visible = points.slice(0, Math.max(2, Math.floor(points.length * progress)));
  const polylinePoints = visible.map(([x, y]) => `${x},${y}`).join(" ");

  const color = changePercent >= 0 ? "#EF4444" : "#3B82F6";
  const sign = changePercent >= 0 ? "+" : "";

  return (
    <AbsoluteFill style={{ padding: 80, justifyContent: "center", fontFamily: "Pretendard, system-ui, sans-serif" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#94A3B8", fontSize: 36, letterSpacing: 2 }}>
        KOSPI 종가
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 30),
          color: "#F8FAFC",
          fontSize: 130,
          fontWeight: 800,
          marginTop: 8,
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        {close.toLocaleString("ko-KR")}
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 30),
          color,
          fontSize: 64,
          fontWeight: 700,
          marginTop: 4,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {sign}
        {changePercent.toFixed(2)}%
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 40, width: "100%", height: 240 }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polylinePoints}
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
        />
      </svg>
    </AbsoluteFill>
  );
};
