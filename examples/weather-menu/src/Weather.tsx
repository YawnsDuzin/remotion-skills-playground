import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { WeatherMenuProps } from "./schema";

const ICON: Record<WeatherMenuProps["condition"], string> = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
};

const LABEL: Record<WeatherMenuProps["condition"], string> = {
  sunny: "맑음",
  cloudy: "흐림",
  rainy: "비",
  snowy: "눈",
};

type Props = Pick<WeatherMenuProps, "condition" | "temperature">;

export const Weather = ({ condition, temperature }: Props) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 20], [0.6, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ fontSize: 320, transform: `scale(${scale})` }}>{ICON[condition]}</div>
      <div style={{ fontSize: 80, fontWeight: 600, marginTop: 40, color: "#2A2A2A" }}>
        {LABEL[condition]} · {temperature}°C
      </div>
    </AbsoluteFill>
  );
};
