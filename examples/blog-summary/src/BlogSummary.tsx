import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Title } from "./scenes/Title";
import { SentenceCard } from "./scenes/SentenceCard";
import { Cta } from "./scenes/Cta";
import type { BlogSummaryProps } from "./schema";

export const BlogSummary = ({ title, sentences, audioFile, audioDuration }: BlogSummaryProps) => {
  const fps = 30;
  const titleFrames = Math.round(2.5 * fps);
  const ctaFrames = Math.round(2 * fps);
  const remaining = Math.max(fps * 5, Math.round(audioDuration * fps) - titleFrames - ctaFrames);
  const perSentence = Math.max(fps, Math.floor(remaining / Math.max(1, sentences.length)));

  return (
    <AbsoluteFill style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}>
      {audioFile ? <Audio src={staticFile(audioFile)} /> : null}
      <Series>
        <Series.Sequence durationInFrames={titleFrames}>
          <Title text={title} />
        </Series.Sequence>
        {sentences.map((sentence, i) => (
          <Series.Sequence key={i} durationInFrames={perSentence}>
            <SentenceCard text={sentence} index={i} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={ctaFrames}>
          <Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
