import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut } from "../motion";

export const Cta = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const fade = fadeOut(frame, 60, 30);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
        ...fade,
      }}
    >
      <div style={{ color: "#F8FAFC", fontSize: 88, fontWeight: 800 }}>{text}</div>
      <div style={{ color: "#94A3B8", fontSize: 36, marginTop: 16, letterSpacing: 2 }}>
        FINANCE DAILY · 내일도 같은 시간에
      </div>
    </AbsoluteFill>
  );
};
