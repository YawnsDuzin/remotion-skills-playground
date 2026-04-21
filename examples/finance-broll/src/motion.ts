import { Easing, interpolate, spring } from "remotion";

type Frame = { frame: number; fps: number };

export const enterFromBottom = ({ frame, fps }: Frame, distance = 60) => {
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

export const drawIn = (frame: number, totalFrames: number) =>
  interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

export const fadeOut = (frame: number, totalFrames: number, duration = 30) => ({
  opacity: interpolate(frame, [totalFrames - duration, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
});
