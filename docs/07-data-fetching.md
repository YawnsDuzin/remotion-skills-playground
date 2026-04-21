# 데이터 패칭 — 외부 데이터로 영상 만들기

> 읽는 데 약 13분 · 기준일 2026-04-15

오늘 환율, 어제 매출, RSS 피드 — 영상에 동적인 데이터를 넣으려면 "언제 어디서 가져올지"가 핵심이다.
Remotion은 이걸 위해 두 개의 도구를 제공한다 — `calculateMetadata`(빌드 시점 fetch)와 `delayRender`(런타임 fetch). 잘못 고르면 렌더가 멈추거나 결과가 들쭉날쭉해진다.

## 두 가지 방식 한눈에

| 방식 | 호출 시점 | 결과 처리 | 어디에 적합 |
|---|---|---|---|
| `calculateMetadata` | 컴포지션 메타데이터 결정 시 1회 | props로 컴포넌트에 전달 | 영상 길이/해상도가 데이터에 따라 변할 때 |
| `delayRender` | 컴포넌트 마운트 시 매번 | 컴포넌트 state로 보유 | 컴포넌트 안에서만 쓰는 데이터 |

**일반 원칙**: 가능하면 `calculateMetadata`. 컴포넌트는 순수 함수에 가까울수록 캐싱이 잘 되고 디버깅이 쉽다.

## calculateMetadata — 1번만 부르고 재활용

`Composition`에 `calculateMetadata`를 등록하면, Studio가 켜질 때 / 렌더 시작 시 1번 실행되고 그 결과가 `defaultProps`와 합쳐져 컴포넌트에 들어간다.

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";

type Props = { city: string; weather?: WeatherData };

const calc: CalculateMetadataFunction<Props> = async ({ props }) => {
  const res = await fetch(`https://api.weather.go.kr/?city=${props.city}`);
  const weather = await res.json();
  return {
    props: { ...props, weather },
    durationInFrames: weather.alerts.length > 0 ? 600 : 300,
  };
};

<Composition id="WeatherReport" component={WeatherReport}
  fps={30} width={1080} height={1920}
  durationInFrames={300}  // 기본값 — calculateMetadata가 덮어씀
  defaultProps={{ city: "서울" }}
  calculateMetadata={calc}
/>
```

**장점**: 컴포넌트는 props만 받으면 되므로 단순하고 테스트하기 좋다. 영상 길이도 데이터에 따라 동적으로 잡을 수 있다.
**제약**: Node 환경에서 실행되므로 `window`, `document` 같은 브라우저 API는 사용 불가. `fetch`는 Node 22+에서 기본 지원이라 별도 import 불필요.

## delayRender — "이거 끝날 때까지 기다려"

컴포넌트 안에서 비동기 작업이 필요한 경우 — 폰트 로드, `Image`의 onLoad 대기, 이미 마운트된 컴포넌트가 추가 데이터를 가져와야 할 때.

```tsx
import { useState, useEffect } from "react";
import { delayRender, continueRender } from "remotion";

export const Quote = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("Fetching quote"));

  useEffect(() => {
    fetch("https://api.example.com/quote")
      .then((r) => r.json())
      .then(({ text }) => {
        setQuote(text);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle); // 실패해도 렌더는 진행
      });
  }, [handle]);

  return <h1>{quote ?? "..."}</h1>;
};
```

**핵심 규칙**:
- `delayRender`는 컴포넌트 마운트 시점에 1번만 호출 — `useState`의 게으른 초기값으로 감싸는 게 안전
- 어떤 경로로든 반드시 `continueRender`를 호출 — 안 부르면 렌더가 영원히 멈춤 (기본 타임아웃 30초)
- 동시에 여러 `delayRender`를 걸어도 됨 — 모두 `continueRender`되어야 진행

## 타임아웃 — 기본 30초

기본 타임아웃은 30초. 무거운 fetch는 명시적으로 늘려야 한다.

```tsx
const [handle] = useState(() => delayRender("Heavy API call", { timeoutInMilliseconds: 60000 }));
```

또는 컴포지션 전역으로 `Composition`의 `timeoutInMilliseconds` prop을 늘리거나, `remotion.config.ts`에서 `Config.setDelayRenderTimeoutInMilliseconds(60000)`.

## staticFile — public/ 안의 파일 안전하게 참조

`public/` 디렉토리의 파일은 직접 경로 문자열 대신 `staticFile()`로 참조해야 한다. 그래야 빌드/Lambda 환경에서도 경로가 깨지지 않는다.

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} />
<Audio src={staticFile("audio/intro.mp3")} />
```

**함정**: `public/`에 들어가는 파일 크기 한도는 사실상 디스크지만, Lambda 배포 시엔 250MB 제한. 큰 파일은 S3에 두고 URL 직접 사용.

## 환경별 분기 — getRemotionEnvironment

같은 코드가 Studio(개발)에서, 렌더(프로덕션)에서, 또는 SSR(Player)에서 다르게 동작해야 할 때.

```tsx
import { getRemotionEnvironment } from "remotion";

const env = getRemotionEnvironment();
if (env.isStudio) {
  // Studio에서만 placeholder 데이터
} else if (env.isRendering) {
  // 진짜 API 호출
} else if (env.isPlayer) {
  // 브라우저 임베드
}
```

흔한 사용처 — Studio에선 mock 데이터로 빠르게 미리보고, 렌더 시점엔 실제 API를 호출하게.

## 한국 공공 API 연동 패턴

기상청 단기예보, 한국은행 환율 API 등은 모두 인증키가 필요하다. 키는 `.env`에 두고 `process.env.<KEY>`로.

```ts
// calculateMetadata 안에서
const apiKey = process.env.KMA_API_KEY;
if (!apiKey) {
  throw new Error("KMA_API_KEY가 설정되지 않았다");
}
const url = `https://apis.data.go.kr/...&serviceKey=${encodeURIComponent(apiKey)}`;
const res = await fetch(url);
```

`encodeURIComponent`를 깜빡하면 키에 들어있는 `+`나 `/`가 URL을 깬다. 한국 공공데이터 포털 키는 거의 다 base64 변종이라 자주 발생.

`renderMedia` CLI에서 환경 변수 전달:

```bash
KMA_API_KEY=xxx npx remotion render src/index.ts WeatherReport out/today.mp4
```

GitHub Actions에선 `secrets.KMA_API_KEY`로 주입 — [`docs/10-deployment.md`](./10-deployment.md) 참고.

---

## 의사결정 흐름

1. 데이터가 영상의 길이·해상도를 결정하는가? → `calculateMetadata`
2. 데이터가 컴포넌트 내부에서만 쓰이고 props로 빼기 어려운가? → `delayRender`
3. 같은 영상을 여러 번 렌더할 때 같은 데이터여야 하는가? → `calculateMetadata` (1회 호출이라 결정적)
4. 외부 의존이 많아 자주 실패하는가? → `try/catch` + `continueRender(handle)` 보장

다음 — 데이터를 가져왔다면 음성을 입혀보자: [`docs/08-audio-tts.md`](./08-audio-tts.md).
