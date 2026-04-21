import { Composition } from "remotion";
import { WeatherMenu } from "./WeatherMenu";
import { weatherMenuSchema, defaultProps } from "./schema";
import "./fonts";

export const Root = () => {
  return (
    <Composition
      id="WeatherMenu"
      component={WeatherMenu}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      schema={weatherMenuSchema}
      defaultProps={defaultProps}
    />
  );
};
