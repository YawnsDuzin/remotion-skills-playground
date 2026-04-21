import { z } from "zod";

export const blogSummarySchema = z.object({
  title: z.string(),
  sentences: z.array(z.string()),
  audioFile: z.string().nullable().default(null),
  audioDuration: z.number().default(0),
});

export type BlogSummaryProps = z.infer<typeof blogSummarySchema>;

export const defaultProps: BlogSummaryProps = {
  title: "샘플 블로그 요약",
  sentences: ["요약 문장 1", "요약 문장 2", "요약 문장 3"],
  audioFile: null,
  audioDuration: 0,
};
