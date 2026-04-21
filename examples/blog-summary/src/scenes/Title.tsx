import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const Title = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 50), color: "#94A3B8", fontSize: 36, marginBottom: 16 }}>요약</div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 6), fps }, 60), color: "#F8FAFC", fontSize: 96, fontWeight: 800, textAlign: "center", lineHeight: 1.2 }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
