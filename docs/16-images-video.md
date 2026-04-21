# 이미지 · 비디오 · GIF 임베드

> 읽는 데 약 11분 · 기준일 2026-04-15

Composition에 외부 미디어를 넣는 방법은 의외로 한 가지가 아니다 — `<Img>`, `<Video>`, `<OffthreadVideo>`, `<Gif>`, `<Iframe>`까지 다섯 개. 잘못 고르면 렌더가 느려지거나 깨진다.
이 문서는 각 컴포넌트의 차이점, 정적 에셋 vs 원격 URL 처리, aspect ratio·프리로딩까지 다룬다.

## 한눈에 비교

| 컴포넌트 | 용도 | 성능 | 비고 |
|---|---|---|---|
| `<Img>` | 정적 이미지 (JPG/PNG/WebP/AVIF) | ⚡ 빠름 | Remotion 4.x 기본 포함 |
| `<Video>` | 짧은 배경 비디오 | 🐢 느림 | 매 프레임 Chromium 디코드 |
| `<OffthreadVideo>` | 긴 비디오, 성능 중요 | ⚡ 매우 빠름 | FFmpeg로 프레임 사전 추출 |
| `<Gif>` (`@remotion/gif`) | GIF 애니메이션 | ⚡ 보통 | 별도 패키지 |
| `<Iframe>` | 외부 웹페이지 캡처 | 🐢 느림 | 드물게 사용 |

## Img — 정적 이미지

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} style={{ width: 200 }} />
<Img src="https://cdn.example.com/banner.webp" style={{ width: "100%" }} />
```

`<img>` HTML 태그와 차이 — Remotion의 `<Img>`는 이미지 로드가 끝날 때까지 자동으로 `delayRender`를 걸고 기다린다. `onError`로 실패 처리도 가능.

**로컬 파일**: `staticFile()`로 감싸야 Lambda·Cloud Run에서도 안전. 원시 경로(`/logo.png`)는 개발 중엔 되지만 프로덕션에서 종종 깨짐.
**원격 URL**: `fetch`가 가능한 URL이면 OK. 단 CORS 설정된 도메인만.

## Video — 간단하지만 느림

```tsx
import { Video, staticFile } from "remotion";

<Video src={staticFile("clips/intro.mp4")} />
```

`<video>` HTML 태그를 Remotion이 감싼 형태. 매 프레임 Chromium이 `requestVideoFrameCallback`으로 디코드하기 때문에 렌더 속도가 크게 떨어진다.

**언제 쓰나**: 5초 미만의 짧은 영상 1~2개를 전체 컴포지션 길이의 일부에만 쓸 때. 그 외엔 `OffthreadVideo`로.

## OffthreadVideo — 권장

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo src={staticFile("clips/main.mp4")} />
```

렌더 시작 전 FFmpeg가 영상 프레임을 JPEG로 미리 추출해 놓고 각 프레임을 "이미지처럼" 사용. 렌더 속도 5~10배 빠름.

**트레이드오프**: FFmpeg 추출 단계가 20~40초 추가됨 (영상 길이 비례). 따라서 짧은 클립에는 `<Video>`, 긴 영상에는 `<OffthreadVideo>`. 일반적으로 3초 이상이면 `OffthreadVideo`.

**Lambda 제약**: 원격 URL로 `<OffthreadVideo>`를 쓰려면 해당 도메인이 CORS 허용돼야 한다. 안 되면 사전에 S3로 복사 후 사용.

## Gif — @remotion/gif

```bash
npm i @remotion/gif
```

```tsx
import { Gif } from "@remotion/gif";
import { staticFile } from "remotion";

<Gif src={staticFile("loading.gif")} width={200} height={200} fit="contain" />
```

투명도 유지하려면 `fit="contain"`. `fit="cover"`로 채우면 잘린다. `loopBehavior` 옵션으로 영상 끝에 도달 시 처리 제어.

## 재생 시점 제어 — startFrom / endAt

비디오의 일부만 쓰고 싶을 때.

```tsx
<OffthreadVideo
  src={staticFile("full.mp4")}
  startFrom={30}          // 원본의 1초 지점부터
  endAt={180}             // 6초 지점까지 (30fps 기준)
  muted                   // 오디오 트랙 제거
  volume={0.5}            // 또는 함수 (frame) => number
/>
```

`startFrom`·`endAt`의 단위는 컴포지션 fps 기준 프레임.

## aspect ratio 맞추기

원본과 컴포지션 비율이 다를 때.

```tsx
// 16:9 원본 → 9:16 컴포지션에 맞추기 (꽉 채우고 잘림)
<OffthreadVideo src={staticFile("wide.mp4")} style={{
  width: "100%", height: "100%", objectFit: "cover"
}} />

// 16:9 원본 → 9:16 컴포지션 (여백 생기고 중앙 배치)
<OffthreadVideo src={staticFile("wide.mp4")} style={{
  width: "100%", height: "100%", objectFit: "contain"
}} />
```

자동 블러 배경(유튜브 쇼츠 스타일):

```tsx
<AbsoluteFill>
  <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)", transform: "scale(1.2)" }} />
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <OffthreadVideo src={src} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
  </AbsoluteFill>
</AbsoluteFill>
```

## 프리로딩 — 재생 타이밍에 아슬아슬한 경우

`prefetch()`로 미디어를 컴포지션 마운트 전에 미리 가져올 수 있다.

```tsx
import { prefetch } from "remotion";

// Root.tsx 또는 calculateMetadata 안에서
await prefetch(staticFile("big-intro.mp4"), { method: "blob-url" });
```

`Player`에서 특히 유용 — 재생 시작 전에 버퍼링 지연을 없앤다.

## 흔한 함정

1. **`<Video>`가 렌더 결과에서만 안 나옴** — Studio에선 보이는데 렌더 결과엔 검은 화면. 99%는 `staticFile` 누락
2. **`<OffthreadVideo>`에 제어 불가** — 일시정지·재생 상태를 JS에서 바꿀 수 없음. 필요하면 `Video`로
3. **이미지 투명 배경 날아감** — PNG로 저장된 투명 이미지도 렌더 코덱이 `h264`(yuv420p)면 투명도 소실. 알파 필요시 `prores` 또는 PNG sequence
4. **원격 URL의 404가 렌더 통째로 죽임** — `<Img>`는 로드 실패 시 throw. `onError`로 fallback 컴포넌트 렌더
5. **HEIC/HEIF 이미지** — iOS 기본 포맷. Chromium이 직접 디코드 못함. JPG/PNG로 변환 후 사용

## 실전 예제 — 데이터 + B-roll 하이브리드

본 문서의 패턴을 묶은 완성 예제: [`examples/finance-broll/`](../examples/finance-broll). 30초 KOSPI/환율 리포트의 씬 사이에 Veo 또는 Pexels B-roll을 `<OffthreadVideo>`로 끼워넣고, 데이터 카드를 `AbsoluteFill` 오버레이로 합성한다. 합성 규칙 스킬은 [`skills/broll-composition.md`](../skills/broll-composition.md).

다음 — 비디오에 자막을 얹으려면 [`docs/17-subtitles.md`](./17-subtitles.md).
