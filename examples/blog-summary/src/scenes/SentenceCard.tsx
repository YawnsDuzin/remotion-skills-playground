import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const SentenceCard = ({ text, index }: { text: string; index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: index % 2 === 0 ? "#1E293B" : "#0F172A", justifyContent: "center", padding: 80 }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#38BDF8", fontSize: 36, fontWeight: 600, marginBottom: 24 }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 40), color: "#F8FAFC", fontSize: 64, fontWeight: 500, lineHeight: 1.5 }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
