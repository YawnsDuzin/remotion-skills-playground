import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";
import type { DailyReportProps } from "../schema";

type Props = NonNullable<DailyReportProps["data"]>["weather"] & { city: string };

const ICON = { sunny: "☀️", cloudy: "☁️", rainy: "🌧️", snowy: "❄️" } as const;
const LABEL = { sunny: "맑음", cloudy: "흐림", rainy: "비", snowy: "눈" } as const;

export const WeatherStrip = ({ condition, tempLow, tempHigh, city }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", padding: 80, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 40), fontSize: 240 }}>{ICON[condition]}</div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 6), fps }, 30), color: "#F8FAFC", fontSize: 88, fontWeight: 700, marginTop: 24 }}>
        {city} {LABEL[condition]}
      </div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 10), fps }, 30), color: "#94A3B8", fontSize: 56, marginTop: 8 }}>
        {tempLow}° / {tempHigh}°
      </div>
    </AbsoluteFill>
  );
};
