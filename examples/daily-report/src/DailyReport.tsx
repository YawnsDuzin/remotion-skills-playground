import { AbsoluteFill, Series } from "remotion";
import { Opening } from "./scenes/Opening";
import { KospiChart } from "./scenes/KospiChart";
import { ExchangeCard } from "./scenes/ExchangeCard";
import { WeatherStrip } from "./scenes/WeatherStrip";
import { Cta } from "./scenes/Cta";
import type { DailyReportProps } from "./schema";

const sec = (s: number) => Math.round(s * 30);

export const DailyReport = ({ date, city, data }: DailyReportProps) => {
  if (!data) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", color: "#fff", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: 48 }}>데이터를 불러오지 못했다 — calculateMetadata 확인</div>
      </AbsoluteFill>
    );
  }
  return (
    <Series>
      <Series.Sequence durationInFrames={sec(8)}>
        <Opening date={date} city={city} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={sec(15)}>
        <KospiChart {...data.kospi} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={sec(12)}>
        <ExchangeCard {...data.exchange} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={sec(15)}>
        <WeatherStrip {...data.weather} city={city} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={sec(10)}>
        <Cta text="내일도 같은 시간에" />
      </Series.Sequence>
    </Series>
  );
};
