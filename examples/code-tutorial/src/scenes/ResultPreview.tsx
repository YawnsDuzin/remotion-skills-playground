import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

/**
 * Claude Code의 렌더 결과 미리보기 — Remotion 안에서 Remotion 영상 비슷한 걸 시뮬레이션
 * (실제 <OffthreadVideo>가 아니라, 결과물 모양을 직접 그린다)
 */
export const ResultPreview = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 씬 시작 후 "안녕" 텍스트가 페이드인
  const innerProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const innerBounce = interpolate(frame, [15, 35, 55], [0.6, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        padding: "0 60px",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...enterFromBottom({ frame, fps }, 30),
          color: "#94A3B8",
          fontSize: 36,
          marginBottom: 32,
          letterSpacing: 2,
        }}
      >
        미리보기 ▶
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 40),
          width: 720,
          height: 960,
          backgroundColor: "#0F172A",
          borderRadius: 24,
          border: "2px solid #334155",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 800,
            color: "#FFFFFF",
            opacity: innerProgress,
            transform: `scale(${innerBounce})`,
            textShadow: "0 8px 24px rgba(59,130,246,0.4)",
          }}
        >
          안녕
        </div>
        <PlayProgress frame={frame} durationInFrames={durationInFrames} />
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 10), fps }, 30),
          color: "#38BDF8",
          fontSize: 30,
          marginTop: 24,
          fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
        }}
      >
        out/title.mp4 · 10s · 1080×1920
      </div>
    </AbsoluteFill>
  );
};

const PlayProgress = ({
  frame,
  durationInFrames,
}: {
  frame: number;
  durationInFrames: number;
}) => {
  const width = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "#1E293B",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          backgroundColor: "#38BDF8",
        }}
      />
    </div>
  );
};
