import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { WeatherMenuProps } from "./schema";

type Props = Pick<WeatherMenuProps, "menus">;

export const Menu = ({ menus }: Props) => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 32 }}>
      {menus.map((menu, i) => (
        <Sequence key={menu.name} from={i * 9}>
          <MenuCard name={menu.name} priceKrw={menu.priceKrw} emoji={menu.emoji} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const MenuCard = ({
  name,
  priceKrw,
  emoji,
}: WeatherMenuProps["menus"][number]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const y = (1 - progress) * 80;

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity: progress,
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "32px 48px",
        display: "flex",
        alignItems: "center",
        gap: 32,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        minWidth: 720,
      }}
    >
      <div style={{ fontSize: 96 }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#2A2A2A" }}>{name}</div>
        <div style={{ fontSize: 40, color: "#C9592E", fontWeight: 600 }}>
          {priceKrw.toLocaleString("ko-KR")}원
        </div>
      </div>
    </div>
  );
};
