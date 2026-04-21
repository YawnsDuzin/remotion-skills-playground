import { Composition } from "remotion";
import { CodeTutorial } from "./CodeTutorial";
import { codeTutorialSchema, defaultProps } from "./schema";
import "./fonts";

const FPS = 30;
const DURATION_FRAMES = FPS * 60; // 60초

export const Root = () => (
  <Composition
    id="CodeTutorial"
    component={CodeTutorial}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
    schema={codeTutorialSchema}
    defaultProps={defaultProps}
  />
);
