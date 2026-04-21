import type { DailyReportProps } from "../schema";

export const mockData: NonNullable<DailyReportProps["data"]> = {
  kospi: {
    close: 2734.18,
    changePercent: 0.42,
    history: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
      close: 2700 + Math.sin(i / 4) * 30 + i * 2,
    })),
  },
  exchange: {
    usdKrw: 1374.5,
    changePercent: -0.18,
  },
  weather: {
    condition: "cloudy",
    tempLow: 11,
    tempHigh: 19,
  },
};
