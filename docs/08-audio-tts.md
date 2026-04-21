# 오디오 + 한국어 TTS

> 읽는 데 약 14분 · 기준일 2026-04-15

영상에 음성과 BGM을 입히는 것 자체는 `<Audio>` 한 줄로 끝난다.
실제 어려움은 "한국어 음성을 어디서 받아오고, 자막 타이밍을 어떻게 음성에 맞추고, 비용은 얼마나 나오는가"에 있다.
이 문서는 음성합성(TTS)부터 자막 동기화까지 전 과정을 다룬다.

## Audio 컴포넌트 — 30초 만에 BGM 깔기

`public/audio/bgm.mp3`를 두고 `<Audio src={staticFile("audio/bgm.mp3")} />` 한 줄로 끝.

```tsx
import { Audio, staticFile } from "remotion";

export const Scene = () => (
  <>
    <Audio src={staticFile("audio/bgm.mp3")} volume={0.3} />
    {/* 비디오 레이어 */}
  </>
);
```

`volume`은 0~1, `playbackRate`는 0.5~4 정도가 안전. `loop` prop을 주면 영상 길이만큼 반복.

**함정**: `<Audio>`도 `Sequence` 안에 넣으면 시작 시점이 잘린다 — 의도한 거면 OK, 의도 아니면 컴포지션 최상단에 두기.

## 시간 기반 볼륨 — 페이드인/아웃

`volume` prop에 함수를 넣으면 프레임마다 다른 값을 줄 수 있다.

```tsx
<Audio
  src={staticFile("audio/bgm.mp3")}
  volume={(frame) =>
    interpolate(frame, [0, 30, 270, 300], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  }
/>
```

페이드인 1초 → 본 볼륨 8초 → 페이드아웃 1초. 전체 영상이 300프레임(10초) 가정.

## 한국어 TTS 옵션 비교

| 서비스 | 자연스러움 | 한 자당 단가 (2026-04 공개가) | 특징 |
|---|---|---|---|
| Naver CLOVA Voice | ★★★★★ | 약 4원 | 한국어 억양 최상. 50명 보이스 |
| Typecast | ★★★★ | 구독 (월 19,000원~) | 캐릭터 보이스, 감정 표현 |
| ElevenLabs | ★★★ | $0.30/1k chars | 다국어, 한국어는 살짝 어색 |
| Google Cloud TTS | ★★★ | 약 4원 (WaveNet) | 안정적, 무난 |
| 오픈소스 (Coqui XTTS 등) | ★★ | 무료 (자체 호스팅) | GPU 필요, 품질 들쭉날쭉 |

**대량 운용 시 추천 순위**: 1) CLOVA Voice (품질이 다른 모든 비용을 상쇄), 2) Typecast (구독제라 예측 가능), 3) 자체 호스팅 XTTS (월 100만 자 이상이면 검토 가치).

## CLOVA Voice 호출 예 (calculateMetadata에서)

`calculateMetadata`에서 음성을 받아 `public/audio/`에 저장하고, 그 경로를 props로 전달한다.

```ts
// src/calc.ts
import fs from "node:fs/promises";
import path from "node:path";

export const calc: CalculateMetadataFunction<Props> = async ({ props }) => {
  const audioPath = path.join("public/audio", `${props.id}.mp3`);
  if (!await fileExists(audioPath)) {
    const buf = await synthesizeClova(props.script);
    await fs.writeFile(audioPath, buf);
  }
  return {
    props: { ...props, audioFile: `audio/${props.id}.mp3` },
    durationInFrames: Math.ceil(estimateSeconds(props.script) * 30),
  };
};
```

`synthesizeClova` 함수는 `https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts`에 POST. 본 저장소 [`skills/tts-korean.md`](../skills/tts-korean.md)에 전체 구현이 있다.

**중요**: 네이버 클로바는 호출당 과금이라 매 렌더마다 부르면 비용이 폭발한다. 위 코드처럼 "이미 파일 있으면 스킵" 캐싱 필수. `script`의 SHA-256을 파일명에 넣으면 본문이 바뀔 때만 새로 부른다.

## 자막 — 음성 길이에 맞춰 타이밍 잡기

음성 파일 길이를 알아야 자막을 맞출 수 있다. `@remotion/media-utils`의 `getAudioDurationInSeconds` 사용.

```ts
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

const duration = await getAudioDurationInSeconds(staticFile("audio/script.mp3"));
const totalFrames = Math.round(duration * 30);
```

`calculateMetadata`에서 호출하면 컴포지션 길이를 자동으로 맞춘다.

## 단어별 자막 동기화 — useAudioData

문장 자막은 위 방식으로 충분하지만, "단어 단위로 하이라이트되는 노래방 자막"이 필요하면 `useAudioData` + 워드 타임스탬프가 필요하다.

```tsx
import { useAudioData, visualizeAudio } from "@remotion/media-utils";

const audioData = useAudioData(staticFile("audio/script.mp3"));
if (!audioData) return null;

const visualization = visualizeAudio({
  fps: 30,
  frame: useCurrentFrame(),
  audioData,
  numberOfSamples: 16,
});
// visualization은 길이 16의 number 배열 — 이걸로 막대 그래프 등 구현
```

진짜 단어 단위 동기화를 하려면 STT(Whisper, CLOVA Speech) 결과의 word-level timestamps를 받아 `Sequence`로 단어마다 자르는 게 정석. 자세한 구현은 v0.3 예제로 추가 예정.

## 음성 + 영상 합치기 — 렌더 명령

특별히 할 게 없다. `<Audio>`가 컴포지션에 포함되어 있으면 `npx remotion render` 한 번에 H.264 + AAC로 합쳐진다.

음성만 빼고 무성 영상을 뽑고 싶다면:

```bash
npx remotion render src/index.ts MyComp out/silent.mp4 --enforce-audio-track=false --codec=h264
```

또는 음성만 분리:

```bash
npx remotion render src/index.ts MyComp out/audio.mp3 --codec=mp3
```

## 자주 막히는 지점

1. **음성이 안 들림** — Studio에서 미리보기 시 오디오는 재생되지만 렌더 결과만 무음이면 `--codec=h264`(기본)가 아니라 `--codec=h264-mkv` 같은 audio 미지원 코덱을 썼을 가능성. `--enforce-audio-track=true` 추가.
2. **자막이 음성보다 빠르거나 늦음** — `calculateMetadata`에서 받은 `duration`이 fps와 곱해질 때 반올림 차이. `Math.round` 대신 `Math.ceil` 시도.
3. **CLOVA에서 "한자 변환" 발음 이상** — 한자 표기를 한글로 직접 풀어서 입력. 예: "Remotion" → "리모션", "API" → "에이피아이".
4. **MP3 잘림** — `<Audio>`가 들어있는 `Sequence`의 `durationInFrames`이 음성보다 짧으면 그만큼만 재생. `Sequence` 길이를 음성 frame 수에 맞추거나, 컴포지션 최상단에 두기.

다음 — 다 만들었으면 렌더하자: [`docs/09-rendering.md`](./09-rendering.md).
