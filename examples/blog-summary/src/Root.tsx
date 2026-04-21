import path from "node:path";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { BlogSummary } from "./BlogSummary";
import { blogSummarySchema, defaultProps, type BlogSummaryProps } from "./schema";
import { parseMarkdown, buildScript } from "./fetch/parser";
import { synthesize } from "./fetch/tts";

const calc: CalculateMetadataFunction<BlogSummaryProps> = async ({ props }) => {
  const fps = 30;
  const samplePath = path.join(process.cwd(), "sample-post.md");
  const { title, sentences } = await parseMarkdown(samplePath);
  const script = buildScript(title, sentences);

  let audioFile: string | null = null;
  let audioDuration = sentences.length * 4 + 5;
  try {
    const { file, full } = await synthesize(script);
    audioFile = file;
    audioDuration = await getAudioDurationInSeconds(full);
  } catch (e) {
    console.warn("TTS failed, using estimated duration:", e);
  }

  const titleFrames = Math.round(2.5 * fps);
  const ctaFrames = Math.round(2 * fps);
  const totalFrames = Math.max(fps * 10, Math.round(audioDuration * fps) + titleFrames + ctaFrames);

  return {
    props: { ...props, title, sentences, audioFile, audioDuration },
    durationInFrames: totalFrames,
  };
};

export const Root = () => (
  <Composition
    id="BlogSummary"
    component={BlogSummary}
    durationInFrames={fps()}
    fps={30}
    width={1080}
    height={1920}
    schema={blogSummarySchema}
    defaultProps={defaultProps}
    calculateMetadata={calc}
  />
);

function fps() {
  return 30 * 60;
}
