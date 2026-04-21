# examples/weather-menu

`docs/02-tutorial.md` 튜토리얼의 완성 결과물. 날씨에 따라 메뉴 추천이 바뀌는 10초 세로 쇼츠.

## 실행

```bash
npm install
npm start     # Remotion Studio 실행 (http://localhost:3000)
npm run build # out/weather-menu.mp4 생성
```

## 구조

- `src/index.ts` — `registerRoot` 진입점
- `src/Root.tsx` — `<Composition />` 선언
- `src/Weather.tsx` — 날씨 아이콘 레이어
- `src/Menu.tsx` — 메뉴 3개 카드 레이어
- `src/schema.ts` — zod 프롭 스키마
- `src/fonts.ts` — Pretendard 로더

## 주의

- Pretendard `.woff2`는 별도 다운로드 필요 — [공식 릴리스](https://github.com/orioncactus/pretendard/releases)에서 `PretendardVariable.woff2`를 `public/fonts/`에 넣을 것
- `out/` 디렉토리는 `.gitignore`에 잡혀 있음
