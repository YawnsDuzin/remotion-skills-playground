import { Composition, type CalculateMetadataFunction } from "remotion";
import { DailyReport } from "./DailyReport";
import { dailyReportSchema, defaultProps, type DailyReportProps } from "./schema";
import { fetchKospi } from "./fetch/kospi";
import { fetchUsdKrw } from "./fetch/exchange";
import { fetchWeather } from "./fetch/weather";
import { mockData } from "./fetch/mock";
import "./fonts";

const calc: CalculateMetadataFunction<DailyReportProps> = async ({ props }) => {
  if (process.env.USE_MOCK === "true") {
    return { props: { ...props, data: mockData }, durationInFrames: 30 * 60 };
  }
  try {
    const [kospi, exchange, weather] = await Promise.all([
      fetchKospi(props.date),
      fetchUsdKrw(props.date),
      fetchWeather(props.city, props.date),
    ]);
    return {
      props: {
        ...props,
        data: {
          kospi: { close: kospi.close, changePercent: 0, history: mockData.kospi.history },
          exchange: { usdKrw: exchange.usdKrw, changePercent: 0 },
          weather,
        },
      },
      durationInFrames: 30 * 60,
    };
  } catch (e) {
    console.warn("Falling back to mock data:", e);
    return { props: { ...props, data: mockData }, durationInFrames: 30 * 60 };
  }
};

export const Root = () => (
  <Composition
    id="DailyReport"
    component={DailyReport}
    durationInFrames={30 * 60}
    fps={30}
    width={1080}
    height={1920}
    schema={dailyReportSchema}
    defaultProps={defaultProps}
    calculateMetadata={calc}
  />
);
