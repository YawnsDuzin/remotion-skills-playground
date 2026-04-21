import { AbsoluteFill, Sequence } from "remotion";
import { Weather } from "./Weather";
import { Menu } from "./Menu";
import { Cta } from "./Cta";
import type { WeatherMenuProps } from "./schema";

const sec = (s: number) => Math.round(s * 30);

export const WeatherMenu = (props: WeatherMenuProps) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAF6F0", fontFamily: "Pretendard" }}>
      <Sequence from={sec(0)} durationInFrames={sec(2)}>
        <Opening city={props.city} />
      </Sequence>
      <Sequence from={sec(2)} durationInFrames={sec(3)}>
        <Weather condition={props.condition} temperature={props.temperature} />
      </Sequence>
      <Sequence from={sec(5)} durationInFrames={sec(4)}>
        <Menu menus={props.menus} />
      </Sequence>
      <Sequence from={sec(9)} durationInFrames={sec(1)}>
        <Cta text={props.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Opening = ({ city }: { city: string }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ fontSize: 96, fontWeight: 700, color: "#2A2A2A" }}>
      {city}의 오늘
    </div>
  </AbsoluteFill>
);
