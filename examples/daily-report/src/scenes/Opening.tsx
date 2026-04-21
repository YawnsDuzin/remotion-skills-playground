import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const Opening = ({ date, city }: { date: string; city: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 40), color: "#94A3B8", fontSize: 48 }}>
        {date}
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 60),
          color: "#F8FAFC",
          fontSize: 120,
          fontWeight: 800,
          marginTop: 16,
        }}
      >
        {city} 데일리 리포트
      </div>
    </AbsoluteFill>
  );
};
