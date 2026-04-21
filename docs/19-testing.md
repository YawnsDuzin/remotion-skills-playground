# 테스트 — 컴포지션을 깨지지 않게 지키기

> 읽는 데 약 11분 · 기준일 2026-04-15

영상 코드는 "돌아가 보기 전엔 알 수 없다"는 오해가 있지만, 사실 대부분의 회귀는 컴파일 전에, 또는 1프레임 스틸 렌더로 잡힌다.
이 문서는 단위 테스트(Vitest), 스냅샷(프레임 이미지 비교), CI 통합까지 세 단계를 정리한다.

## 테스트의 3계층

| 계층 | 무엇을 | 도구 | 속도 |
|---|---|---|---|
| 1. 타입체크 | 스키마·props 형태 | `tsc --noEmit` | 1~2초 |
| 2. 단위 테스트 | 헬퍼 함수, 순수 로직 | Vitest | 5초 이내 |
| 3. 스틸 렌더 | 실제 프레임 이미지 | `renderStill` | 프레임당 2~3초 |

순서대로 통과해야 다음으로 넘어간다. 3계층까지 모두 CI에 넣을 필요는 없고, 핵심 컴포지션만.

## 1계층 — 타입체크

`tsc --noEmit`을 CI에 넣으면 `props` 누락·타입 불일치가 잡힌다. 본 저장소 [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)에 이미 포함.

zod 스키마를 `Composition`의 `schema` prop에 넘기고 `defaultProps`를 `z.infer` 타입으로 선언하면 스튜디오·렌더·단위 테스트 모두가 같은 타입 진실을 공유한다.

```ts
// src/schema.ts
export const schema = z.object({ title: z.string() });
export type Props = z.infer<typeof schema>;
export const defaultProps: Props = { title: "안녕" }; // 타입 에러 시 빌드 실패
```

## 2계층 — Vitest로 순수 함수

`motion.ts`의 프리셋, `parseSrt`, `fetchKospi` 같은 순수/외부 I/O 함수는 Vitest로.

```ts
// src/motion.test.ts
import { describe, it, expect } from "vitest";
import { enterFromBottom } from "./motion";

describe("enterFromBottom", () => {
  it("frame 0에선 opacity 0", () => {
    const { opacity } = enterFromBottom({ frame: 0, fps: 30 });
    expect(opacity).toBeCloseTo(0, 2);
  });

  it("frame 30 이후 거의 1", () => {
    const { opacity } = enterFromBottom({ frame: 60, fps: 30 });
    expect(opacity).toBeGreaterThan(0.95);
  });
});
```

설치·실행:

```bash
npm i -D vitest
npx vitest run
```

Remotion의 React 컴포넌트 테스트는 피하는 쪽이 낫다 — `useCurrentFrame()` 같은 훅이 내부 `<RemotionContext>`에 의존해 모킹이 복잡해진다. 컴포넌트 로직은 스틸 렌더(3계층)에 맡기고, 순수 함수만 Vitest로.

## 3계층 — renderStill로 프레임 이미지 비교

`@remotion/renderer`의 `renderStill`은 특정 프레임을 PNG로 뽑는다. 이걸 저장해두고 PR마다 비교하면 시각적 회귀를 잡는다.

```ts
// scripts/render-stills.ts
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const bundled = await bundle({ entryPoint: "src/index.ts" });
const comp = await selectComposition({ serveUrl: bundled, id: "TitleCardLandscape", inputProps: {} });

await renderStill({
  composition: comp,
  serveUrl: bundled,
  frame: 75,  // 중간 프레임
  output: path.join("stills", "title-landscape-f75.png"),
  inputProps: {},
});
```

PR마다 `stills/` 디렉토리가 변경되면 diff로 확인. GitHub이 PNG diff를 자동으로 보여준다.

## 스냅샷 비교 — pixelmatch

자동 회귀 감지가 필요하면 [`pixelmatch`](https://github.com/mapbox/pixelmatch)로 두 PNG의 픽셀 차이를 숫자화.

```ts
import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

function diffPng(a: string, b: string, diffPath: string): number {
  const img1 = PNG.sync.read(fs.readFileSync(a));
  const img2 = PNG.sync.read(fs.readFileSync(b));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return numDiff;
}

const d = diffPng("stills/baseline/title-f75.png", "stills/current/title-f75.png", "stills/diff.png");
if (d > 500) throw new Error(`Too many pixel diffs: ${d}`);
```

**임계값** — 완전 동일을 기대하면 0으로 하고 싶지만, 폰트 안티앨리어싱·JPEG 품질 미세 차이로 항상 10~100픽셀은 나온다. 1080p 기준 500픽셀 이하면 사실상 동일.

## CI 통합 예시

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression

on: pull_request

jobs:
  still:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - working-directory: examples/title-card
        run: |
          npm install
          npx remotion browser ensure
          node --loader tsx scripts/render-stills.ts
      - uses: actions/upload-artifact@v4
        with:
          name: stills-pr
          path: examples/title-card/stills/
      # baseline은 main 브랜치의 최신 artifact로 내려받아 비교 (생략)
```

baseline 관리는 `main`의 `stills/` 디렉토리를 커밋하는 방식이 가장 단순. 용량이 크면 Git LFS.

## 무엇을 테스트 안 해도 되나

- **Remotion 내부 API** — 이미 Remotion 팀이 테스트함
- **단순 JSX 구조** — 스냅샷 테스트는 쉽게 깨지기만 함
- **렌더 결과의 총 파일 크기** — 코덱 최적화 방식이 바뀌면 항상 다름

대신 "컴포지션의 특정 시점 스틸이 눈에 띄게 변했는가"에 집중.

## 성능 — 테스트 자체가 빠르게

- `renderStill`로 전체 프레임 말고 중간 1~2프레임만
- `width` / `height`를 반으로 낮춘 `testComp`를 별도 등록 (품질은 낮지만 레이아웃 회귀는 잡힘)
- CI에서 `--concurrency=1`로 메모리 절약

다음 — 테스트가 돌면 보안도 생각해야 한다: [`docs/20-security.md`](./20-security.md).
