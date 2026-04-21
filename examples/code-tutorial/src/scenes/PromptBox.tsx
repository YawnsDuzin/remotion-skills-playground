import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cursorBlink, enterFromBottom } from "../motion";

type Props = {
  prompt: string;
  /** 타이핑이 끝날 때까지 걸리는 프레임 수 */
  typeDurationFrames: number;
  /** 라벨 (예: "당신") */
  label: string;
};

export const PromptBox = ({ prompt, typeDurationFrames, label }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsToShow = Math.max(
    0,
    Math.min(prompt.length, Math.floor(interpolate(frame, [0, typeDurationFrames], [0, prompt.length])))
  );
  const visible = prompt.slice(0, charsToShow);
  const typing = charsToShow < prompt.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        justifyContent: "center",
        padding: "0 80px",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...enterFromBottom({ frame, fps }, 30),
          color: "#94A3B8",
          fontSize: 36,
          marginBottom: 24,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 30),
          backgroundColor: "#1E293B",
          borderRadius: 20,
          padding: "40px 48px",
          color: "#F8FAFC",
          fontSize: 54,
          lineHeight: 1.45,
          fontWeight: 500,
          minHeight: 160,
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        }}
      >
        {visible}
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: 54,
            verticalAlign: "text-bottom",
            backgroundColor: "#38BDF8",
            marginLeft: 6,
            opacity: typing ? 1 : cursorBlink(frame, fps),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
