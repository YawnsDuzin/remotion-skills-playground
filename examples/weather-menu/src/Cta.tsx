import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Cta = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#C9592E",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700, color: "#FAF6F0" }}>{text}</div>
    </AbsoluteFill>
  );
};
