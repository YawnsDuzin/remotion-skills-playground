import { z } from "zod";

export const weatherMenuSchema = z.object({
  city: z.string().default("서울"),
  condition: z.enum(["sunny", "cloudy", "rainy", "snowy"]).default("rainy"),
  temperature: z.number().default(12),
  menus: z
    .array(
      z.object({
        name: z.string(),
        priceKrw: z.number(),
        emoji: z.string(),
      })
    )
    .length(3),
  cta: z.string().default("따뜻한 카페 드립에서"),
});

export type WeatherMenuProps = z.infer<typeof weatherMenuSchema>;

export const defaultProps: WeatherMenuProps = {
  city: "서울",
  condition: "rainy",
  temperature: 9,
  menus: [
    { name: "아메리카노", priceKrw: 4500, emoji: "☕" },
    { name: "카페라떼", priceKrw: 5000, emoji: "🥛" },
    { name: "유자차", priceKrw: 5500, emoji: "🍵" },
  ],
  cta: "따뜻한 카페 드립에서",
};
