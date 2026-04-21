import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";

export const Cta = ({ url }: { url?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#38BDF8", justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 40), color: "#0F172A", fontSize: 72, fontWeight: 800 }}>전체 글 보기</div>
      {url ? (
        <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 6), fps }, 30), color: "#0F172A", fontSize: 32, marginTop: 16, opacity: 0.7 }}>
          {url}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
