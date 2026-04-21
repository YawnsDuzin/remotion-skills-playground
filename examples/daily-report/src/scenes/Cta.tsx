import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut } from "../motion";

export const Cta = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const fade = fadeOut(frame, 60, 30);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#38BDF8",
        justifyContent: "center",
        alignItems: "center",
        ...fade,
      }}
    >
      <div style={{ color: "#0F172A", fontSize: 88, fontWeight: 800 }}>{text}</div>
    </AbsoluteFill>
  );
};
