import { Composition, type CalculateMetadataFunction } from "remotion";
import { FinanceBroll } from "./FinanceBroll";
import { financeBrollSchema, defaultProps, type FinanceBrollProps } from "./schema";
import { BROLL_CLIPS } from "./data/broll";
import { brollFileExists, isMockMode } from "./data/env";
import "./fonts";

const FPS = 30;
const DURATION_FRAMES = FPS * 30; // 30초

const calc: CalculateMetadataFunction<FinanceBrollProps> = async ({ props }) => {
  // mock 모드면 props 그대로
  if (isMockMode()) {
    return { props, durationInFrames: DURATION_FRAMES };
  }

  // 실제 모드 — 누락된 B-roll 파일이 있으면 콘솔 경고 (렌더는 진행)
  for (const id of props.brollIds) {
    const clip = BROLL_CLIPS.find((c) => c.id === id);
    if (!clip) {
      console.warn(`[broll] '${id}' not in BROLL_CLIPS manifest — placeholder will be shown`);
      continue;
    }
    const exists = await brollFileExists(clip.file);
    if (!exists) {
      console.warn(
        `[broll] public/broll/${clip.file} not found — placeholder will be shown. ` +
          `Source hint: ${clip.source}`
      );
    }
  }

  return { props, durationInFrames: DURATION_FRAMES };
};

export const Root = () => (
  <Composition
    id="FinanceBroll"
    component={FinanceBroll}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
    schema={financeBrollSchema}
    defaultProps={defaultProps}
    calculateMetadata={calc}
  />
);
