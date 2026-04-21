# Remotion Player — 영상을 웹에서 그대로 재생

> 읽는 데 약 11분 · 기준일 2026-04-15 · `@remotion/player`

"매번 렌더해서 MP4로 배포하지 말고, 사용자 브라우저에서 바로 Remotion Composition을 재생하고 싶다."
그럴 때 쓰는 게 `@remotion/player`다 — React 컴포넌트 하나로, 컴포지션을 `<video>` 태그처럼 끼워 넣는다.

## 언제 MP4 대신 Player를 쓰나

| 상황 | 권장 |
|---|---|
| 개인화된 영상 (사용자 이름/데이터 삽입) | Player |
| 매번 props가 달라지는 대시보드 | Player |
| 영상 10만 명이 동시에 본다 | MP4 + CDN |
| SNS 공유용, 다운로드 가능해야 함 | MP4 |
| 관리자만 보는 미리보기 | Player |

원칙 — 재생이 N번 미만이고 각각 props가 다르면 Player, N번 이상이면 한 번 렌더해 CDN.

## 설치

```bash
npm i @remotion/player
```

React 18 이상 필요. 내부적으로 `iframe`이 아닌 실제 React 트리로 렌더되므로 SSR 환경(Next.js, Remix)에서도 동작한다.

## 가장 단순한 예

```tsx
import { Player } from "@remotion/player";
import { TitleCard } from "./compositions/TitleCard";

export const MyPage = () => (
  <Player
    component={TitleCard}
    durationInFrames={150}
    fps={30}
    compositionWidth={1920}
    compositionHeight={1080}
    style={{ width: "100%", aspectRatio: "16 / 9" }}
    controls
    inputProps={{ title: "안녕", subtitle: "실시간 렌더", accentColor: "#38BDF8" }}
  />
);
```

`Composition` 대신 직접 `component` + 메타데이터를 넘긴다. `inputProps`가 컴포지션의 props에 해당.

## 제어 — play/pause/seek

ref로 instance API에 접근해 외부 UI와 묶는다.

```tsx
import { useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";

const playerRef = useRef<PlayerRef>(null);

<Player ref={playerRef} /* ... */ />
<button onClick={() => playerRef.current?.play()}>재생</button>
<button onClick={() => playerRef.current?.pause()}>일시정지</button>
<button onClick={() => playerRef.current?.seekTo(30)}>1초 지점</button>
```

주요 메서드: `play`, `pause`, `toggle`, `seekTo(frame)`, `getCurrentFrame()`, `isPlaying()`, `mute` / `unmute`, `setVolume(0~1)`.

이벤트 리스너: `playerRef.current?.addEventListener("play"|"pause"|"seeked"|"ended"|"timeupdate", cb)`.

## Next.js / Remix에서 쓸 때

Player는 클라이언트 컴포넌트 — SSR에서 `FontFace` 같은 브라우저 API를 쓰면 깨진다. 해결책:

1. App Router에서는 `"use client"` 선언이 있는 컴포넌트에서만 import
2. Pages Router에서는 `dynamic(() => import("./PlayerClient"), { ssr: false })`
3. 폰트는 클라이언트 전용 `fonts.ts`로 격리

`@remotion/player`가 포함된 번들 크기는 gzip 기준 약 130KB. LCP에 영향 있으니 가능하면 지연 로딩.

## 반응형

`style`의 `width` / `maxWidth` / `aspectRatio`로 반응형. Player는 compositionWidth/Height 기준으로 내부 렌더하고 CSS로 스케일링하므로 해상도 손실 없음.

모바일에서 사운드는 사용자 제스처 후에만 재생 가능(브라우저 정책) — 기본 `autoPlay`는 `muted`로 시작해야 동작.

## 스크러빙 — 마우스 끌어서 프레임 제어

`clickToPlay={true}` (기본) + `allowFullscreen` + 커스텀 타임라인 UI를 원한다면 `showVolumeControls`, `doubleClickToFullscreen` 옵션 조합. 완전 커스텀이 필요하면 Player의 내장 `controls`를 끄고 직접 버튼 UI 만든다.

```tsx
<Player
  controls={false}
  inFrame={startFrame}    // 재생 구간 제한
  outFrame={endFrame}
  loop
/>
```

## Player vs MP4 — 런타임 비용

Player는 매 프레임을 React가 다시 그리므로 다음은 실시간 재생에 치명적:

- 한 프레임에 1000개 이상 DOM 요소
- `<Video>` 여러 개 동시 재생 (디코딩 CPU)
- 100만 포인트 SVG

그래서 Player 대상 컴포지션은 "실시간 재생 가능한가?" 성능 예산을 따로 세운다. 안 되면 MP4 폴백. 성능 측정은 Player의 내장 `onError` + Chrome DevTools Performance 탭으로.

## 동일 컴포지션을 Player와 렌더 모두에서 재활용

컴포지션 컴포넌트는 그대로 두고, 쓰임새만 분기한다.

```tsx
// src/compositions/TitleCard.tsx — 그대로
// src/Root.tsx                     — Composition 등록 (렌더용)
// src/PlayerPage.tsx               — Player 래퍼 (웹 임베드용)
```

같은 `TitleCard`를 둘 다 import. 유일한 차이는 `<Composition>` vs `<Player>` 감싸는 법뿐이다.

---

## 흔한 함정

1. **폰트가 Player에서 안 보임** — `FontFace`가 SSR 시점에 실행되어 실패. 위 "Next.js" 섹션 참고
2. **`inputProps`가 리렌더마다 새 객체** — `useMemo`로 감싸 컴포지션 재마운트 방지
3. **영상 프레임률이 모니터와 다름** — Player는 `fps={30}`이면 모니터가 60Hz여도 30fps로 재생. 보간 없음
4. **iOS Safari에서 무음** — autoPlay + sound는 불가. `muted` 또는 사용자 제스처 필요

다음 — 영상 안에 이미지/비디오 넣으려면 [`docs/16-images-video.md`](./16-images-video.md).
