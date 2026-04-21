import { AbsoluteFill, Series } from "remotion";
import { IntroTitle } from "./scenes/IntroTitle";
import { PromptBox } from "./scenes/PromptBox";
import { CodeBlock } from "./scenes/CodeBlock";
import { ResultPreview } from "./scenes/ResultPreview";
import { Cta } from "./scenes/Cta";
import type { CodeTutorialProps } from "./schema";

const sec = (s: number) => Math.round(s * 30);

/**
 * 60초 구성:
 *   0~4s    IntroTitle
 *   4~10s   PromptBox — 사용자 프롬프트 타이핑
 *   10~45s  CodeBlock — 코드 라인별 타이핑 (핵심 35초)
 *   45~53s  ResultPreview — 렌더 결과 미리보기
 *   53~60s  Cta
 */
export const CodeTutorial = ({ userPrompt, ctaText, repoUrl }: CodeTutorialProps) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      <Series>
        <Series.Sequence durationInFrames={sec(4)}>
          <IntroTitle />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(6)}>
          <PromptBox prompt={userPrompt} typeDurationFrames={sec(4)} label="당신" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(35)}>
          <CodeBlock />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(8)}>
          <ResultPreview />
        </Series.Sequence>

        <Series.Sequence durationInFrames={sec(7)}>
          <Cta ctaText={ctaText} repoUrl={repoUrl} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
