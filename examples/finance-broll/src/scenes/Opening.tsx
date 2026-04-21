import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const Opening = ({ date }: { date: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#94A3B8", fontSize: 36, letterSpacing: 4 }}>
        FINANCE DAILY
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 6), fps }, 50),
          color: "#F8FAFC",
          fontSize: 96,
          fontWeight: 800,
          marginTop: 24,
        }}
      >
        {date}
      </div>
    </AbsoluteFill>
  );
};
