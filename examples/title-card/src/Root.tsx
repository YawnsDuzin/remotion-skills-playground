import { Composition } from "remotion";
import { TitleCard } from "./TitleCard";
import { titleCardSchema, defaultProps } from "./schema";

export const Root = () => {
  return (
    <>
      <Composition
        id="TitleCardLandscape"
        component={TitleCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={titleCardSchema}
        defaultProps={defaultProps}
      />
      <Composition
        id="TitleCardPortrait"
        component={TitleCard}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        schema={titleCardSchema}
        defaultProps={defaultProps}
      />
    </>
  );
};
