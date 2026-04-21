import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom, fadeOut } from "./motion";
import type { TitleCardProps } from "./schema";

export const TitleCard = ({ title, subtitle, accentColor }: TitleCardProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleStyle = enterFromBottom({ frame, fps }, 60);
  const subtitleStyle = enterFromBottom({ frame: Math.max(0, frame - 10), fps }, 40);
  const fadeStyle = fadeOut(frame, durationInFrames, 30);

  const titleFontSize = title.length > 30 ? 80 : 120;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
        ...fadeStyle,
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: titleFontSize,
          fontWeight: 800,
          color: "#F8FAFC",
          textAlign: "center",
          padding: "0 80px",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            ...subtitleStyle,
            fontSize: 48,
            color: accentColor,
            marginTop: 32,
            fontWeight: 500,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
