import { continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("Loading Pretendard font");

const font = new FontFace(
  "Pretendard",
  `url(${staticFile("fonts/PretendardVariable.woff2")}) format("woff2-variations")`,
  { weight: "45 920" }
);

font
  .load()
  .then((loaded) => {
    document.fonts.add(loaded);
    continueRender(handle);
  })
  .catch((err) => {
    console.error("Pretendard load failed:", err);
    continueRender(handle);
  });
