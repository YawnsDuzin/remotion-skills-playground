import { z } from "zod";

export const codeTutorialSchema = z.object({
  userPrompt: z.string().default("10초짜리 타이틀 카드 만들어줘. 제목은 '안녕'"),
  ctaText: z.string().default("직접 해보기"),
  repoUrl: z.string().default("github.com/YawnsDuzin/remotion-skills-playground"),
});

export type CodeTutorialProps = z.infer<typeof codeTutorialSchema>;

export const defaultProps: CodeTutorialProps = {
  userPrompt: "10초짜리 타이틀 카드 만들어줘. 제목은 '안녕'",
  ctaText: "직접 해보기",
  repoUrl: "github.com/YawnsDuzin/remotion-skills-playground",
};
