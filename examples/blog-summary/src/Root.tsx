import path from "node:path";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { BlogSummary } from "./BlogSummary";
import { blogSummarySchema, defaultProps, type BlogSummaryProps } from "./schema";
import { parseMarkdown, buildScript } from "./fetch/parser";
import { synthesize } from "./fetch/tts";
import "./fonts";

const FPS = 30;
const INITIAL_DURATION_FRAMES = FPS * 60;

const calc: CalculateMetadataFunction<BlogSummaryProps> = async ({ props }) => {
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

  const titleFrames = Math.round(2.5 * FPS);
  const ctaFrames = Math.round(2 * FPS);
  const totalFrames = Math.max(FPS * 10, Math.round(audioDuration * FPS) + titleFrames + ctaFrames);

  return {
    props: { ...props, title, sentences, audioFile, audioDuration },
    durationInFrames: totalFrames,
  };
};

export const Root = () => (
  <Composition
    id="BlogSummary"
    component={BlogSummary}
    durationInFrames={INITIAL_DURATION_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
    schema={blogSummarySchema}
    defaultProps={defaultProps}
    calculateMetadata={calc}
  />
);
