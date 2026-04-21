---
name: remotion-composition
description: Remotion Composition을 작성할 때 따라야 할 구조 규칙
install_to: .claude/skills/
version: 0.1.0
---

# Remotion Composition 작성 규칙

## 원칙

1. `durationInFrames`은 반드시 `fps * seconds`의 정수 결과여야 한다. 소수점이면 CLI가 거부한다.
2. 세로 쇼츠는 `width: 1080, height: 1920`, 가로 유튜브는 `width: 1920, height: 1080`을 기본으로 쓴다.
3. 컴포넌트는 `src/compositions/<name>/`에 한 폴더로 몰아둔다. 진입점은 `index.tsx`.
4. `Composition`의 `defaultProps`는 타입 추론이 되도록 `const`로 만든 객체를 풀어서 전달한다.

## 파일 구조

```
src/
  Root.tsx              # registerRoot 진입점
  compositions/
    weather-menu/
      index.tsx         # <Composition /> 선언
      Weather.tsx       # 날씨 레이어
      Menu.tsx          # 메뉴 레이어
      schema.ts         # zod 스키마 (있으면 Studio에서 폼 자동 생성)
```

## Composition 선언 템플릿

```tsx
import { Composition } from "remotion";
import { WeatherMenu, weatherMenuSchema, defaultProps } from "./compositions/weather-menu";

export const Root = () => (
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
```

## 금지 사항

- `setInterval` / `setTimeout` — 렌더는 순수 함수여야 한다. 시간 기반 변화는 `useCurrentFrame()`으로
- 외부 이미지 `<img src="https://...">` 직접 로드 — 네트워크 실패 시 렌더가 깨짐. `staticFile()`로 다운로드 후 참조
- `window.fetch`를 컴포넌트 본문에서 호출 — 데이터는 `calculateMetadata`에서 미리 받아 props로 전달

## 타이밍 계산 헬퍼

```ts
export const sec = (s: number, fps = 30) => Math.round(s * fps);
```

에이전트가 "2초 후 페이드인" 같은 요청을 받으면 `sec(2)`로 변환할 것.
