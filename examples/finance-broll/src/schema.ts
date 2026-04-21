import { z } from "zod";

export const financeBrollSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kospi: z.object({
    close: z.number(),
    changePercent: z.number(),
    history: z.array(z.object({ date: z.string(), close: z.number() })),
  }),
  exchange: z.object({
    usdKrw: z.number(),
    changePercent: z.number(),
  }),
  brollIds: z.array(z.string()).default(["skyline-day", "trading-floor", "skyline-night"]),
});

export type FinanceBrollProps = z.infer<typeof financeBrollSchema>;

export const defaultProps: FinanceBrollProps = {
  date: new Date().toISOString().slice(0, 10),
  kospi: {
    close: 2734.18,
    changePercent: 0.42,
    history: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
      close: 2700 + Math.sin(i / 4) * 30 + i * 2,
    })),
  },
  exchange: { usdKrw: 1374.5, changePercent: -0.18 },
  brollIds: ["skyline-day", "trading-floor", "skyline-night"],
};
