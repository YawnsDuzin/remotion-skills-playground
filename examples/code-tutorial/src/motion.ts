import { Easing, interpolate, spring } from "remotion";

type Frame = { frame: number; fps: number };

export const enterFromBottom = ({ frame, fps }: Frame, distance = 60) => {
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

export const fadeOut = (frame: number, totalFrames: number, duration = 30) => ({
  opacity: interpolate(frame, [totalFrames - duration, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.ease),
  }),
});

export const cursorBlink = (frame: number, fps: number): number => {
  // 2Hz blink — 0.25초 보이고 0.25초 숨김
  return Math.floor((frame / fps) * 2) % 2 === 0 ? 1 : 0;
};
