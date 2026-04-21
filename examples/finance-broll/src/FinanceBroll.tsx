import { AbsoluteFill, Series } from "remotion";
import { Opening } from "./scenes/Opening";
import { KospiCard } from "./scenes/KospiCard";
import { ExchangeCard } from "./scenes/ExchangeCard";
import { Cta } from "./scenes/Cta";
import { BrollClip } from "./scenes/BrollClip";
import type { FinanceBrollProps } from "./schema";

const sec = (s: number) => Math.round(s * 30);

/**
 * 구조 (총 30초):
 *   0~3s   Opening
 *   3~6s   B-roll[0]              (skyline-day)
 *   6~12s  KOSPI on B-roll[0]     (data overlay on dimmed broll bg)
 *   12~15s B-roll[1]              (trading-floor)
 *   15~21s Exchange on B-roll[1]
 *   21~24s B-roll[2]              (skyline-night)
 *   24~30s Cta on B-roll[2]
 */
export const FinanceBroll = ({ date, kospi, exchange, brollIds }: FinanceBrollProps) => {
  const [b0 = "skyline-day", b1 = "trading-floor", b2 = "skyline-night"] = brollIds;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence durationInFrames={sec(3)}>
          <Opening date={date} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(3)}>
          <BrollClip clipId={b0} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(6)}>
          <BrollClip clipId={b0}>
            <KospiCard {...kospi} />
          </BrollClip>
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(3)}>
          <BrollClip clipId={b1} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(6)}>
          <BrollClip clipId={b1}>
            <ExchangeCard {...exchange} />
          </BrollClip>
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(3)}>
          <BrollClip clipId={b2} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(6)}>
          <BrollClip clipId={b2}>
            <Cta text="오늘의 시장 마감" />
          </BrollClip>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
