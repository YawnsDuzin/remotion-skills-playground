import { z } from "zod";

export const titleCardSchema = z.object({
  title: z.string().min(1).max(60),
  subtitle: z.string().max(120).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#38BDF8"),
});

export type TitleCardProps = z.infer<typeof titleCardSchema>;

export const defaultProps: TitleCardProps = {
  title: "안녕, 리모션",
  subtitle: "Remotion + Claude Code 한국어 가이드",
  accentColor: "#38BDF8",
};
