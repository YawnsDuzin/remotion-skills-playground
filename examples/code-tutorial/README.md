# examples/code-tutorial

60초 세로 쇼츠 "VIBE CODING · 1분 설명" — **코드 블록 타이핑 애니메이션**이 핵심.

> 바이브코딩이란? 개발자가 자연어로 요청하면 에이전트가 코드를 쓰고, 결과를 바로 영상으로 확인하는 흐름. 이 예제는 그 과정을 60초에 시연한다.

## 실행

```bash
npm install
npm start     # Studio (http://localhost:3000)
npm run build # out/code-tutorial.mp4
```

한글 폰트는 저장소 루트에서 `bash scripts/fetch-pretendard.sh`. 코드용 고정폭 폰트는 시스템 폰트(Menlo/Consolas) 폴백 — JetBrains Mono 설치 선택사항.

## 구성 (60초)

| 구간 | 시간 | 내용 |
|---|---|---|
| Intro | 0~4s | "VIBE CODING · 1분" 타이틀 |
| Prompt | 4~10s | 사용자 프롬프트 타이핑 효과 |
| Code | 10~45s | **코드 블록 라인별 타이핑 + 구문 강조** |
| Preview | 45~53s | 작은 박스 안 렌더 결과 재생 |
| CTA | 53~60s | "직접 해보기" + 저장소 링크 |

## 구조

```
src/
  index.ts
  Root.tsx
  CodeTutorial.tsx       # Series로 5개 씬 조합
  fonts.ts
  motion.ts
  schema.ts
  data/
    snippets.ts          # 사전 토큰화된 코드 + VSCode 색 팔레트
  scenes/
    IntroTitle.tsx
    PromptBox.tsx        # 채팅창 스타일, 타이핑 효과
    CodeBlock.tsx        # ⭐ 핵심 — 토큰 단위 타이핑 + 커서 블링크 + 라인 번호
    ResultPreview.tsx    # Remotion 안 Remotion (재귀 데모)
    Cta.tsx
public/
  fonts/.gitkeep
```

## 학습 포인트

- **토큰 단위 타이핑** — `useCurrentFrame` × 타이핑 속도로 글자 수 계산, 토큰 배열을 slice
- **구문 강조** — 사전 토큰화 (Shiki 없이 직접 배열 정의) — 빌드 의존성 최소
- **커서 블링크** — `Math.floor((frame / fps) * 2) % 2` 로 2Hz
- **라인 하이라이트** — 특정 라인 배경색 spring fade
- **중첩 미리보기** — `ResultPreview`가 미니 Remotion 컴포지션 재생

## 직접 확장

- `data/snippets.ts`의 `SNIPPET` 배열을 바꾸면 다른 주제(훅/zod/tailwind 등) 튜토리얼로
- 실제 Shiki 토큰화를 적용하려면 `calculateMetadata`에서 코드 문자열을 Shiki로 돌려 토큰 배열로 변환 후 props로 전달 (빌드 시점 1회)
- 음성 내레이션을 추가하려면 [`skills/tts-korean.md`](../../skills/tts-korean.md) 스킬 조합

## 스킬

본 예제의 합성 규칙은 [`skills/code-tutorial.md`](../../skills/code-tutorial.md) — 같은 포맷의 다른 튜토리얼을 Claude Code에게 시킬 때 참고.
