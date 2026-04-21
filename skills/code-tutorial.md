---
name: code-tutorial
description: 코드 블록 타이핑 애니메이션 중심의 개발 튜토리얼/바이브코딩 쇼츠 컴포지션 규칙
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition, motion]
---

# Code Tutorial 스킬

## 목적

"개념 1개를 60초로 설명하는" 개발 튜토리얼 쇼츠. 핵심은 **코드 블록이 실제로 타이핑되는 것처럼** 보이는 애니메이션.

## 원칙

1. **코드는 데이터, 렌더는 계산** — 코드 문자열을 `Token[][]`으로 사전 토큰화해 props로 전달. 컴포넌트 내부에서 `useCurrentFrame`으로 글자 수 slice
2. **색은 팔레트 하나** — VSCode Dark+ 근사 팔레트 하나로 통일. 튜토리얼마다 테마 바꾸지 말 것
3. **커서는 2Hz 블링크** — `Math.floor((frame / fps) * 2) % 2`로 binary blink. CSS transition 금지
4. **타이핑 속도는 프레임 기반** — "초당 N자"가 아니라 "씬 시작~끝 사이 모든 글자" 방식. fps 변경에도 동작 보존
5. **라인 번호는 흐리게** — `#5A5A5A` 정도. 가독성 방해 없이 존재감만

## 파일 구조

```
src/
  Root.tsx
  <Composition>.tsx      # Series로 Intro → Prompt → CodeBlock → Preview → CTA
  scenes/
    IntroTitle.tsx
    PromptBox.tsx         # 채팅창 타이핑 효과
    CodeBlock.tsx         # ⭐ 핵심 컴포넌트
    ResultPreview.tsx     # 렌더 결과 미리보기 (직접 그리거나 OffthreadVideo)
    Cta.tsx
  data/
    snippets.ts           # 토큰 배열 + PALETTE
  motion.ts               # cursorBlink, enterFromBottom, fadeOut
```

## 토큰 타입

```ts
export type Token = { text: string; color?: string };
export type CodeLine = Token[];

export const PALETTE = {
  keyword: "#C586C0",  // const, return, import
  string: "#CE9178",
  function: "#DCDCAA",
  variable: "#9CDCFE",
  type: "#4EC9B0",
  comment: "#6A9955",
  number: "#B5CEA8",
  bracket: "#FFD700",
  jsxTag: "#569CD6",
  text: "#D4D4D4",
  lineNumber: "#5A5A5A",
  bg: "#1E1E1E",
  highlightBg: "rgba(255, 215, 0, 0.08)",
};
```

Shiki/Prism을 쓰려면 `calculateMetadata`에서 HTML 토큰을 위 형식으로 변환 후 props 전달.

## CodeBlock 골격

```tsx
const total = totalChars(lines);
const charsToShow = Math.floor(interpolate(frame, [0, typeEndFrame], [0, total]));

let consumed = 0;
for (const line of lines) {
  const lineLen = line.reduce((s, t) => s + t.text.length, 0);
  const remaining = charsToShow - consumed;
  const lineConsumed = Math.max(0, Math.min(lineLen, remaining));
  // 각 토큰을 slice(0, Math.min(t.text.length, lineConsumed - usedInLine))
  consumed += lineLen + 1; // 개행
}
```

현재 타이핑 중인 라인만 `highlightBg` 적용 — 시각적 포커스.

## 행동 지침 — 에이전트가 따를 것

- 사용자가 "바이브코딩 영상" / "개발 튜토리얼 쇼츠" / "코드 타이핑 영상" 요청 → 이 스킬 적용
- 코드 스니펫은 10줄 이하. 더 길면 60초에 못 담음
- 타이핑은 전체 길이의 60%를 차지하도록 (예: 60초 영상 → 30~35초 CodeBlock)
- 한글 텍스트는 Pretendard, 코드는 JetBrains Mono/Menlo/Consolas fallback
- "커서" 요소는 CodeBlock 안에만 — PromptBox는 사용자, CodeBlock은 에이전트의 비유
- 음성 내레이션이 필요하면 [`tts-korean`](./tts-korean.md) 스킬 조합 — 내레이션 시간에 맞춰 `typeEndFrame` 조정

## 금지 사항

- CSS `transition` 또는 `animation` 속성 사용 (Remotion은 정적 프레임 렌더)
- 코드 폰트에 가변폭(Pretendard 등) 적용 — 들쭉날쭉해 보임
- 타이핑 속도를 너무 빠르게 (초당 30자 초과) — 시청자가 못 따라감
- 코드 전체 한 번에 fade-in — 타이핑 효과 의미 없어짐
- 색 팔레트를 씬마다 바꾸기 — 시각적 일관성 파괴
- 코드 스니펫 10줄 초과 + 가로 60자 초과 (쇼츠 해상도에서 안 보임)

## 튜닝 가이드

- **텍스트가 잘림** — 코드 폰트 크기 `fontSize: 32` 기준. 40 이상이면 1080px 세로 폭 초과
- **타이핑이 너무 느림** — `typeEndFrame`을 fps * 20 정도로 줄임
- **커서 위치가 어긋남** — 마지막 토큰 뒤에 `<span>` 인라인 블록으로. `verticalAlign: text-bottom` 필수
- **라인 번호와 코드 간격** — 고정 width `56px` + `paddingRight: 20`

## 참고 예제

[`examples/code-tutorial/`](../examples/code-tutorial) — 60초 "VIBE CODING · 1분" 완성 구현. 토큰 배열, 커서 블링크, 라인 하이라이트 모두 포함.
