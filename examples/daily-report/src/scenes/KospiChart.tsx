import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { drawIn, enterFromBottom } from "../motion";
import type { DailyReportProps } from "../schema";

type Props = NonNullable<DailyReportProps["data"]>["kospi"];

export const KospiChart = ({ close, changePercent, history }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = drawIn(frame, 60);

  const w = 900;
  const h = 400;
  const min = Math.min(...history.map((p) => p.close));
  const max = Math.max(...history.map((p) => p.close));
  const points = history.map((p, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((p.close - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const visiblePoints = points.slice(0, Math.max(2, Math.floor(points.length * progress)));
  const polylinePoints = visiblePoints.map(([x, y]) => `${x},${y}`).join(" ");

  const color = changePercent >= 0 ? "#EF4444" : "#3B82F6";
  const sign = changePercent >= 0 ? "+" : "";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", padding: 80, justifyContent: "center" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#94A3B8", fontSize: 40 }}>KOSPI 종가</div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 30), color: "#F8FAFC", fontSize: 110, fontWeight: 800, marginTop: 8 }}>
        {close.toLocaleString("ko-KR")}
      </div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 30), color, fontSize: 56, fontWeight: 700, marginTop: 4 }}>
        {sign}{changePercent.toFixed(2)}%
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 40, width: "100%", height: 360 }}>
        <polyline fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" points={polylinePoints} />
      </svg>
    </AbsoluteFill>
  );
};
