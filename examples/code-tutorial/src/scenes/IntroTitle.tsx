import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const IntroTitle = () => {
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
      <div
        style={{
          ...enterFromBottom({ frame, fps }, 40),
          color: "#38BDF8",
          fontSize: 44,
          letterSpacing: 8,
          fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
        }}
      >
        VIBE CODING
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 50),
          color: "#F8FAFC",
          fontSize: 140,
          fontWeight: 800,
          marginTop: 24,
        }}
      >
        1분 설명
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 16), fps }, 30),
          color: "#94A3B8",
          fontSize: 36,
          marginTop: 32,
        }}
      >
        코드를 안 짜고 영상을 만든다
      </div>
    </AbsoluteFill>
  );
};
