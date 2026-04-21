import { z } from "zod";

export const dailyReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().default("서울"),
  data: z
    .object({
      kospi: z.object({
        close: z.number(),
        changePercent: z.number(),
        history: z.array(z.object({ date: z.string(), close: z.number() })),
      }),
      exchange: z.object({
        usdKrw: z.number(),
        changePercent: z.number(),
      }),
      weather: z.object({
        condition: z.enum(["sunny", "cloudy", "rainy", "snowy"]),
        tempLow: z.number(),
        tempHigh: z.number(),
      }),
    })
    .nullable()
    .default(null),
});

export type DailyReportProps = z.infer<typeof dailyReportSchema>;

export const defaultProps: DailyReportProps = {
  date: new Date().toISOString().slice(0, 10),
  city: "서울",
  data: null,
};
