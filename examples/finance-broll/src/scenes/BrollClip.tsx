import { AbsoluteFill, OffthreadVideo, getRemotionEnvironment, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getBrollClip, getBrollFilePath } from "../data/broll";

type Props = {
  clipId: string;
  /** 자식이 있으면 dim된 B-roll 위에 오버레이 */
  children?: React.ReactNode;
  /** B-roll 파일이 실제로 존재할 때만 OffthreadVideo 시도 */
  forceMock?: boolean;
};

export const BrollClip = ({ clipId, children, forceMock }: Props) => {
  const clip = getBrollClip(clipId);
  if (!clip) return <PlaceholderBackground tag={clipId} dim={0.5}>{children}</PlaceholderBackground>;

  const useMock = forceMock || (typeof process !== "undefined" && process.env.USE_MOCK_BROLL === "true");

  if (useMock) {
    return <PlaceholderBackground tag={clip.id} dim={clip.recommendedDim}>{children}</PlaceholderBackground>;
  }

  // OffthreadVideo는 파일 없으면 throw — Studio에서만 잡히니 try-catch는 외부에서
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(getBrollFilePath(clip))}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clip.recommendedDim})` }} />
      {children ? <AbsoluteFill>{children}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

const PlaceholderBackground = ({ tag, dim, children }: { tag: string; dim: number; children?: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame % (fps * 6)) / (fps * 6);
  const angle = 135 + t * 30;
  const c1 = `hsl(${210 + t * 20}, 40%, 18%)`;
  const c2 = `hsl(${260 + t * 20}, 35%, 12%)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: 32,
          opacity: 0.4,
        }}
      >
        <div
          style={{
            color: "#94A3B8",
            fontSize: 24,
            fontFamily: "Pretendard, monospace",
            letterSpacing: 2,
          }}
        >
          BROLL · {tag}
        </div>
      </AbsoluteFill>
      {children ? <AbsoluteFill>{children}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
