import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom, fadeOut } from "../motion";

export const Cta = ({ ctaText, repoUrl }: { ctaText: string; repoUrl: string }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = fadeOut(frame, durationInFrames, 30);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
        fontFamily: "Pretendard, system-ui, sans-serif",
        ...fade,
      }}
    >
      <div
        style={{
          ...enterFromBottom({ frame, fps }, 40),
          color: "#38BDF8",
          fontSize: 40,
          letterSpacing: 6,
          fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
        }}
      >
        VIBE CODING
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 6), fps }, 60),
          color: "#F8FAFC",
          fontSize: 120,
          fontWeight: 800,
          marginTop: 24,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {ctaText}
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 14), fps }, 30),
          color: "#94A3B8",
          fontSize: 32,
          marginTop: 48,
          fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
          padding: "16px 32px",
          border: "2px solid #334155",
          borderRadius: 12,
        }}
      >
        {repoUrl}
      </div>
    </AbsoluteFill>
  );
};
