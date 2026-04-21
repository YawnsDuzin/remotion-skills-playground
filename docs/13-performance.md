# 성능 최적화 — 렌더 시간 절반으로 줄이기

> 읽는 데 약 11분 · 기준일 2026-04-15

같은 영상을 누군가는 5분에 뽑고 누군가는 30분 걸린다.
이 문서는 그 격차를 만드는 8가지 레버를 정리한다 — 컴포넌트 단계부터 CLI 옵션, 인프라까지.

## 측정 먼저

최적화는 항상 측정으로 시작한다. `--log=verbose`에 단계별 시간이 찍힌다.

```bash
npx remotion render src/index.ts MyComp out/v1.mp4 --log=verbose 2>&1 | grep -i "took\|ms"
```

또는 Node API로 더 정밀한 측정:

```ts
const start = Date.now();
await renderMedia({ /* ... */ });
console.log(`Total: ${Date.now() - start}ms`);
```

병목이 어디인지 모르고 추측하지 말 것 — 거의 항상 틀린다.

## 1. concurrency 튜닝

기본값은 CPU 코어의 절반. 대부분의 경우 코어 수의 75%까지 올리면 30~50% 빨라진다.

```bash
npx remotion render ... --concurrency=6   # 8코어 머신 기준
```

너무 올리면 swap 발생으로 오히려 느려짐. 8코어 16GB 기준 `4~6`이 스윗스팟. 모니터링 도구(htop)로 메모리 확인.

## 2. 이미지 포맷 — JPEG가 PNG보다 4배 빠름

내부적으로 매 프레임을 PNG 또는 JPEG로 떠서 ffmpeg에 넘긴다. 알파 채널이 필요 없으면 JPEG.

```ts
// remotion.config.ts
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg"); // 기본 png
Config.setJpegQuality(80);
```

품질 80은 육안으로 PNG와 구분 안 됨. 60까지 내리면 텍스트 가장자리에서 약간 티남.

## 3. 무거운 컴포넌트는 Sequence로 늦게 마운트

전체 영상에서 일부 시간만 등장하는 컴포넌트는 `Sequence`로 감싸 그 시간 동안만 마운트.

```tsx
// 안 좋음 — 시작부터 끝까지 차트 유지
<Composition durationInFrames={300}>
  <Chart data={data} />
  <Sequence from={150}>
    <Chart data={data} /> {/* 또 마운트 */}
  </Sequence>
</Composition>

// 좋음
<Sequence from={150} durationInFrames={150}>
  <Chart data={data} />
</Sequence>
```

차트 라이브러리 같은 것은 마운트 비용이 크므로 차이가 크다.

## 4. delayRender 최소화

폰트, 이미지, API 데이터 로드를 모두 `delayRender`로 잡으면 초기 렌더가 직렬화된다.

```tsx
// 안 좋음 — 매 컴포넌트가 자기 폰트 로드
const Title = () => {
  const handle = useState(() => delayRender("title font"))[0];
  // ...
}
const Subtitle = () => {
  const handle = useState(() => delayRender("subtitle font"))[0];
  // ...
}
```

폰트 로드는 `Root.tsx`에서 한 번만:

```tsx
// fonts.ts (한 번만 import됨)
const handle = delayRender();
font.load().then(() => continueRender(handle));
```

## 5. calculateMetadata 캐싱

같은 영상을 여러 번 렌더한다면 외부 API 호출 결과를 디스크에 캐시.

```ts
import fs from "node:fs/promises";
import crypto from "node:crypto";

const calc: CalculateMetadataFunction<Props> = async ({ props }) => {
  const key = crypto.createHash("sha256").update(JSON.stringify(props)).digest("hex");
  const cachePath = `.cache/${key}.json`;
  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    return JSON.parse(cached);
  } catch {
    const fresh = await fetchData(props);
    await fs.mkdir(".cache", { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(fresh));
    return fresh;
  }
};
```

[`docs/08-audio-tts.md`](./08-audio-tts.md)의 CLOVA 호출도 같은 패턴 — TTS 비용 90% 절감.

## 6. React 메모이제이션 — 신중하게

`React.memo`, `useMemo`, `useCallback`을 남발하면 오히려 느려진다 (비교 비용). 그러나 무거운 계산이 매 프레임 반복되는 경우엔 효과 큼.

```tsx
const Chart = ({ data }: { data: number[] }) => {
  const points = useMemo(() => computePolylinePoints(data), [data]); // data가 안 변하면 재계산 X
  return <svg><polyline points={points} /></svg>;
};
```

기본 원칙 — 측정해서 느린 것만 메모. `useCurrentFrame()`마다 재계산되는 것은 메모해도 효과 없음 (의존성에 frame이 들어가야 함).

## 7. 렌더 코덱 — H.264 vs ProRes vs PNG sequence

| 코덱 | 렌더 시간 (10초 1080p) | 파일 크기 | 적합 |
|---|---|---|---|
| `h264` | 30초 | 5MB | 최종 배포 |
| `h265` | 60초 | 3MB | 배포 + 저장 공간 절약 |
| `vp9` | 90초 | 4MB | 유튜브 전용 |
| `prores` | 20초 | 200MB | 후편집 |
| PNG sequence | 15초 | 600MB | 최고 품질, 알파 |

후편집이 필요하면 일단 `prores`로 빠르게 뽑고, 최종은 H.264로 인코딩.

## 8. Lambda 메모리 — 비용 함수가 비선형

Lambda 비용은 `메모리 × 실행 시간`. 메모리를 2배로 올리면 실행 시간이 절반 이하로 줄어 결과적으로 더 싸지는 경우가 많다.

| 메모리 | 1080p 30초 영상 렌더 시간 (실측 평균) | 영상당 비용 |
|---|---|---|
| 1024MB | 90초 | $0.0015 |
| 2048MB | 45초 | $0.0015 |
| 3008MB | 28초 | $0.0014 |

3008MB가 비용·속도 모두 우위. 메모리는 항상 최댓값으로 배포 권장.

---

## 일괄 렌더 — 병렬화 패턴

100개 쇼츠를 만들 때 1개씩 순차 렌더하면 느리다. 머신 코어를 갈라 병렬로:

```ts
import os from "node:os";
import pLimit from "p-limit";

const limit = pLimit(Math.max(1, Math.floor(os.cpus().length / 2)));
await Promise.all(jobs.map((job) => limit(() => renderOne(job))));
```

`os.cpus().length / 2`인 이유 — Remotion 자체가 내부적으로 워커를 쓰므로 외부 병렬 곱하면 컨텍스트 스위칭으로 손해.

## 흔한 안티 패턴

- **모든 곳에 `React.memo`** — 비교 비용이 메모 이득보다 큼
- **`useEffect`로 데이터 fetch** — `delayRender` 없이 쓰면 렌더 끝난 뒤 데이터 도착
- **거대 컴포넌트** — 1000줄짜리 Composition 컴포넌트는 분리하면 React 리렌더 범위가 줄어 빨라짐
- **PNG sequence를 자동 파이프라인 출력으로** — 디스크 I/O 폭증
- **모든 컴포지션을 4K로** — 클라이언트가 1080p로 다시 인코딩하므로 의미 없음

다음 — 용어가 헷갈릴 때 [`docs/14-glossary.md`](./14-glossary.md).
