# 자막 — 문장·단어 단위 동기화

> 읽는 데 약 13분 · 기준일 2026-04-15

유튜브 쇼츠에서 단어마다 색이 바뀌는 "노래방 자막", TED 스타일 문장 자막, 두 줄 이상 자동 줄바꿈 — 자막은 영상 가독성의 절반 이상이다.
이 문서는 SRT 로딩부터 Whisper STT 워드 타임스탬프, 한국어 특유의 줄바꿈 규칙까지 다룬다.

## 자막 해상도 선택

| 방식 | 정밀도 | 구현 비용 | 적합 |
|---|---|---|---|
| 장면(scene)당 1개 | 낮음 | 낮음 | 교육 영상 |
| 문장 단위 | 중간 | 낮음 | 대부분 경우 |
| 워드 단위 | 높음 | 높음 | SNS 쇼츠 |
| 글자 단위 | 매우 높음 | 매우 높음 | 타이포그래피 영상 |

워드 단위가 가장 매력적이지만 타임스탬프 데이터를 어디서 얻느냐가 관건이다.

## 문장 단위 — 수동 타임스탬프

가장 단순. 배열로 문장과 시작 프레임을 정의.

```ts
type Caption = { text: string; from: number; durationInFrames: number };

const captions: Caption[] = [
  { text: "오늘은 새로운 기능 세 가지를 소개한다.", from: 0, durationInFrames: 60 },
  { text: "첫 번째는 자동 저장이다.", from: 60, durationInFrames: 60 },
  { text: "두 번째는 실시간 협업.", from: 120, durationInFrames: 60 },
];

<>
  {captions.map((c, i) => (
    <Sequence key={i} from={c.from} durationInFrames={c.durationInFrames}>
      <Caption text={c.text} />
    </Sequence>
  ))}
</>
```

음성 파일 길이에 맞추려면 `getAudioDurationInSeconds`로 전체 길이를 구하고 문장 수로 나누거나, 문장마다 수동 지정.

## SRT 파싱

SRT 파일 형식은 단순해 Remotion의 `@remotion/captions` 또는 직접 파서로 처리.

```ts
// src/subtitles/parseSrt.ts
type SrtEntry = { index: number; startMs: number; endMs: number; text: string };

export function parseSrt(raw: string): SrtEntry[] {
  return raw
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\n+/)
    .map((block) => {
      const [idx, time, ...lines] = block.split("\n");
      const m = time.match(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/);
      if (!m) return null;
      const [, h1, m1, s1, ms1, h2, m2, s2, ms2] = m;
      const toMs = (h: string, m: string, s: string, ms: string) =>
        parseInt(h) * 3600000 + parseInt(m) * 60000 + parseInt(s) * 1000 + parseInt(ms);
      return {
        index: parseInt(idx),
        startMs: toMs(h1, m1, s1, ms1),
        endMs: toMs(h2, m2, s2, ms2),
        text: lines.join("\n"),
      };
    })
    .filter((e): e is SrtEntry => e !== null);
}
```

`calculateMetadata`에서 SRT를 읽고 각 엔트리를 `from`/`durationInFrames`로 변환해 props로 전달.

## 워드 단위 — Whisper로 타임스탬프 추출

OpenAI Whisper API 또는 로컬 `whisper.cpp`로 음성에서 워드 단위 타임스탬프를 뽑는다.

```ts
// src/subtitles/transcribe.ts
type WordTimestamp = { word: string; startMs: number; endMs: number };

export async function transcribe(audioPath: string): Promise<WordTimestamp[]> {
  const form = new FormData();
  form.append("file", new Blob([await fs.readFile(audioPath)]));
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });
  const json = await res.json();
  return json.words.map((w: { word: string; start: number; end: number }) => ({
    word: w.word,
    startMs: w.start * 1000,
    endMs: w.end * 1000,
  }));
}
```

비용 — Whisper API 2026-04 기준 분당 $0.006. 10분 음성 = $0.06.

로컬 `whisper.cpp` 대안 — 오프라인 무료지만 한국어 품질이 API 대비 떨어진다. 품질이 영상 톤과 직결되므로 상용 콘텐츠는 API 권장.

## 워드 단위 렌더 — 하이라이트 이동

```tsx
const WordByWord = ({ words, fps }: { words: WordTimestamp[]; fps: number }) => {
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;
  return (
    <div style={{ fontSize: 72, lineHeight: 1.4 }}>
      {words.map((w, i) => {
        const active = currentMs >= w.startMs && currentMs < w.endMs;
        return (
          <span key={i} style={{ color: active ? "#FDE047" : "#F8FAFC", transition: "none" }}>
            {w.word}{" "}
          </span>
        );
      })}
    </div>
  );
};
```

**핵심**: `transition` CSS는 Remotion에서 무의미하니 쓰지 말 것. 매 프레임 정적으로 계산.

## 한국어 줄바꿈 — CSS만으론 부족

영어는 공백 기준 줄바꿈이 자연스럽지만, 한국어는 "어절"(띄어쓰기 덩어리)을 기준으로 끊어야 가독성이 좋다. CSS `word-break: keep-all` + `overflow-wrap: break-word` 조합:

```tsx
<div style={{
  fontSize: 56,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  lineHeight: 1.5,
  padding: "0 40px",
  textAlign: "center",
}}>
  오늘은 새로운 기능 세 가지를 소개한다
</div>
```

`keep-all`로 어절이 잘리지 않고, 가로 폭 초과 시 어절 단위로 줄바꿈.

더 정교하게 하려면 구글의 [`BudouX`](https://github.com/google/budoux) 라이브러리로 자동 분절. 한국어 프리셋 제공.

## 윤곽선(stroke) — 배경과 대비

배경 위에 자막을 얹을 때 가독성 확보.

```tsx
<div style={{
  fontSize: 64,
  color: "#FFFFFF",
  WebkitTextStroke: "3px #000000",    // Chromium 기반에서 동작
  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
  fontWeight: 800,
}}>
  오늘 발견한 꿀팁
</div>
```

`WebkitTextStroke` + `textShadow` 조합이 가장 안정적. `paint-order: stroke fill`을 추가하면 stroke가 fill 뒤에 그려져 더 깔끔.

## 자막 파일 내보내기 — SRT/VTT

렌더 결과 MP4와 별개로 SRT 파일을 함께 뽑고 싶다면 `captions` 배열을 SRT 포맷으로 변환.

```ts
export function toSrt(captions: Caption[], fps: number): string {
  return captions.map((c, i) => {
    const start = frameToTime(c.from, fps);
    const end = frameToTime(c.from + c.durationInFrames, fps);
    return `${i + 1}\n${start} --> ${end}\n${c.text}\n`;
  }).join("\n");
}

function frameToTime(frame: number, fps: number): string {
  const total = frame / fps;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const ms = Math.round((total - Math.floor(total)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}
```

YouTube/Vimeo 등에서는 SRT를 별도 업로드하면 자동 번역도 가능.

다음 — 폰트 자체를 더 다루려면 [`docs/18-fonts-deep-dive.md`](./18-fonts-deep-dive.md).
