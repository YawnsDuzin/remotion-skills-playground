# examples/title-card

가장 단순한 Remotion 예제. 5초짜리 타이틀 카드 영상을 가로/세로 두 비율로 만든다.
[`docs/02-tutorial.md`](../../docs/02-tutorial.md)보다 먼저 읽기 좋은 입문용.

## 실행

```bash
npm install
npm start                # Studio (http://localhost:3000)
npm run build:landscape  # 1920x1080 mp4
npm run build:portrait   # 1080x1920 mp4
```

## 구조

- `src/index.ts` — `registerRoot` 진입점
- `src/Root.tsx` — 가로/세로 두 컴포지션 등록
- `src/TitleCard.tsx` — 본 컴포넌트
- `src/schema.ts` — zod 스키마
- `src/motion.ts` — 모션 프리셋 (스킬 `motion`의 축약판)

## 학습 포인트

- `Composition` 두 개를 같은 컴포넌트에서 다른 해상도로 등록
- `useCurrentFrame()` / `useVideoConfig()` 기본 사용
- `spring` + `interpolate`로 페이드인/아웃 구현
- zod 스키마로 Studio 프롭 폼 자동 생성
- 폰트 로드 (`delayRender`/`continueRender` 패턴)

## 폰트

`PretendardVariable.woff2`를 [공식 릴리스](https://github.com/orioncactus/pretendard/releases)에서 받아 `public/fonts/`에 둔다. 없어도 시스템 폰트로 대체되어 동작은 함 (한글 출력 깨질 수 있음).
